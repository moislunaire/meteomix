export interface VisualCrossingDay {
  datetime: string;
  temp: number;
  windspeed: number;
  conditions: string;
  icon: string;
}

export interface VisualCrossingResponse {
  address: string;
  days: VisualCrossingDay[];
}
