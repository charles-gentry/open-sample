import type { DailyWeather } from '../../services/weather';
import { weatherCodeToLabel } from '../../services/weather';
import type { SatellitePass } from '../../services/satellite';

interface WeatherDayProps {
  day: DailyWeather;
  passes: SatellitePass[];
  cloudThreshold: number;
  timezone: string;
}

export default function WeatherDay({ day, passes, cloudThreshold, timezone }: WeatherDayProps) {
  const { icon } = weatherCodeToLabel(day.weatherCode);
  const date = new Date(day.date + 'T00:00:00');
  const dayName = date.toLocaleDateString('en', { weekday: 'short' });
  const dayNum = date.getDate();

  const isClearPass = passes.length > 0 && day.cloudCover < cloudThreshold;
  const cardClass = isClearPass
    ? 'bg-retro-bg border-2 border-retro-amber'
    : 'bg-retro-bg border border-retro-green-muted';

  return (
    <div className={`flex flex-col gap-1 min-w-[120px] px-3 py-2 ${cardClass}`}>
      <div className="flex justify-between items-center">
        <span className="text-xs text-retro-green-dim">{dayName}</span>
        <span className="text-sm font-bold text-retro-green">{dayNum}</span>
      </div>

      <span className="text-2xl text-center">{icon}</span>

      <span className="text-xs text-retro-text text-center">
        ↑{Math.round(day.tempMax)}° ↓{Math.round(day.tempMin)}°
      </span>

      <span className={`text-xs text-center ${day.cloudCover < cloudThreshold ? 'text-retro-green font-bold' : 'text-retro-green-dim'}`}>
        {day.cloudCover}% cloud
      </span>

      {day.precipProb > 0 && (
        <span className="text-xs text-retro-amber text-center">{day.precipProb}% precip</span>
      )}

      {passes.length > 0 && (
        <div className="mt-1 pt-1 border-t border-retro-green-muted flex flex-col gap-0.5">
          {passes.map((pass, i) => (
            <span key={i} className="text-xs text-retro-amber flex items-center gap-0.5">
              <span className="font-bold">{pass.satellite.replace('Sentinel-', 'S')}</span>
              <span className="text-retro-green-dim ml-0.5">
                {pass.time.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', timeZone: timezone })}
              </span>
            </span>
          ))}
        </div>
      )}

      {isClearPass && (
        <span className="text-[10px] font-bold text-retro-amber text-center uppercase tracking-widest mt-0.5">
          Clear Pass
        </span>
      )}
    </div>
  );
}
