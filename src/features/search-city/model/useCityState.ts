import { useState } from 'react';
import { DEFAULT_CITY, matchCity, type CityLocation } from '@/entities/location/model/cities';

export function useCityState() {
  const [city, setCity] = useState<CityLocation>(DEFAULT_CITY);

  const setCityByName = (name: string) => {
    const matchedCity = matchCity(name);
    setCity(matchedCity);
  };

  return {
    city,
    setCityByName,
  };
}
