export interface NormalizedForecastDay {
  /** Дата в формате YYYY-MM-DD */
  date: string;

  /** Средняя/дневная температура в °C (мы приводим все API к этой модели) */
  temp: number;

  /** Человеческое описание вроде “Cloudy”, “Rain", “Snow” */
  condition: string;

  /** Иконка — может быть emoji или имя пиктограммы */
  icon: string;

  /** Максимальная скорость ветра в м/с */
  wind: number;

  /** Название источника (open-meteo, metno, weatherapi, visualcrossing) */
  source: string;
}

export type NormalizedForecast = NormalizedForecastDay[];

export interface ForecastBySource {
  openMeteo?: NormalizedForecast;
  metNo?: NormalizedForecast;
  weatherApi?: NormalizedForecast;
  visualCrossing?: NormalizedForecast;
}
