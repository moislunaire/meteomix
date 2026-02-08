import type { CityLocation } from '@/entities/location';
import { isLocationExists } from '@/shared/lib/locationUtils';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle } from '@tabler/icons-react';
import React, { createElement, useCallback, useEffect, useRef, useState } from 'react';
import { FavoritesContext, type FavoriteLocation } from './FavoritesContext';

const FAVORITES_STORAGE_KEY = 'meteomix_favorites';
const MAX_FAVORITES = 10;

// Функция для загрузки избранного из localStorage
function loadFavoritesFromStorage(): FavoriteLocation[] {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as FavoriteLocation[];
    }
  } catch (error) {
    notifications.show({
      title: 'Ошибка загрузки',
      message: `Не удалось загрузить избранные локации из хранилища\n${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      color: 'red',
      icon: createElement(IconAlertTriangle, { size: 18 }),
    });
  }
  return [];
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>(loadFavoritesFromStorage);
  const [error, setError] = useState<string | null>(null);
  const isInitializedRef = useRef(false);

  // Сохраняем в localStorage при изменении
  useEffect(() => {
    if (isInitializedRef.current) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        notifications.show({
          title: 'Ошибка сохранения',
          message: `Не удалось сохранить избранные локации в хранилище\n${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
          color: 'red',
          icon: createElement(IconAlertTriangle, { size: 18 }),
        });
      }
    } else {
      isInitializedRef.current = true;
    }
  }, [favorites]);

  const addFavorite = useCallback(
    (location: CityLocation): boolean => {
      const exists = isLocationExists(favorites, location);

      if (exists) {
        return false;
      }

      if (favorites.length >= MAX_FAVORITES) {
        setError(`Максимальное количество избранных локаций: ${MAX_FAVORITES}`);
        return false;
      }

      const newFavorite: FavoriteLocation = {
        ...location,
        id: `${location.lat}-${location.lon}-${Date.now()}`,
        createdAt: Date.now(),
      };

      setFavorites((prev) => [...prev, newFavorite]);
      setError(null);
      return true;
    },
    [favorites]
  );

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        error,
        clearError,
        maxFavorites: MAX_FAVORITES,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
