const SUGGEST_API = 'https://suggest-maps.yandex.ru/v1/suggest';

export async function fetchSuggest(query: string) {
  const url = new URL(SUGGEST_API);

  url.searchParams.set('text', query);
  url.searchParams.set('apikey', import.meta.env.VITE_YANDEX_SUGGEST_KEY_DEV);
  url.searchParams.set('lang', 'ru_RU');
  url.searchParams.set('types', 'locality');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Suggest API error');
  }

  const data = await response.json();
  return data.results ?? [];
}
