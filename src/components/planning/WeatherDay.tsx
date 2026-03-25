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
    ? 'bg-green-50 ring-2 ring-green-400'
    : 'bg-white border border-gray-200';

  return (
    <div className={`flex flex-col gap-1 min-w-[120px] rounded-lg px-3 py-2 ${cardClass}`}>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{dayName}</span>
        <span className="text-sm font-semibold">{dayNum}</span>
      </div>

      <span className="text-2xl text-center">{icon}</span>

      <span className="text-xs text-gray-600 text-center">
        ↑{Math.round(day.tempMax)}° ↓{Math.round(day.tempMin)}°
      </span>

      <span className={`text-xs text-center ${day.cloudCover < cloudThreshold ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
        ☁️ {day.cloudCover}%
      </span>

      {day.precipProb > 0 && (
        <span className="text-xs text-blue-500 text-center">💧{day.precipProb}%</span>
      )}

      {passes.length > 0 && (
        <div className="mt-1 pt-1 border-t border-gray-200 flex flex-col gap-0.5">
          {passes.map((pass, i) => (
            <span key={i} className="text-xs text-indigo-700 flex items-center gap-0.5">
              🛰️
              <span className="font-medium">{pass.satellite.replace('Sentinel-', 'S')}</span>
              <span className="text-gray-500 ml-0.5">
                {pass.time.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', timeZone: timezone })}
              </span>
            </span>
          ))}
        </div>
      )}

      {isClearPass && (
        <span className="text-[10px] font-bold text-green-700 text-center uppercase tracking-wide mt-0.5">
          Clear Pass
        </span>
      )}
    </div>
  );
}
