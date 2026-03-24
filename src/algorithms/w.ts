import * as turf from '@turf/turf';
import type { SamplingPoint } from '../types/plan';
import { isInsidePolygon, satisfiesMinDistance } from './common';

export function generateW(
  polygon: GeoJSON.Feature<GeoJSON.Polygon>,
  count: number,
  minDistance: number
): SamplingPoint[] {
  const bbox = turf.bbox(polygon);
  const [minLng, minLat, maxLng, maxLat] = bbox;

  // Define W shape vertices within the bounding box with some inset
  const insetX = (maxLng - minLng) * 0.05;
  const insetY = (maxLat - minLat) * 0.05;
  const left = minLng + insetX;
  const right = maxLng - insetX;
  const top = maxLat - insetY;
  const bottom = minLat + insetY;
  const midX = (left + right) / 2;
  const quarterX = (left + midX) / 2;
  const threeQuarterX = (midX + right) / 2;

  // W shape: top-left -> bottom-quarter -> top-center -> bottom-three-quarter -> top-right
  const wVertices: [number, number][] = [
    [left, top],
    [quarterX, bottom],
    [midX, top],
    [threeQuarterX, bottom],
    [right, top],
  ];

  const line = turf.lineString(wVertices);
  const totalLength = turf.length(line, { units: 'kilometers' });

  // Generate more candidate points than needed to account for polygon clipping
  const overSample = Math.max(count * 3, 50);
  const candidates: SamplingPoint[] = [];

  for (let i = 0; i < overSample; i++) {
    const distance = (i / (overSample - 1)) * totalLength;
    const pt = turf.along(line, distance, { units: 'kilometers' });
    const [lng, lat] = pt.geometry.coordinates;
    candidates.push({ lng, lat });
  }

  // Filter to points inside the polygon
  const inside = candidates.filter((pt) => isInsidePolygon(pt, polygon));

  // Select evenly spaced points from the filtered set
  const points: SamplingPoint[] = [];
  if (inside.length <= count) {
    // Use all available points that satisfy min distance
    for (const pt of inside) {
      if (satisfiesMinDistance(pt, points, minDistance)) {
        points.push(pt);
      }
    }
  } else {
    // Pick evenly spaced points from the inside set
    for (let i = 0; i < count; i++) {
      const idx = Math.round((i / (count - 1)) * (inside.length - 1));
      const pt = inside[idx];
      if (satisfiesMinDistance(pt, points, minDistance)) {
        points.push(pt);
      }
    }

    // If we didn't get enough due to min distance, fill from remaining candidates
    if (points.length < count) {
      for (const pt of inside) {
        if (points.length >= count) break;
        if (satisfiesMinDistance(pt, points, minDistance)) {
          points.push(pt);
        }
      }
    }
  }

  return points;
}
