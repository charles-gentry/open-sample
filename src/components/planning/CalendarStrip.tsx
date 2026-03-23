import { useMemo, useState } from 'react';
import * as turf from '@turf/turf';
import { usePlanStore } from '../../stores/planStore';
import { useWeather } from '../../hooks/useWeather';
import { useSatellitePasses } from '../../hooks/useSatellitePasses';
import type { SatellitePass } from '../../services/satellite';
import WeatherDay from './WeatherDay';

export default function CalendarStrip() {
  const polygon = usePlanStore((s) => s.polygon);
  const [cloudThreshold, setCloudThreshold] = useState(30);

  const centroid = useMemo(() => {
    if (!polygon) return null;
    const c = turf.centroid(polygon);
    return { lat: c.geometry.coordinates[1], lng: c.geometry.coordinates[0] };
  }, [polygon]);

  const { data: weather, loading: weatherLoading } = useWeather(
    centroid?.lat ?? null,
    centroid?.lng ?? null
  );
  const { passes } = useSatellitePasses(
    centroid?.lat ?? null,
    centroid?.lng ?? null
  );

  const passesByDate = useMemo(() => {
    const map = new Map<string, SatellitePass[]>();
    for (const pass of passes) {
      const key = pass.time.toLocaleDateString('en-CA');
      map.set(key, [...(map.get(key) ?? []), pass]);
    }
    return map;
  }, [passes]);

  if (!polygon) {
    return (
      <div className="h-28 bg-gray-50 border-t border-gray-200 flex items-center justify-center text-sm text-gray-400">
        Draw a polygon to see weather forecast and satellite passes
      </div>
    );
  }

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100">
        <span className="text-xs font-medium text-gray-500 shrink-0">14-Day Forecast</span>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-500 shrink-0">☁️ Clear pass &lt;</span>
          <input
            type="range"
            min={0}
            max={100}
            value={cloudThreshold}
            onChange={(e) => setCloudThreshold(Number(e.target.value))}
            className="w-24 accent-green-500"
          />
          <span className="text-xs font-medium text-gray-700 w-8 text-right">{cloudThreshold}%</span>
        </div>
      </div>
      <div className="flex overflow-x-auto gap-2 px-2 py-2">
        {weatherLoading && (
          <div className="flex items-center justify-center w-full py-4 text-sm text-gray-400">
            Loading weather...
          </div>
        )}
        {weather?.map((day) => (
          <WeatherDay
            key={day.date}
            day={day}
            passes={passesByDate.get(day.date) ?? []}
            cloudThreshold={cloudThreshold}
          />
        ))}
      </div>
    </div>
  );
}
