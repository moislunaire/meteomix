export interface CityLocation {
  /** Название для отображения (на русском) */
  label: string;
  /** Строка для запросов в WeatherAPI / VisualCrossing (латиница) */
  query: string;
  lat: number;
  lon: number;
}

export const DEFAULT_CITY: CityLocation = {
  label: 'Москва',
  query: 'Moscow',
  lat: 55.7558,
  lon: 37.6176,
};

export const SUPPORTED_CITIES: CityLocation[] = [
  DEFAULT_CITY,
  {
    label: 'Санкт-Петербург',
    query: 'Saint Petersburg',
    lat: 59.9343,
    lon: 30.3351,
  },
  {
    label: 'Новосибирск',
    query: 'Novosibirsk',
    lat: 55.0084,
    lon: 82.9357,
  },
];

/**
 * пробуем найти по русскому названию или query,
 * если ничего не нашли — возвращаем город по умолчанию (Москва).
 */
export function matchCity(input: string): CityLocation {
  const normalized = input.trim().toLowerCase();

  if (!normalized) {
    return DEFAULT_CITY;
  }

  const found = SUPPORTED_CITIES.find(
    (city) => city.label.toLowerCase() === normalized || city.query.toLowerCase() === normalized
  );

  return found ?? DEFAULT_CITY;
}
