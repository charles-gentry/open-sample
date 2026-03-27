import { useMemo, useState, useRef, useCallback } from 'react';
import * as turf from '@turf/turf';
import { usePlanStore } from '../../stores/planStore';
import { useWeather } from '../../hooks/useWeather';
import { useSatellitePasses } from '../../hooks/useSatellitePasses';
import type { SatellitePass } from '../../services/satellite';
import WeatherDay from './WeatherDay';

export default function CalendarStrip() {
  const polygon = usePlanStore((s) => s.polygon);
  const targetDate = usePlanStore((s) => s.targetDate);
  const setTargetDate = usePlanStore((s) => s.setTargetDate);
  const [cloudThreshold, setCloudThreshold] = useState(30);
  const [expanded, setExpanded] = useState(false);

  // Drag-to-scroll state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, didDrag: false });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragState.current = { startX: e.pageX, scrollLeft: el.scrollLeft, didDrag: false };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.pageX - dragState.current.startX;
    if (Math.abs(dx) > 3) dragState.current.didDrag = true;
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - dx;
  }, [isDragging]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleSelectDate = useCallback((date: string) => {
    if (dragState.current.didDrag) return;
    setTargetDate(targetDate === date ? null : date);
  }, [targetDate, setTargetDate]);

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

  const handle = (
    <button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      className="flex-shrink-0 w-8 bg-white/90 backdrop-blur-md rounded-r-2xl shadow-2xl border border-l-0 border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
      aria-label={expanded ? 'Collapse weather panel' : 'Expand weather panel'}
    >
      <svg
        className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );

  const panelWidthClass = expanded ? 'w-[calc(100vw-23rem)]' : 'w-0';

  if (!polygon) {
    return (
      <div className="flex items-stretch">
        <div className={`overflow-hidden transition-[width] duration-300 ease-in-out ${panelWidthClass}`}>
          <div
            className="h-[310px] bg-white/90 backdrop-blur-md shadow-2xl border border-l-0 border-slate-200/60 flex items-center justify-center text-sm text-slate-400"
            style={{ minWidth: 'calc(100vw - 23rem)' }}
          >
            Draw a polygon to see weather forecast and satellite passes
          </div>
        </div>
        {handle}
      </div>
    );
  }

  return (
    <div className="flex items-stretch">
      <div className={`overflow-hidden transition-[width] duration-300 ease-in-out ${panelWidthClass}`}>
        <div
          className="bg-white/90 backdrop-blur-md shadow-2xl border border-l-0 border-slate-200/60 overflow-hidden h-[310px]"
          style={{ minWidth: 'calc(100vw - 23rem)' }}
        >
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
          </div>
          <div
            ref={scrollRef}
            className={`flex overflow-x-auto scrollbar-hide gap-2 px-3 py-2.5 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
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
                selected={targetDate === day.date}
                onSelect={handleSelectDate}
              />
            ))}
          </div>
        </div>
      </div>
      {handle}
    </div>
  );
}
