import { env } from '@/shared/config';

const GEOCODER_API = 'https://geocode-maps.yandex.ru/1.x/';

export async function fetchCoordinates(cityName: string) {
  const url = new URL(GEOCODER_API);

  url.searchParams.set('apikey', env.yandexGeocoderKey);
  url.searchParams.set('geocode', cityName);
  url.searchParams.set('format', 'json');
  url.searchParams.set('results', '1');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Geocoder error');

  const data = await res.json();

  const pos = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;

  const [lon, lat] = pos.split(' ').map(Number);

  return { lat, lon };
}
