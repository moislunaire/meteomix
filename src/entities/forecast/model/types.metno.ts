export interface MetNoTimeseriesItem {
  time: string;
  data: {
    instant: {
      details: {
        air_temperature: number;
        wind_speed: number;
      };
    };
    next_6_hours?: {
      summary: {
        symbol_code: string;
      };
    };
  };
}

export interface MetNoResponse {
  properties: {
    timeseries: MetNoTimeseriesItem[];
  };
}
