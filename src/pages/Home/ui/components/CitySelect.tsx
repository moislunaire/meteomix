import { useLocation } from '@/entities/location';
import { isLocationExists } from '@/shared/lib/locationUtils';
import { Autocomplete, Button, Group, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconMapPin, IconSearch, IconStar } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useFavorites } from '../../model/favorites';
import type { CityResult } from '../../model/types';
import { useCityAutocomplete } from '../../model/useCityAutocomplete';

type Props = {
  onSelect: (city: CityResult) => void;
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
  onGetCurrentLocation,
  geolocationLoading = false,
  isGeolocationSupported = false,
  handleFavoritesError,
}: Props) {
  const { location } = useLocation();
  const { input, setInput, suggestions, loading, selectCity } = useCityAutocomplete(
    onSelect,
    location.label
  );
  const { favorites, addFavorite, error: favoritesError, clearError } = useFavorites();

  // Передаем ошибку избранного в родительский компонент
  useEffect(() => {
    if (handleFavoritesError) {
      handleFavoritesError(favoritesError);
    }
  }, [favoritesError, handleFavoritesError]);

  const handleAddToFavorites = () => {
    clearError();
    const success = addFavorite(location);

    if (success) {
      notifications.show({
        title: 'Успешно добавлено',
        message: `${location.label} добавлен в избранное`,
        color: 'green',
        icon: <IconCheck size={18} />,
      });
    }
  };

  const isAlreadyInFavorites = isLocationExists(favorites, location);

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

      <Button
        variant="light"
        leftSection={<IconStar size={18} stroke={1.5} />}
        onClick={handleAddToFavorites}
        disabled={isAlreadyInFavorites}
        aria-label="Добавить в избранное"
      >
        В избранное
      </Button>
    </Group>
  );
}
