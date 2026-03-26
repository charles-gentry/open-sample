import { useMemo, useState } from 'react';
import * as turf from '@turf/turf';
import { usePlanStore } from '../../stores/planStore';
import { useWeather } from '../../hooks/useWeather';
import { useSatellitePasses } from '../../hooks/useSatellitePasses';
import type { SatellitePass } from '../../services/satellite';
import WeatherDay from './WeatherDay';

interface CalendarStripProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export default function CalendarStrip({ collapsed, onToggleCollapsed }: CalendarStripProps) {
  const polygon = usePlanStore((s) => s.polygon);
  const [cloudThreshold, setCloudThreshold] = useState(30);

  const centroid = useMemo(() => {
    if (!polygon) return null;
    const c = turf.centroid(polygon);
    return { lat: c.geometry.coordinates[1], lng: c.geometry.coordinates[0] };
  }, [polygon]);

  const { data: weatherResult, loading: weatherLoading } = useWeather(
    centroid?.lat ?? null,
    centroid?.lng ?? null
  );
  const weather = weatherResult?.days ?? null;
  const timezone = weatherResult?.timezone ?? 'UTC';
  const { passes } = useSatellitePasses(
    centroid?.lat ?? null,
    centroid?.lng ?? null
  );

  const passesByDate = useMemo(() => {
    const sunTimes = new Map<string, { sunrise: string; sunset: string }>();
    if (weather) {
      for (const day of weather) {
        sunTimes.set(day.date, {
          sunrise: day.sunrise.slice(11),
          sunset: day.sunset.slice(11),
        });
      }
    }

    const map = new Map<string, SatellitePass[]>();
    for (const pass of passes) {
      const key = pass.time.toLocaleDateString('en-CA', { timeZone: timezone });
      const sun = sunTimes.get(key);
      if (sun) {
        const localTime = pass.time.toLocaleTimeString('en-CA', {
          hour12: false, hour: '2-digit', minute: '2-digit', timeZone: timezone,
        });
        if (localTime < sun.sunrise || localTime > sun.sunset) continue;
      }
      map.set(key, [...(map.get(key) ?? []), pass]);
    }
    return map;
  }, [passes, weather, timezone]);

  if (!polygon) {
    return (
      <div className="h-20 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60 flex items-center justify-center text-sm text-slate-400">
        Draw a polygon to see weather forecast and satellite passes
      </div>
    );
  }

  return (
    <div className={`bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden transition-all duration-300 ease-in-out ${collapsed ? 'max-w-[220px]' : 'max-w-full'}`}>
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100/80">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">14-Day Forecast</span>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-slate-400 shrink-0">☁️ Clear pass &lt;</span>
          <input
            type="range"
            min={0}
            max={100}
            value={cloudThreshold}
            onChange={(e) => setCloudThreshold(Number(e.target.value))}
            className="w-24 accent-brand"
          />
          <span className="text-xs font-bold text-slate-700 w-8 text-right">{cloudThreshold}%</span>
        </div>
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          className="ml-auto text-slate-400 hover:text-slate-600"
        >
          {collapsed ? '▸' : '◂'}
        </button>
      </div>
      <div className="overflow-hidden">
        <div className="flex overflow-x-auto gap-2 px-3 py-2.5">
          {weatherLoading && (
            <div className="flex items-center justify-center w-full py-4 text-sm text-slate-400">
              Loading weather...
            </div>
          )}
          {weather?.map((day) => (
            <WeatherDay
              key={day.date}
              day={day}
              passes={passesByDate.get(day.date) ?? []}
              cloudThreshold={cloudThreshold}
              timezone={timezone}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
