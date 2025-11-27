import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { normalizeOpenMeteo } from '../model/normalize/openMeteo';
import { normalizeMetNo } from '../model/normalize/metNo';
import { normalizeWeatherApi } from '../model/normalize/weatherApi';
import { normalizeVisualCrossing } from '../model/normalize/visualCrossing';

import type { OpenMeteoResponse } from '../model/types.openMeteo';
import type { MetNoResponse } from '../model/types.metno';
import type { WeatherApiResponse } from '../model/types.weatherapi';
import type { VisualCrossingResponse } from '../model/types.visualcrossing';

export const forecastApi = createApi({
  reducerPath: 'forecastApi',
  baseQuery: fetchBaseQuery({}),
  endpoints: (build) => ({
    // 1. Open-Meteo
    getOpenMeteo: build.query({
      query: ({ lat, lon }) =>
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,weathercode,windspeed_10m_max&forecast_days=3&timezone=auto`,
      transformResponse: (resp: OpenMeteoResponse) => normalizeOpenMeteo(resp),
    }),

    // 2. MET Norway
    getMetNo: build.query({
      query: ({ lat, lon }) => ({
        url: `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
        headers: {
          'User-Agent': 'Meteomix/1.0 (Natalia)',
        },
      }),
      transformResponse: (resp: MetNoResponse) => normalizeMetNo(resp),
    }),

    // 3. WeatherAPI
    getWeatherApi: build.query({
      query: ({ city }) =>
        `https://api.weatherapi.com/v1/forecast.json?key=${
          import.meta.env.VITE_WEATHERAPI_KEY
        }&q=${city}&days=3`,
      transformResponse: (resp: WeatherApiResponse) => normalizeWeatherApi(resp),
    }),

    // 4. VisualCrossing
    getVisualCrossing: build.query({
      query: ({ city }) =>
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${
          import.meta.env.VITE_VISUALCROSSING_API_KEY
        }&unitGroup=metric`,
      transformResponse: (resp: VisualCrossingResponse) => normalizeVisualCrossing(resp),
    }),
  }),
});

export const {
  useGetOpenMeteoQuery,
  useGetMetNoQuery,
  useGetWeatherApiQuery,
  useGetVisualCrossingQuery,
} = forecastApi;
