export interface NormalizedForecastDay {
  /** Дата в формате YYYY-MM-DD */
  date: string;

  /** Средняя/дневная температура в °C (мы приводим все API к этой модели) */
  temp: number;

  /** Человеческое описание вроде “Облачно”, “Дождь", “Снег” */
  condition: string;

  /** Иконка — может быть emoji или имя пиктограммы */
  icon: string;

  /** Максимальная скорость ветра в м/с */
  wind: number;

  /** Название источника (open-meteo, metno, weatherapi, visualcrossing) */
  source: string;
}

export type NormalizedForecast = NormalizedForecastDay[];

// общий тип для идентификаторов источников
export type ForecastSourceId = 'openMeteo' | 'metNo' | 'weatherApi' | 'visualCrossing';

// данные по источникам
export type ForecastBySource = Partial<Record<ForecastSourceId, NormalizedForecast | undefined>>;

// ошибки по источникам
export type ForecastErrorsBySource = Record<ForecastSourceId, boolean>;
