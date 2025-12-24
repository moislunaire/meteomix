/**
 * Утилита для управления лимитами и кэшированием запросов к Яндекс Геокодер API
 *
 * Лимиты бесплатного плана:
 * - 1000 запросов в сутки для HTTP API Геокодера
 * - При превышении лимита доступ может быть приостановлен до конца дня
 *
 * Рекомендации:
 * - Кэшировать результаты на срок до 30 дней
 */

const STORAGE_PREFIX = 'yandex_geocoder_';
const CACHE_PREFIX = 'cache_';
const REQUESTS_COUNT_KEY = 'requests_count';
const REQUESTS_DATE_KEY = 'requests_date';
const CACHE_EXPIRY_DAYS = 30;

/**
 * Дневной лимит запросов для бесплатного плана Яндекс Геокодера
 */
export const DAILY_LIMIT = 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Получить ключ для кэша
 */
function getCacheKey(type: 'forward' | 'reverse', query: string): string {
  return `${STORAGE_PREFIX}${CACHE_PREFIX}${type}_${query}`;
}

/**
 * Получить данные из кэша
 */
function getCached<T>(type: 'forward' | 'reverse', query: string): T | null {
  try {
    const key = getCacheKey(type, query);
    const cached = localStorage.getItem(key);

    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();
    const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    // Проверяем, не истек ли срок кэша
    if (now - entry.timestamp > expiryTime) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Сохранить данные в кэш
 */
function setCached<T>(type: 'forward' | 'reverse', query: string, data: T): void {
  try {
    const key = getCacheKey(type, query);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Игнорируем ошибки записи в localStorage (например, если он переполнен)
  }
}

/**
 * Получить количество запросов за сегодня
 */
function getTodayRequestsCount(): number {
  try {
    const dateKey = localStorage.getItem(`${STORAGE_PREFIX}${REQUESTS_DATE_KEY}`);
    const today = new Date().toDateString();

    // Если дата не совпадает с сегодняшней, сбрасываем счетчик
    if (dateKey !== today) {
      localStorage.setItem(`${STORAGE_PREFIX}${REQUESTS_DATE_KEY}`, today);
      localStorage.setItem(`${STORAGE_PREFIX}${REQUESTS_COUNT_KEY}`, '0');
      return 0;
    }

    const count = localStorage.getItem(`${STORAGE_PREFIX}${REQUESTS_COUNT_KEY}`);
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Увеличить счетчик запросов
 */
function incrementRequestsCount(): void {
  try {
    const count = getTodayRequestsCount() + 1;
    localStorage.setItem(`${STORAGE_PREFIX}${REQUESTS_COUNT_KEY}`, count.toString());
  } catch {
    // Игнорируем ошибки записи
  }
}

/**
 * Проверить, не превышен ли лимит запросов
 */
export function checkRateLimit(): void {
  const count = getTodayRequestsCount();

  if (count >= DAILY_LIMIT) {
    throw new Error(
      `Достигнут дневной лимит запросов к API Геокодера (${DAILY_LIMIT} запросов). ` +
        `Доступ будет восстановлен завтра.`
    );
  }
}

/**
 * Получить данные из кэша или выполнить запрос
 */
export async function withCache<T>(
  type: 'forward' | 'reverse',
  query: string,
  fetcher: () => Promise<T>
): Promise<T> {
  // Сначала проверяем кэш
  const cached = getCached<T>(type, query);
  if (cached !== null) {
    return cached;
  }

  // Проверяем лимит перед выполнением запроса
  checkRateLimit();

  // Выполняем запрос
  const data = await fetcher();

  // Сохраняем в кэш и увеличиваем счетчик
  setCached(type, query, data);
  incrementRequestsCount();

  return data;
}

/**
 * Получить текущее количество использованных запросов за сегодня
 */
export function getCurrentRequestsCount(): number {
  return getTodayRequestsCount();
}

/**
 * Получить оставшееся количество запросов
 */
export function getRemainingRequests(): number {
  return Math.max(0, DAILY_LIMIT - getTodayRequestsCount());
}
