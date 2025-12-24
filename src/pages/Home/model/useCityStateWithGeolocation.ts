import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_CITY, type CityLocation } from './cities';
import { useGeolocation } from './useGeolocation';
import type { CityResult } from './types';

type UseCityStateWithGeolocationReturn = {
  // Состояние города (совместимо с useCityState)
  city: CityLocation;
  setCity: (city: CityLocation) => void;

  // Геолокация
  geolocationLoading: boolean;
  geolocationError: string | null;
  getCurrentLocation: () => Promise<void>;
  isGeolocationSupported: boolean;

  // Удобные методы
  setCityFromResult: (result: CityResult) => void;
};

export function useCityStateWithGeolocation(): UseCityStateWithGeolocationReturn {
  const [city, setCity] = useState<CityLocation>(DEFAULT_CITY);

  const onLocationSelect = useCallback((result: CityResult) => {
    setCity({
      label: result.fullName,
      lat: result.lat,
      lon: result.lon,
    });
  }, []);

  const {
    loading: geolocationLoading,
    error: geolocationError,
    getCurrentLocation,
    isSupported: isGeolocationSupported,
  } = useGeolocation(onLocationSelect);

  // Автоматически запускаем геолокацию при загрузке страницы
  // onLocationSelect стабилен (useCallback), поэтому getCurrentLocation тоже стабилен
  // isGeolocationSupported не меняется во время работы приложения
  useEffect(() => {
    if (isGeolocationSupported) {
      getCurrentLocation();
    }
  }, [isGeolocationSupported, getCurrentLocation]);

  const setCityFromResult = (result: CityResult) => {
    setCity({
      label: result.fullName,
      lat: result.lat,
      lon: result.lon,
    });
  };

  return {
    // Состояние города
    city,
    setCity,

    // Геолокация
    geolocationLoading,
    geolocationError,
    getCurrentLocation,
    isGeolocationSupported,

    // Удобные методы
    setCityFromResult,
  };
}
