import {
  useGetMetNoQuery,
  useGetOpenMeteoQuery,
  useGetWeatherApiQuery,
  useGetVisualCrossingQuery,
} from '@/entities/forecast/api/forecastApi';
import type { ForecastBySource, ForecastErrorsBySource } from '@/entities/forecast/model/types';

export function useAllForecasts(city: string, lat: number, lon: number) {
  const openMeteo = useGetOpenMeteoQuery({ lat, lon });
  const metNo = useGetMetNoQuery({ lat, lon });
  const weather = useGetWeatherApiQuery({ city });
  const visual = useGetVisualCrossingQuery({ city });

  const isLoading = openMeteo.isLoading || metNo.isLoading || weather.isLoading || visual.isLoading;

  const isError = openMeteo.isError || metNo.isError || weather.isError || visual.isError;

  const data: ForecastBySource = {
    openMeteo: openMeteo.data,
    metNo: metNo.data,
    weatherApi: weather.data,
    visualCrossing: visual.data,
  };

  const errors: ForecastErrorsBySource = {
    openMeteo: !!openMeteo.isError,
    metNo: !!metNo.isError,
    weatherApi: !!weather.isError,
    visualCrossing: !!visual.isError,
  };

  const hasAnyData = !!data.openMeteo || !!data.metNo || !!data.weatherApi || !!data.visualCrossing;

  return {
    isLoading,
    isError,
    hasAnyData,
    data,
    errors,
  };
}
