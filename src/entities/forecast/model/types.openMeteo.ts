export interface OpenMeteoDaily {
  time: string[]; // даты
  temperature_2m_max: number[]; // температура
  windspeed_10m_max: number[]; // ветер
  weathercode: number[]; // WMO код
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  daily: OpenMeteoDaily;
}
