import { Container, Space, Title } from '@mantine/core';

import { useAllForecasts } from '@/features/load-forecast';
import { CitySelect, useCityState, type CityResult } from '@/features/search-city';

import { ForecastTable } from '@/widgets/forecast-table';

export function HomePage() {
  const { city, setCity } = useCityState();

  const { data, errors, isLoading, hasAnyData } = useAllForecasts(city.lat, city.lon);

  return (
    <Container size="md" py="xl">
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
        {city.label} — прогноз на 3 дня
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
