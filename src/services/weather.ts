export interface DailyWeather {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipSum: number;
  precipProb: number;
}

export async function fetchWeather(
  lat: number,
  lng: number
): Promise<DailyWeather[]> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat.toFixed(4));
  url.searchParams.set('longitude', lng.toFixed(4));
  url.searchParams.set(
    'daily',
    'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max'
  );
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', '14');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const data = await res.json();
  const d = data.daily;
  const days: DailyWeather[] = [];
  for (let i = 0; i < d.time.length; i++) {
    days.push({
      date: d.time[i],
      weatherCode: d.weathercode[i],
      tempMax: d.temperature_2m_max[i],
      tempMin: d.temperature_2m_min[i],
      precipSum: d.precipitation_sum[i],
      precipProb: d.precipitation_probability_max[i],
    });
  }
  return days;
}

export function weatherCodeToLabel(code: number): { label: string; icon: string } {
  if (code === 0) return { label: 'Clear', icon: '☀️' };
  if (code <= 3) return { label: 'Cloudy', icon: '⛅' };
  if (code <= 48) return { label: 'Fog', icon: '🌫️' };
  if (code <= 57) return { label: 'Drizzle', icon: '🌦️' };
  if (code <= 67) return { label: 'Rain', icon: '🌧️' };
  if (code <= 77) return { label: 'Snow', icon: '🌨️' };
  if (code <= 82) return { label: 'Showers', icon: '🌧️' };
  if (code <= 86) return { label: 'Snow showers', icon: '🌨️' };
  if (code <= 99) return { label: 'Thunderstorm', icon: '⛈️' };
  return { label: 'Unknown', icon: '❓' };
}
