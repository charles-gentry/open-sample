import { useState, useEffect } from 'react';
import { computeSentinelPasses, type SatellitePass } from '../services/satellite';

export function useSatellitePasses(lat: number | null, lng: number | null) {
  const [passes, setPasses] = useState<SatellitePass[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lat === null || lng === null) return;

    let cancelled = false;
    setLoading(true);

    computeSentinelPasses(lat, lng).then((result) => {
      if (!cancelled) {
        setPasses(result);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  return { passes, loading };
}
