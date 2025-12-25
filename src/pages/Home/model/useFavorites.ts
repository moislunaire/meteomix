import { useState, useEffect, useCallback, useRef, createElement } from 'react';
import { notifications } from '@mantine/notifications';
import { IconAlertTriangle } from '@tabler/icons-react';
import type { CityLocation } from './cities';

const FAVORITES_STORAGE_KEY = 'meteomix_favorites';
const MAX_FAVORITES = 10;

export type FavoriteLocation = CityLocation & {
  /** Уникальный идентификатор избранной локации */
  id: string;
  /** Время создания записи в избранном (timestamp в миллисекундах) */
  createdAt: number;
};

// Функция для загрузки избранного из localStorage
function loadFavoritesFromStorage(): FavoriteLocation[] {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as FavoriteLocation[];
      return parsed;
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

export function useFavorites() {
  // Используем lazy initialization, чтобы сразу загрузить данные из localStorage
  const [favorites, setFavorites] = useState<FavoriteLocation[]>(loadFavoritesFromStorage);
  const [error, setError] = useState<string | null>(null);
  const isInitializedRef = useRef(false);

  // Сохраняем в localStorage при изменении (только после инициализации)
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
      // Проверяем, не добавлена ли уже эта локация
      const exists = favorites.some((fav) => fav.lat === location.lat && fav.lon === location.lon);

      // Если локация уже в избранном, ничего не делаем
      if (exists) {
        return false;
      }

      // Проверяем лимит
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

  return {
    favorites,
    addFavorite,
    removeFavorite,
    error,
    clearError,
    maxFavorites: MAX_FAVORITES,
  };
}
