import { useState } from 'react';
import { DEFAULT_CITY, type CityLocation } from '@/entities/location';

export function useCityState() {
  const [city, setCity] = useState<CityLocation>(DEFAULT_CITY);

  return {
    city,
    setCity,
  };
}
