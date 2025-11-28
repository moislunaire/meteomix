import { useAllForecasts } from '@/features/load-forecast';
import { SearchCityBar, useCityState } from '@/features/search-city';
import { ForecastTable } from '@/widgets/forecast-table';
import { Container, Space, Title } from '@mantine/core';

export function HomePage() {
  const { city, setCityByName } = useCityState();

  const { data, errors, isLoading, hasAnyData } = useAllForecasts(city.query, city.lat, city.lon);

  return (
    <Container size="md" py="xl">
      <SearchCityBar cityName={city.label} onSearch={setCityByName} />

      <Space h="xl" />

      <Title order={2} ta="center">
        Meteomix — прогноз на 3 дня
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
