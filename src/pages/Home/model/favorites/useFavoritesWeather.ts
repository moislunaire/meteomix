import {
  useGetMetNoQuery,
  useGetOpenMeteoQuery,
  useGetVisualCrossingQuery,
} from '@/entities/forecast';
import type { NormalizedForecastDay } from '@/entities/forecast';
import type { FavoriteLocation } from './FavoritesContext';

/**
 * Хук для получения текущей погоды для одной локации
 */
export function useLocationWeather(location: FavoriteLocation) {
  const openMeteo = useGetOpenMeteoQuery({ lat: location.lat, lon: location.lon });
  const metNo = useGetMetNoQuery({ lat: location.lat, lon: location.lon });
  const visual = useGetVisualCrossingQuery({ lat: location.lat, lon: location.lon });

  const isLoading = openMeteo.isLoading || metNo.isLoading || visual.isLoading;
  const isError = openMeteo.isError && metNo.isError && visual.isError;

  // Берем первые доступные данные из источников
  let weather: NormalizedForecastDay | undefined;

  if (openMeteo.data && openMeteo.data.length > 0) {
    weather = openMeteo.data[0];
  } else if (metNo.data && metNo.data.length > 0) {
    weather = metNo.data[0];
  } else if (visual.data && visual.data.length > 0) {
    weather = visual.data[0];
  }

  return {
    weather,
    isLoading,
    isError,
  };
}
