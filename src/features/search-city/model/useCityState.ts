import { useState } from 'react';
import { DEFAULT_CITY, type CityLocation } from '@/entities/location';

export function useCityState() {
  const [city, setCity] = useState<CityLocation>(DEFAULT_CITY);

  // const setCityByName = (name: string) => {
  //   const matchedCity = matchCity(name);
  //   setCity(matchedCity);
  // };

  return {
    city,
    setCity,
  };
}
