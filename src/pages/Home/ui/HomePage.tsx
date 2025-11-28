import { useAllForecasts } from '@/features/load-forecast/model/useAllForecasts';
import { SearchCity } from '@/features/search-city';
import { ForecastTable } from '@/widgets/forecast-table';
import { Container, Space, Title } from '@mantine/core';

export function HomePage() {
  // временно: город захардкожен
  const city = 'Moscow';
  const lat = 55.7558;
  const lon = 37.6176;

  const { data, isLoading, isError, hasAnyData } = useAllForecasts(city, lat, lon);

  // пока без красивого статус-компонента:
  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>Failed to load data</div>;
  if (!hasAnyData) return <div>No data</div>;

  return (
    <Container size="md" py="xl">
      <SearchCity />

      <Space h="xl" />

      <Title order={2} ta="center">
        Meteomix — прогноз на 3 дня
      </Title>

      <Space h="lg" />

      <ForecastTable forecasts={data} />
    </Container>
  );
}
