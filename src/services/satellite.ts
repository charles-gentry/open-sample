import {
  twoline2satrec,
  propagate,
  eciToGeodetic,
  gstime,
  degreesLong,
  degreesLat,
} from 'satellite.js';

export interface SatellitePass {
  satellite: string;
  time: Date;
}

const SENTINEL_TLES: Record<string, { noradId: string; line1: string; line2: string }> = {
  'Sentinel-2A': {
    noradId: '40697',
    line1: '1 40697U 15028A   24001.50000000  .00000023  00000-0  11553-4 0  9998',
    line2: '2 40697  98.5693  13.0364 0001083  91.3416 268.7916 14.30818200459998',
  },
  'Sentinel-2B': {
    noradId: '42063',
    line1: '1 42063U 17013A   24001.50000000  .00000030  00000-0  14204-4 0  9994',
    line2: '2 42063  98.5693 193.0364 0001083  91.3416 268.7916 14.30818200349998',
  },
};

const SWATH_KM = 290;

async function fetchTLE(noradId: string): Promise<{ line1: string; line2: string } | null> {
  try {
    const res = await fetch(
      `https://celestrak.org/NORAD/elements/gp.php?CATNR=${noradId}&FORMAT=tle`
    );
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.trim().split('\n');
    if (lines.length >= 3) {
      return { line1: lines[1].trim(), line2: lines[2].trim() };
    }
    if (lines.length >= 2) {
      return { line1: lines[0].trim(), line2: lines[1].trim() };
    }
    return null;
  } catch {
    return null;
  }
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function computeSentinelPasses(
  lat: number,
  lng: number,
  days: number = 14
): Promise<SatellitePass[]> {
  const passes: SatellitePass[] = [];
  const now = new Date();
  const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  for (const [name, fallback] of Object.entries(SENTINEL_TLES)) {
    const tle = (await fetchTLE(fallback.noradId)) || fallback;
    const satrec = twoline2satrec(tle.line1, tle.line2);

    let inPass = false;
    let passTime: Date | null = null;
    let minDist = Infinity;

    for (let t = now.getTime(); t < end.getTime(); t += 60000) {
      const date = new Date(t);
      const result = propagate(satrec, date)!;
      const pos = result?.position;
      if (typeof pos === 'boolean' || !pos) continue;

      const gmst = gstime(date);
      const geo = eciToGeodetic(pos, gmst);
      const satLat = degreesLat(geo.latitude);
      const satLng = degreesLong(geo.longitude);
      const dist = haversineDistance(lat, lng, satLat, satLng);

      if (dist < SWATH_KM) {
        if (!inPass) {
          inPass = true;
          passTime = date;
          minDist = dist;
        } else if (dist < minDist) {
          passTime = date;
          minDist = dist;
        }
      } else if (inPass) {
        inPass = false;
        if (passTime) {
          passes.push({ satellite: name, time: passTime });
        }
        passTime = null;
        minDist = Infinity;
      }
    }
    if (inPass && passTime) {
      passes.push({ satellite: name, time: passTime });
    }
  }

  return passes.sort((a, b) => a.time.getTime() - b.time.getTime());
}
