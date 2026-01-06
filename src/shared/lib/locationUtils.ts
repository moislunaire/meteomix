// Утилиты для работы с локациями

export type LocationCoordinates = {
  lat: number;
  lon: number;
  label: string;
};

/**
 * Функция для нормализации названия (убирает лишние пробелы, приводит к нижнему регистру)
 */
function normalizeName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,]/g, ''); // убираем запятые и точки
}

/**
 * Функция для извлечения ключевых слов из названия
 */
function getKeyWords(name: string): string[] {
  const normalized = normalizeName(name);
  return normalized.split(' ').filter((word) => word.length > 2); // убираем короткие слова
}

/**
 * Функция для сравнения названий по пересечению ключевых слов
 */
function isSimilar(a: string, b: string): boolean {
  const aWords = getKeyWords(a);
  const bWords = getKeyWords(b);

  // Исключаем короткие слова и стоп-слова
  const STOP_WORDS = ['область', 'округ', 'автономный', 'муниципальный', 'край', 'республика'];
  const aFiltered = aWords.filter((w) => w.length > 3 && !STOP_WORDS.includes(w));
  const bFiltered = bWords.filter((w) => w.length > 3 && !STOP_WORDS.includes(w));

  // Если после фильтрации ничего не осталось — сравниваем по координатам
  if (aFiltered.length === 0 || bFiltered.length === 0) {
    return false;
  }

  // Минимум 50% совпадений (но не менее 1 слова)
  const matches = aFiltered.filter((word) => bFiltered.includes(word));
  const minMatches = Math.min(aFiltered.length, bFiltered.length);

  return matches.length >= Math.max(1, Math.floor(minMatches * 0.5));
}

/**
 * Функция для округления координат (до 1 знака после запятой ≈ 11 км точности)
 */
function roundCoordinates(lat: number, lon: number): { lat: number; lon: number } {
  return {
    lat: Math.round(lat * 10) / 10,
    lon: Math.round(lon * 10) / 10,
  };
}

/**
 * Проверяет, существует ли локация в списке избранных
 * @param favorites - список избранных локаций
 * @param location - проверяемая локация
 * @returns true если локация уже существует, false иначе
 */
export function isLocationExists(
  favorites: Array<{ lat: number; lon: number; label: string }>,
  location: { lat: number; lon: number; label: string }
): boolean {
  const roundedLocation = roundCoordinates(location.lat, location.lon);

  return favorites.some((fav) => {
    const roundedFav = roundCoordinates(fav.lat, fav.lon);

    // Сравнение по координатам (округленным)
    const coordinatesMatch =
      roundedFav.lat === roundedLocation.lat && roundedFav.lon === roundedLocation.lon;

    // Сравнение по названиям
    const namesMatch = fav.label && location.label && isSimilar(fav.label, location.label);

    // Считаем локацию существующей, если совпадают либо координаты, либо названия
    return coordinatesMatch || namesMatch;
  });
}
