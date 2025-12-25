import { env } from '@/shared/config';

const SUGGEST_API = 'https://suggest-maps.yandex.ru/v1/suggest';

function generateSessionToken(): string {
  // Получаем текущий timestamp для уникальности
  const timestamp = Date.now().toString(36);

  // Генерируем криптографически стойкую случайную строку
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);

  // Конвертируем в hex строку и обрезаем до нужной длины
  const randomString = Array.from(array, (byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 24);

  // Комбинируем timestamp и случайную часть
  return `${timestamp}_${randomString}`;
}

export async function fetchSuggest(query: string) {
  const url = new URL(SUGGEST_API);

  url.searchParams.set('text', query);
  url.searchParams.set('apikey', env.yandexSuggestKey);
  url.searchParams.set('lang', 'ru_RU');
  url.searchParams.set('types', 'locality');
  url.searchParams.set('sessiontoken', generateSessionToken());

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Suggest API error');
  }

  const data = await response.json();
  return data.results ?? [];
}
