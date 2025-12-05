import { mapMetNoIcon, mapMetNoSymbol } from '../../lib/metnoMaps';
import { FORECAST_DAYS } from '@/shared/config';
import type { NormalizedForecast, NormalizedForecastDay } from '../types';
import type { MetNoResponse, MetNoTimeseriesItem } from '../types.metno';

export function normalizeMetNo(data: MetNoResponse): NormalizedForecast {
  const timeseries = data?.properties?.timeseries;
  if (!Array.isArray(timeseries)) return [];

  // Собираем прогноз по датам
  const daysMap: Record<string, MetNoTimeseriesItem[]> = {};

  timeseries.forEach((item) => {
    const date = item.time.split('T')[0];
    if (!daysMap[date]) daysMap[date] = [];
    daysMap[date].push(item);
  });

  const dates = Object.keys(daysMap).sort().slice(0, FORECAST_DAYS);

  return dates.map((date): NormalizedForecastDay => {
    const items = daysMap[date];

    const temps = items.map((i) => i.data.instant.details.air_temperature);
    const winds = items.map((i) => i.data.instant.details.wind_speed);

    const firstSymbol = items[0].data.next_6_hours?.summary.symbol_code ?? 'unknown';

    return {
      date,
      temp: Math.round(average(temps)),
      wind: Math.round(Math.max(...winds)),
      condition: mapMetNoSymbol(firstSymbol),
      icon: mapMetNoIcon(firstSymbol),
      source: 'met.no',
    };
  });
}

// Средняя температура
function average(arr: number[]) {
  return arr.reduce((s, x) => s + x, 0) / arr.length;
}
