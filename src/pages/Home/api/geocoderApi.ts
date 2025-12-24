import { env } from '@/shared/config';
import { withCache, checkRateLimit } from './geocoderLimits';

const GEOCODER_API = 'https://geocode-maps.yandex.ru/1.x/';

export async function fetchCoordinates(cityName: string) {
  return withCache('forward', cityName, async () => {
    const url = new URL(GEOCODER_API);

    url.searchParams.set('apikey', env.yandexGeocoderKey);
    url.searchParams.set('geocode', cityName);
    url.searchParams.set('format', 'json');
    url.searchParams.set('results', '1');

    const res = await fetch(url.toString());
    
    // Обработка ошибок API
    if (!res.ok) {
      if (res.status === 403 || res.status === 429) {
        throw new Error(
          'Превышен лимит запросов к API Геокодера. Попробуйте позже или используйте кэшированные результаты.'
        );
      }
      throw new Error('Geocoder error');
    }

    const data = await res.json();

    // Проверяем наличие данных в ответе
    const featureMember = data.response?.GeoObjectCollection?.featureMember;
    if (!featureMember || featureMember.length === 0) {
      throw new Error('Город не найден');
    }

    const pos = featureMember[0].GeoObject.Point.pos;

    const [lon, lat] = pos.split(' ').map(Number);

    return { lat, lon };
  });
}

/**
 * Обратное геокодирование - получение названия места по координатам
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  // Используем нормализованные координаты для кэширования (округление до 4 знаков)
  const normalizedLat = lat.toFixed(4);
  const normalizedLon = lon.toFixed(4);
  const cacheKey = `${normalizedLon},${normalizedLat}`;

  return withCache('reverse', cacheKey, async () => {
    const url = new URL(GEOCODER_API);

    url.searchParams.set('apikey', env.yandexGeocoderKey);
    // Yandex Geocoder ожидает координаты в формате lon,lat
    url.searchParams.set('geocode', `${lon},${lat}`);
    url.searchParams.set('format', 'json');
    url.searchParams.set('results', '1');
    url.searchParams.set('kind', 'locality'); // Приоритет населенным пунктам

    const res = await fetch(url.toString());
    
    // Обработка ошибок API
    if (!res.ok) {
      if (res.status === 403 || res.status === 429) {
        throw new Error(
          'Превышен лимит запросов к API Геокодера. Попробуйте позже или используйте кэшированные результаты.'
        );
      }
      throw new Error('Reverse geocoder error');
    }

    const data = await res.json();

    const featureMember = data.response?.GeoObjectCollection?.featureMember;
    if (!featureMember || featureMember.length === 0) {
      throw new Error('Местоположение не найдено');
    }

    const geoObject = featureMember[0].GeoObject;
    // Используем name или description в зависимости от того, что доступно
    const locationName =
      geoObject.name ||
      geoObject.description ||
      `Местоположение (${lat.toFixed(4)}, ${lon.toFixed(4)})`;

    return locationName;
  });
}
