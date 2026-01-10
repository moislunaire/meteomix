import { DEFAULT_CITY, type CityLocation } from '@/entities/location';
import { useState } from 'react';

export function useCityState() {
  const [city, setCity] = useState<CityLocation>(DEFAULT_CITY);

  return {
    city,
    setCity,
  };
}
