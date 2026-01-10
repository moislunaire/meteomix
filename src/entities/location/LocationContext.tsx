import { createContext, useContext } from 'react';
import type { CityLocation } from './model/cities';

export interface LocationValue {
  location: CityLocation;
  setLocation: (location: CityLocation) => void;
}

export const LocationContext = createContext<LocationValue | null>(null);

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
