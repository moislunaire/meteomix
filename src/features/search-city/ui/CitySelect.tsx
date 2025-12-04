import { Autocomplete, Loader } from '@mantine/core';
import { useCityAutocomplete } from '../model/useCityAutocomplete';
import type { CityResult } from '../model/types';
import { IconSearch } from '@tabler/icons-react';

interface Props {
  onSelect: (city: CityResult) => void;
  /** Название текущего выбранного города */
  selectedCity?: string;
}

export function CitySelect({ onSelect, selectedCity }: Props) {
  const { input, setInput, suggestions, loading, selectCity } = useCityAutocomplete(
    onSelect,
    selectedCity
  );

  return (
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
    />
  );
}
