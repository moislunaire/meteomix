import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { normalizeOpenMeteo } from '../model/normalize/openMeteo';
import { normalizeMetNo } from '../model/normalize/metNo';
import { normalizeVisualCrossing } from '../model/normalize/visualCrossing';
import { FORECAST_DAYS } from '@/shared/config';

import type { OpenMeteoResponse } from '../model/types.openMeteo';
import type { MetNoResponse } from '../model/types.metno';
import type { VisualCrossingResponse } from '../model/types.visualcrossing';

export const forecastApi = createApi({
  reducerPath: 'forecastApi',
  baseQuery: fetchBaseQuery({}),
  endpoints: (build) => ({
    // Open-Meteo
    getOpenMeteo: build.query({
      query: ({ lat, lon }) =>
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,weathercode,windspeed_10m_max&forecast_days=${FORECAST_DAYS}&timezone=auto`,
      transformResponse: (resp: OpenMeteoResponse) => normalizeOpenMeteo(resp),
    }),

    // MET Norway
    getMetNo: build.query({
      query: ({ lat, lon }) => ({
        url: `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
        headers: {
          'User-Agent': 'Meteomix/1.0 (Natalia)',
        },
      }),
      transformResponse: (resp: MetNoResponse) => normalizeMetNo(resp),
    }),

    // VisualCrossing
    getVisualCrossing: build.query({
      query: ({ lat, lon }) =>
        `/api/visualcrossing?location=${encodeURIComponent(`${lat},${lon}`)}&unitGroup=metric`,
      transformResponse: (resp: VisualCrossingResponse) => normalizeVisualCrossing(resp),
    }),
  }),
});

export const { useGetOpenMeteoQuery, useGetMetNoQuery, useGetVisualCrossingQuery } = forecastApi;
