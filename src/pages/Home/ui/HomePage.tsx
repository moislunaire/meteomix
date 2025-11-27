import { Container, Space, Title } from '@mantine/core';

import type { WeatherForecastRow } from '../../../widgets/weather-table';
import { WeatherTable } from '../../../widgets/weather-table';
import { SearchCity } from '@/features/search-city';

const MOCK_DATA: WeatherForecastRow[] = [
  { source: 'OpenWeatherMap', today: '+3°C ☁️', tomorrow: '+1°C ❄️', dayAfterTomorrow: '+2°C 🌥' },
  { source: 'AccuWeather', today: '+4°C 🌥', tomorrow: '+0°C ❄️', dayAfterTomorrow: '+3°C 🌧' },
  { source: 'WeatherAPI', today: '+2°C 🌧', tomorrow: '+1°C 🌥', dayAfterTomorrow: '+1°C 🌧' },
];

export function HomePage() {
  return (
    <Container size="md" py="xl">
      <SearchCity />

      <Space h="xl" />

      <Title order={2} ta="center">
        Meteomix — прогноз на 3 дня
      </Title>

      <Space h="lg" />

      <WeatherTable data={MOCK_DATA} />
    </Container>
  );
}
