import { Autocomplete, Loader, Group, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useCityAutocomplete } from '../../model/useCityAutocomplete';
import type { CityResult } from '../../model/types';
import type { CityLocation } from '../../model/cities';
import { useFavorites } from '../../model/favorites';
import { isLocationExists } from '@/shared/lib/locationUtils';
import { IconSearch, IconMapPin, IconStar, IconCheck } from '@tabler/icons-react';
import { useEffect } from 'react';

type Props = {
  onSelect: (city: CityResult) => void;
  /** Название текущего выбранного города */
  selectedCity?: string;
  /** Текущая локация города */
  currentCity?: CityLocation;
  /** Функция для получения текущего местоположения */
  onGetCurrentLocation?: () => Promise<void>;
  /** Состояние загрузки геолокации */
  geolocationLoading?: boolean;
  /** Поддерживается ли геолокация */
  isGeolocationSupported?: boolean;
  /** Метод для обработки ошибок избранного */
  handleFavoritesError?: (error: string | null) => void;
};

export function CitySelect({
  onSelect,
  selectedCity,
  currentCity,
  onGetCurrentLocation,
  geolocationLoading = false,
  isGeolocationSupported = false,
  handleFavoritesError,
}: Props) {
  const { input, setInput, suggestions, loading, selectCity } = useCityAutocomplete(
    onSelect,
    selectedCity
  );
  const { favorites, addFavorite, error: favoritesError, clearError } = useFavorites();

  // Передаем ошибку избранного в родительский компонент
  useEffect(() => {
    if (handleFavoritesError) {
      handleFavoritesError(favoritesError);
    }
  }, [favoritesError, handleFavoritesError]);

  const handleAddToFavorites = () => {
    if (!currentCity) return;

    clearError();
    const success = addFavorite(currentCity);

    if (success) {
      notifications.show({
        title: 'Успешно добавлено',
        message: `${currentCity.label} добавлен в избранное`,
        color: 'green',
        icon: <IconCheck size={18} />,
      });
    }
  };

  const isAlreadyInFavorites = currentCity ? isLocationExists(favorites, currentCity) : false;

  return (
    <Group>
      {isGeolocationSupported && onGetCurrentLocation && (
        <Button
          variant="light"
          leftSection={<IconMapPin size={18} stroke={1.5} />}
          loading={geolocationLoading}
          onClick={onGetCurrentLocation}
          aria-label="Определить местоположение"
        >
          Найти меня
        </Button>
      )}

      <Autocomplete
        clearable
        value={input}
        onChange={setInput}
        onOptionSubmit={selectCity}
        data={suggestions}
        placeholder="Введите город"
        rightSection={loading ? <Loader size="xs" /> : null}
        maxDropdownHeight={300}
        leftSection={<IconSearch size={16} stroke={1.5} />}
        style={{ flex: 1 }}
      />

      {currentCity && (
        <Button
          variant="light"
          leftSection={<IconStar size={18} stroke={1.5} />}
          onClick={handleAddToFavorites}
          disabled={isAlreadyInFavorites}
          aria-label="Добавить в избранное"
        >
          В избранное
        </Button>
      )}
    </Group>
  );
}
