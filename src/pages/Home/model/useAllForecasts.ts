import {
  useGetMetNoQuery,
  useGetOpenMeteoQuery,
  useGetVisualCrossingQuery,
  type ForecastBySource,
  type ForecastErrorsBySource,
} from '@/entities/forecast';

export function useAllForecasts(lat: number, lon: number) {
  const openMeteo = useGetOpenMeteoQuery({ lat, lon });
  const metNo = useGetMetNoQuery({ lat, lon });
  const visual = useGetVisualCrossingQuery({ lat, lon });

  const isLoading = openMeteo.isLoading || metNo.isLoading || visual.isLoading;

  const isError = openMeteo.isError || metNo.isError || visual.isError;

  const data: ForecastBySource = {
    openMeteo: openMeteo.data,
    metNo: metNo.data,
    visualCrossing: visual.data,
  };

  const errors: ForecastErrorsBySource = {
    openMeteo: !!openMeteo.isError,
    metNo: !!metNo.isError,
    visualCrossing: !!visual.isError,
  };

  const hasAnyData = !!data.openMeteo || !!data.metNo || !!data.visualCrossing;

  return {
    isLoading,
    isError,
    hasAnyData,
    data,
    errors,
  };
}
