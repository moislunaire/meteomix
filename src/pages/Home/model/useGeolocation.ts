import { useCallback, useState } from 'react';
import { getCurrentPosition, isSupported } from './geolocation/geolocationService';
import type { GeolocationPosition, GeolocationError } from './geolocation/types';
import type { CityResult } from './types';
import { reverseGeocode as reverseGeocodeApi } from '../api/geocoderApi';

type UseGeolocationReturn = {
  loading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  isSupported: boolean;
};

export function useGeolocation(onLocationSelect: (city: CityResult) => void): UseGeolocationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async () => {
    if (!isSupported()) {
      setError('Геолокация не поддерживается этим браузером');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const position: GeolocationPosition = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000, // 5 минут
      });

      // Преобразуем координаты в название города
      const cityName = await reverseGeocode(position.latitude, position.longitude);

      onLocationSelect({
        name: cityName,
        fullName: cityName,
        lat: position.latitude,
        lon: position.longitude,
      });
    } catch (err) {
      const geolocationError = err as GeolocationError;
      setError(geolocationError.message);
    } finally {
      setLoading(false);
    }
  }, [onLocationSelect]);

  return {
    loading,
    error,
    getCurrentLocation,
    isSupported: isSupported(),
  };
}

/**
 * Обратное геокодирование - получение названия города по координатам
 * Использует Yandex Geocoder API
 */
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  return reverseGeocodeApi(lat, lon);
}
