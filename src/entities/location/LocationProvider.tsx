import { useCallback, useState } from 'react';
import { LocationContext } from './LocationContext';
import { DEFAULT_CITY } from './model/cities';

const LOCATION_STORAGE_KEY = 'meteomix_current_location';

function loadLocationFromStorage(): typeof DEFAULT_CITY {
  try {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Игнорируем ошибки чтения из localStorage
  }
  return DEFAULT_CITY;
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<typeof DEFAULT_CITY>(loadLocationFromStorage);

  const setLocation = useCallback((newLocation: typeof DEFAULT_CITY) => {
    setLocationState(newLocation);
    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(newLocation));
    } catch {
      // Игнорируем ошибки записи в localStorage
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
