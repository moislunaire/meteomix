import { mapConditionToRussian } from '../../lib/conditionTranslator';
import { mapVisualCrossingIcon } from '../../lib/visualCrossingMaps';
import type { NormalizedForecast, NormalizedForecastDay } from '../types';
import type { VisualCrossingResponse } from '../types.visualcrossing';

export function normalizeVisualCrossing(data: VisualCrossingResponse): NormalizedForecast {
  if (!data?.days) return [];

  return data.days.slice(0, 3).map(
    (day): NormalizedForecastDay => ({
      date: day.datetime,
      temp: Math.round(day.temp),
      wind: Math.round(day.windspeed),
      condition: mapConditionToRussian(day.conditions),
      icon: mapVisualCrossingIcon(day.icon),
      source: 'visualcrossing',
    })
  );
}
