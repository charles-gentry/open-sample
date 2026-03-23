import { useState, useEffect } from 'react';
import { fetchWeather, type DailyWeather } from '../services/weather';

export function useWeather(lat: number | null, lng: number | null) {
  const [data, setData] = useState<DailyWeather[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lat === null || lng === null) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchWeather(lat, lng)
      .then((days) => {
        if (!cancelled) {
          setData(days);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  return { data, loading, error };
}
