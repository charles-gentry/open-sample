import { useMemo } from 'react';
import * as turf from '@turf/turf';
import { usePlanStore } from '../../stores/planStore';
import { useWeather } from '../../hooks/useWeather';
import { useSatellitePasses } from '../../hooks/useSatellitePasses';
import WeatherDay from './WeatherDay';
import SatellitePassIndicator from './SatellitePassIndicator';

export default function CalendarStrip() {
  const polygon = usePlanStore((s) => s.polygon);

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

  if (!polygon) {
    return (
      <div className="h-28 bg-gray-50 border-t border-gray-200 flex items-center justify-center text-sm text-gray-400">
        Draw a polygon to see weather forecast and satellite passes
      </div>
    );
  }

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="flex items-center gap-2 px-3 py-1">
        <span className="text-xs font-medium text-gray-500 shrink-0">14-Day Forecast</span>
        <SatellitePassIndicator passes={passes} />
      </div>
      <div className="flex overflow-x-auto px-2 pb-2">
        {weatherLoading && (
          <div className="flex items-center justify-center w-full py-4 text-sm text-gray-400">
            Loading weather...
          </div>
        )}
        {weather?.map((day) => <WeatherDay key={day.date} day={day} />)}
      </div>
    </div>
  );
}
