import { mapConditionToRussian } from '../../lib/conditionTranslator';
import type { NormalizedForecast, NormalizedForecastDay } from '../types';
import type { WeatherApiResponse } from '../types.weatherapi';
import { FORECAST_DAYS } from '@/shared/config';

export function normalizeWeatherApi(data: WeatherApiResponse): NormalizedForecast {
  if (!data?.forecast?.forecastday) return [];

  return data.forecast.forecastday.slice(0, FORECAST_DAYS).map(
    (item): NormalizedForecastDay => ({
      date: item.date,
      temp: Math.round(item.day.avgtemp_c),
      wind: Math.round(item.day.maxwind_kph / 3.6), // перевели km/h → m/s
      condition: mapConditionToRussian(item.day.condition.text),
      icon: convertWeatherApiIcon(item.day.condition.icon),
      source: 'weatherapi',
    })
  );
}

function convertWeatherApiIcon(iconUrl: string): string {
  const lower = iconUrl.toLowerCase();

  if (lower.includes('sun') || lower.includes('clear')) return '☀️';
  if (lower.includes('cloud')) return '☁️';
  if (lower.includes('rain')) return '🌧️';
  if (lower.includes('snow')) return '❄️';
  if (lower.includes('storm') || lower.includes('thunder')) return '⛈️';

  return '🌦️';
}
