import { Alert, Container, Group, Space, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';

import { useLocation } from '@/entities/location';
import { FORECAST_DAYS } from '@/shared/config';
import type { CityResult } from '../model/types';
import { useGeolocation } from '../model/useGeolocation';

import { useAllForecasts } from '../model';
import { FavoritesProvider } from '../model/favorites';
import { AppHeader } from './components/AppHeader';
import { CitySelect } from './components/CitySelect';
import { FavoritesList } from './components/FavoritesList';
import { ForecastTable } from './components/ForecastTable';
import { GeocoderRequestsCounter } from './components/GeocoderRequestsCounter';

export function HomePage() {
  const { location, setLocation } = useLocation();

  const [favoritesError, setFavoritesError] = useState<string | null>(null);

  const handleLocationSelect = useCallback(
    (result: CityResult) => {
      setLocation({
        label: result.fullName,
        lat: result.lat,
        lon: result.lon,
      });
    },
    [setLocation]
  );

  const {
    loading: geolocationLoading,
    error: geolocationError,
    getCurrentLocation,
    isSupported: isGeolocationSupported,
  } = useGeolocation(handleLocationSelect);

  // Автоматически запускаем геолокацию при загрузке страницы
  useEffect(() => {
    if (isGeolocationSupported) {
      getCurrentLocation();
    }
  }, [isGeolocationSupported, getCurrentLocation]);

  const { data, errors, isLoading, hasAnyData } = useAllForecasts(location.lat, location.lon);

  return (
    <Container size="md" py="xl" style={{ position: 'relative' }}>
      <GeocoderRequestsCounter />

      <Group justify="center">
        <AppHeader />
      </Group>

      <Space h="xl" />

      {/* Поиск города с геолокацией */}
      <FavoritesProvider>
        <CitySelect
          onSelect={handleLocationSelect}
          onGetCurrentLocation={getCurrentLocation}
          geolocationLoading={geolocationLoading}
          isGeolocationSupported={isGeolocationSupported}
          handleFavoritesError={setFavoritesError}
        />

        {/* Ошибка геолокации */}
        {geolocationError && (
          <>
            <Space h="sm" />
            <Alert icon={<IconAlertTriangle size={16} />} color="red" variant="light">
              {geolocationError}
            </Alert>
          </>
        )}

        {/* Ошибка избранного */}
        {favoritesError && (
          <>
            <Space h="sm" />
            <Alert icon={<IconAlertTriangle size={16} />} color="orange" variant="light">
              {favoritesError}
            </Alert>
          </>
        )}

        <Space h="xl" />

        {/* Список избранных локаций */}
        <FavoritesList />
      </FavoritesProvider>

      <Space h="xl" />

      <Title order={2} ta="center">
        {location.label} — прогноз на {FORECAST_DAYS} дней
      </Title>

      <Space h="lg" />

      <ForecastTable
        forecasts={data}
        errors={errors}
        isLoading={isLoading}
        hasAnyData={hasAnyData}
      />
    </Container>
  );
}
