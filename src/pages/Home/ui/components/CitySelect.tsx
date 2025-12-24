import { Autocomplete, Loader, Group, ActionIcon, Tooltip } from '@mantine/core';
import { useCityAutocomplete } from '../../model/useCityAutocomplete';
import type { CityResult } from '../../model/types';
import { IconSearch, IconMapPin } from '@tabler/icons-react';

type Props = {
  onSelect: (city: CityResult) => void;
  /** Название текущего выбранного города */
  selectedCity?: string;
  /** Функция для получения текущего местоположения */
  onGetCurrentLocation?: () => Promise<void>;
  /** Состояние загрузки геолокации */
  geolocationLoading?: boolean;
  /** Поддерживается ли геолокация */
  isGeolocationSupported?: boolean;
};

export function CitySelect({
  onSelect,
  selectedCity,
  onGetCurrentLocation,
  geolocationLoading = false,
  isGeolocationSupported = false,
}: Props) {
  const { input, setInput, suggestions, loading, selectCity } = useCityAutocomplete(
    onSelect,
    selectedCity
  );

  return (
    <Group>
      <Autocomplete
        clearable
        value={input}
        onChange={setInput}
        onOptionSubmit={selectCity}
        data={suggestions}
        placeholder="Введите город"
        rightSection={loading ? <Loader size="xs" /> : null}
        maxDropdownHeight={300}
        leftSection={<IconSearch size={16} stroke={1.5} />}
        style={{ flex: 1 }}
      />

      {isGeolocationSupported && onGetCurrentLocation && (
        <Tooltip label="Определить моё местоположение">
          <ActionIcon
            variant="light"
            size="lg"
            loading={geolocationLoading}
            onClick={onGetCurrentLocation}
            aria-label="Определить местоположение"
          >
            <IconMapPin size={18} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
}
