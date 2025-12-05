import { Container, Group, Space, Title } from '@mantine/core';

import { FORECAST_DAYS } from '@/shared/config';

import { AppHeader } from './components/AppHeader';
import { CitySelect } from './components/CitySelect';
import { ForecastTable } from './components/ForecastTable';
import { useAllForecasts } from '../model/useAllForecasts';
import { type CityResult } from '../model/types';
import { useCityState } from '../model/useCityState';

export function HomePage() {
  const { city, setCity } = useCityState();

  const { data, errors, isLoading, hasAnyData } = useAllForecasts(city.lat, city.lon);

  return (
    <Container size="md" py="xl">
      <Group justify="center">
        <AppHeader />
      </Group>

      <Space h="xl" />

      {/* Поиск города */}
      <CitySelect
        selectedCity={city.label}
        onSelect={(selectedCity: CityResult) => {
          setCity({
            label: selectedCity.fullName,
            lat: selectedCity.lat,
            lon: selectedCity.lon,
          });
        }}
      />

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
