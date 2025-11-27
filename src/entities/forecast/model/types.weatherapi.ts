export interface WeatherApiCondition {
  text: string;
  icon: string;
}

export interface WeatherApiDay {
  avgtemp_c: number;
  maxwind_kph: number;
  condition: WeatherApiCondition;
}

export interface WeatherApiForecastDay {
  date: string;
  day: WeatherApiDay;
}

export interface WeatherApiResponse {
  location: {
    name: string;
    country: string;
  };
  forecast: {
    forecastday: WeatherApiForecastDay[];
  };
}
