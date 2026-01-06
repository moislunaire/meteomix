import { Card, Text, Group, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useLocationWeather } from '../../model/favorites';
import type { FavoriteLocation } from '../../model/favorites';

interface FavoriteLocationCardProps {
  /** Данные об избранной локации */
  location: FavoriteLocation;
  /** Обработчик удаления из избранного */
  onRemove: (id: string) => void;
}

export function FavoriteLocationCard({ location, onRemove }: FavoriteLocationCardProps) {
  const { weather, isLoading: weatherLoading } = useLocationWeather(location);

  const handleRemove = () => {
    onRemove(location.id);
  };

  const temperature = weather ? Math.round(weather.temp) : null;
  const weatherIcon = weather?.icon || '';
  const condition = weather?.condition || '';

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      {/* Кнопка удаления в правом верхнем углу */}
      <ActionIcon
        variant="subtle"
        size="sm"
        onClick={handleRemove}
        aria-label={`Удалить ${location.label} из избранного`}
      >
        <IconX size={16} />
      </ActionIcon>

      {/* Основная информация */}
      <div>
        <Text size="lg" fw={500} mb="xs" lineClamp={2}>
          {location.label}
        </Text>
        {/* Информация о погоде */}
        {weatherLoading ? (
          <Text size="sm" c="dimmed">
            Загрузка...
          </Text>
        ) : weather && temperature !== null ? (
          <>
            <Group gap="xs">
              <Text size="xl" fw={700} c="blue">
                {temperature}°
              </Text>
              <Text size="lg" aria-label={`Погода: ${condition}`}>
                {weatherIcon}
              </Text>
            </Group>
            <Group gap="xs">
              <Text size="sm" c="dimmed" lineClamp={1}>
                {condition}
              </Text>
            </Group>
          </>
        ) : (
          <Text size="sm" c="dimmed">
            Нет данных
          </Text>
        )}
      </div>
    </Card>
  );
}
