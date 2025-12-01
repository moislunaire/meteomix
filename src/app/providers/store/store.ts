import { configureStore } from '@reduxjs/toolkit';
import { forecastApi } from '@/entities/forecast';

export const store = configureStore({
  reducer: {
    [forecastApi.reducerPath]: forecastApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(forecastApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
