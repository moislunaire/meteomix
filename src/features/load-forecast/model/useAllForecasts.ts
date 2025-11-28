import type { ForecastBySource } from '@/entities/forecast';
import {
  useGetOpenMeteoQuery,
  useGetMetNoQuery,
  useGetWeatherApiQuery,
  useGetVisualCrossingQuery,
} from '@/entities/forecast/api/forecastApi';

export function useAllForecasts(city: string, lat: number, lon: number) {
  const openMeteo = useGetOpenMeteoQuery({ lat, lon });
  const metNo = useGetMetNoQuery({ lat, lon });
  const weather = useGetWeatherApiQuery({ city });
  const visual = useGetVisualCrossingQuery({ city });

  const isLoading = openMeteo.isLoading || metNo.isLoading || weather.isLoading || visual.isLoading;

  const isError = openMeteo.isError || metNo.isError || weather.isError || visual.isError;

  const hasAnyData = !!openMeteo.data || !!metNo.data || !!weather.data || !!visual.data;

  return {
    isLoading,
    isError,
    hasAnyData,
    data: {
      openMeteo: openMeteo.data,
      metNo: metNo.data,
      weatherApi: weather.data,
      visualCrossing: visual.data,
    } satisfies ForecastBySource,
  };
}
