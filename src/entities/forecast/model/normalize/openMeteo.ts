import type { NormalizedForecast, NormalizedForecastDay } from '../types';
import type { OpenMeteoResponse } from '../types.openMeteo';
import { mapWeatherCode, mapWeatherIcon } from '@/entities/forecast/lib/weatherCodeMaps';

export function normalizeOpenMeteo(data: OpenMeteoResponse): NormalizedForecast {
  const { daily } = data;

  if (!daily || !daily.time) return [];

  const { time, temperature_2m_max, windspeed_10m_max, weathercode } = daily;

  return time.slice(0, 3).map(
    (date, index): NormalizedForecastDay => ({
      date,
      temp: Math.round(temperature_2m_max[index]),
      wind: Math.round(windspeed_10m_max[index]),
      condition: mapWeatherCode(weathercode[index]),
      icon: mapWeatherIcon(weathercode[index]),
      source: 'open-meteo',
    })
  );
}
