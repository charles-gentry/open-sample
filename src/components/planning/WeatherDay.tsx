import type { DailyWeather } from '../../services/weather';
import { weatherCodeToLabel } from '../../services/weather';

export default function WeatherDay({ day }: { day: DailyWeather }) {
  const { icon } = weatherCodeToLabel(day.weatherCode);
  const date = new Date(day.date + 'T00:00:00');
  const dayName = date.toLocaleDateString('en', { weekday: 'short' });
  const dayNum = date.getDate();

  return (
    <div className="flex flex-col items-center gap-0.5 min-w-[60px] px-2 py-1.5">
      <span className="text-xs text-gray-500">{dayName}</span>
      <span className="text-sm font-medium">{dayNum}</span>
      <span className="text-xl">{icon}</span>
      <span className="text-xs text-gray-600">
        {Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°
      </span>
      {day.precipProb > 0 && (
        <span className="text-xs text-blue-500">{day.precipProb}%</span>
      )}
    </div>
  );
}
