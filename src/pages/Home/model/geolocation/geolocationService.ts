import type { GeolocationPosition, GeolocationError, GeolocationOptions } from './types';

/**
 * Получает текущее местоположение пользователя
 */
export function getCurrentPosition(options: GeolocationOptions = {}): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Геолокация не поддерживается этим браузером'));
      return;
    }

    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 минут
      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude ?? undefined,
          altitudeAccuracy: position.coords.altitudeAccuracy ?? undefined,
          heading: position.coords.heading ?? undefined,
          speed: position.coords.speed ?? undefined,
        });
      },
      (error) => {
        const geolocationError: GeolocationError = {
          code: error.code,
          message: getErrorMessage(error.code),
        };
        reject(geolocationError);
      },
      defaultOptions
    );
  });
}

/**
 * Следит за изменением местоположения
 */
export function watchPosition(
  callback: (position: GeolocationPosition) => void,
  errorCallback?: (error: GeolocationError) => void,
  options: GeolocationOptions = {}
): number {
  if (!navigator.geolocation) {
    throw new Error('Геолокация не поддерживается этим браузером');
  }

  const defaultOptions: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000,
    ...options,
  };

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude ?? undefined,
        altitudeAccuracy: position.coords.altitudeAccuracy ?? undefined,
        heading: position.coords.heading ?? undefined,
        speed: position.coords.speed ?? undefined,
      });
    },
    (error) => {
      if (errorCallback) {
        const geolocationError: GeolocationError = {
          code: error.code,
          message: getErrorMessage(error.code),
        };
        errorCallback(geolocationError);
      }
    },
    defaultOptions
  );
}

/**
 * Прекращает слежение за местоположением
 */
export function clearWatch(watchId: number): void {
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
}

/**
 * Проверяет поддержку геолокации
 */
export function isSupported(): boolean {
  return 'geolocation' in navigator;
}

/**
 * Возвращает понятное сообщение об ошибке
 */
function getErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return 'Доступ к геолокации отклонён пользователем';
    case 2:
      return 'Информация о местоположении недоступна';
    case 3:
      return 'Время ожидания получения местоположения истекло';
    default:
      return 'Произошла неизвестная ошибка при определении местоположения';
  }
}
