import { Card, Text, Group, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useLocationWeather } from '../../model/favorites';
import type { FavoriteLocation } from '../../model/favorites';
import classes from './FavoriteLocationCard.module.css';

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
    <Card shadow="sm" padding="md" radius="md" withBorder w={180} className={`${classes.card}`}>
      <ActionIcon
        variant="subtle"
        size="sm"
        onClick={handleRemove}
        aria-label={`Удалить ${location.label} из избранного`}
        className={classes['remove-button']}
      >
        <IconX size={16} />
      </ActionIcon>

      <div className={classes.content}>
        <Text size="lg" fw={500} mb="xs" lineClamp={2}>
          {location.label}
        </Text>
        {weatherLoading ? (
          <Text size="sm" c="dimmed">
            Загрузка...
          </Text>
        ) : weather && temperature !== null ? (
          <>
            <Group gap="xs" className={classes['temp-row']}>
              <Text className={classes.temp} c="blue">
                {temperature}°
              </Text>
              <Text size="lg" aria-label={`Погода: ${condition}`}>
                {weatherIcon}
              </Text>
            </Group>
            <Text size="sm" c="dimmed" lineClamp={1} className={classes.condition}>
              {condition}
            </Text>
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
