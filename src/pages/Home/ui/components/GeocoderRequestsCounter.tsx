import { Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import {
  getCurrentRequestsCount,
  getRemainingRequests,
  DAILY_LIMIT,
} from '../../api/geocoderLimits';

export function GeocoderRequestsCounter() {
  const [count, setCount] = useState(getCurrentRequestsCount());
  const [remaining, setRemaining] = useState(getRemainingRequests());

  // Обновляем счетчик периодически
  useEffect(() => {
    const updateCount = () => {
      setCount(getCurrentRequestsCount());
      setRemaining(getRemainingRequests());
    };

    updateCount();
    const interval = setInterval(updateCount, 1000); // Обновляем каждую секунду

    return () => clearInterval(interval);
  }, []);

  return (
    <Text
      size="xs"
      c="dimmed"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '8px 16px',
        opacity: 0.5,
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      Геокодер: {count}/{DAILY_LIMIT} ({remaining} осталось)
    </Text>
  );
}
