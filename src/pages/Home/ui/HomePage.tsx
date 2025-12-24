import { Container, Group, Space, Title, Alert } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

import { FORECAST_DAYS } from '@/shared/config';

import { AppHeader } from './components/AppHeader';
import { CitySelect } from './components/CitySelect';
import { ForecastTable } from './components/ForecastTable';
import { useAllForecasts } from '../model/useAllForecasts';
import { useCityStateWithGeolocation } from '../model/useCityStateWithGeolocation';
import type { CityResult } from '../model/types';

export function HomePage() {
  const {
    city,
    setCity,
    geolocationLoading,
    geolocationError,
    getCurrentLocation,
    isGeolocationSupported,
  } = useCityStateWithGeolocation();

  const { data, errors, isLoading, hasAnyData } = useAllForecasts(city.lat, city.lon);

  const handleCitySelect = (selectedCity: CityResult) => {
    setCity({
      label: selectedCity.fullName,
      lat: selectedCity.lat,
      lon: selectedCity.lon,
    });
  };

  return (
    <Container size="md" py="xl">
      <Group justify="center">
        <AppHeader />
      </Group>

      <Space h="xl" />

      {/* Поиск города с геолокацией */}
      <CitySelect
        selectedCity={city.label}
        onSelect={handleCitySelect}
        onGetCurrentLocation={getCurrentLocation}
        geolocationLoading={geolocationLoading}
        isGeolocationSupported={isGeolocationSupported}
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

      <Space h="xl" />

      <Title order={2} ta="center">
        {city.label} — прогноз на {FORECAST_DAYS} дней
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
