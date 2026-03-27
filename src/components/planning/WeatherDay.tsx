import type { DailyWeather } from '../../services/weather';
import { weatherCodeToLabel } from '../../services/weather';
import type { SatellitePass } from '../../services/satellite';

interface WeatherDayProps {
  day: DailyWeather;
  passes: SatellitePass[];
  cloudThreshold: number;
  timezone: string;
  selected?: boolean;
  onSelect?: (date: string) => void;
}

export default function WeatherDay({ day, passes, cloudThreshold, timezone, selected, onSelect }: WeatherDayProps) {
  const { icon } = weatherCodeToLabel(day.weatherCode);
  const date = new Date(day.date + 'T00:00:00');
  const dayName = date.toLocaleDateString('en', { weekday: 'short' });
  const dayNum = date.getDate();

  const isClearPass = passes.length > 0 && day.cloudCover < cloudThreshold;
  const cardClass = isClearPass
    ? 'bg-brand-light ring-2 ring-brand border-transparent'
    : 'bg-white/95 border border-slate-200/80 hover:border-brand-glow hover:shadow-md';

  const selectedClass = selected ? 'ring-2 ring-brand ring-offset-2' : '';

  return (
    <button
      type="button"
      onClick={() => onSelect?.(day.date)}
      className={`flex flex-col gap-1.5 min-w-[100px] rounded-2xl px-2.5 py-3 transition-all duration-150 text-left ${cardClass} ${selectedClass}`}
    >
      <div className="flex flex-col items-center w-full">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{dayName}</span>
        <span className="text-xl font-black text-slate-900 leading-none">{dayNum}</span>
      </div>

      <span className="text-2xl text-center leading-none w-full">{icon}</span>

      <span className="text-[11px] font-medium text-slate-600 text-center tabular-nums w-full">
        ↑{Math.round(day.tempMax)}° ↓{Math.round(day.tempMin)}°
      </span>

      <span className={`text-[11px] text-center font-medium tabular-nums w-full ${day.cloudCover < cloudThreshold ? 'text-brand font-bold' : 'text-slate-400'}`}>
        ☁ {day.cloudCover}%
      </span>

      {day.precipProb > 0 && (
        <span className="text-[11px] text-sky-500 text-center font-medium tabular-nums w-full">💧{day.precipProb}%</span>
      )}

      {passes.length > 0 && (
        <div className="mt-1 pt-1.5 border-t border-slate-200/60 flex flex-col gap-1 w-full">
          {passes.map((pass, i) => (
            <div key={i} className="flex items-center gap-1 bg-brand-light rounded-lg px-1.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse-dot flex-shrink-0" />
              <span className="text-[9px] font-bold text-brand leading-none">
                {pass.satellite.replace('Sentinel-', 'S')}
              </span>
              <span className="text-[9px] text-slate-500 leading-none ml-auto tabular-nums whitespace-nowrap">
                {pass.time.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', timeZone: timezone })}
              </span>
            </div>
          ))}
        </div>
      )}

      <span className={`text-[9px] font-black text-brand text-center uppercase tracking-widest mt-0.5 w-full ${isClearPass ? 'visible' : 'invisible'}`}>
        ✓ Clear Pass
      </span>
    </button>
  );
}
