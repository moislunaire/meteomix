export interface CityLocation {
  /** Название для отображения (на русском) */
  label: string;
  lat: number;
  lon: number;
}

export const DEFAULT_CITY: CityLocation = {
  label: 'Москва',
  lat: 55.7558,
  lon: 37.6176,
};
