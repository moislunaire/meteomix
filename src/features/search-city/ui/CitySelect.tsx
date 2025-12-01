import { Select } from '@mantine/core';
import { useCityAutocomplete } from '../model/useCityAutocomplete';
import type { CityResult } from '../model/types';

interface Props {
  onSelect: (city: CityResult) => void;
}

export function CitySelect({ onSelect }: Props) {
  const { input, setInput, suggestions, loading, selectCity } = useCityAutocomplete(onSelect);

  return (
    <Select
      searchable
      searchValue={input}
      onSearchChange={setInput}
      data={suggestions.map((label) => ({ value: label, label }))}
      placeholder="Введите город"
      nothingFoundMessage="Нет вариантов"
      rightSection={loading ? '…' : null}
      maxDropdownHeight={300}
      onChange={(value) => value && selectCity(value)}
    />
  );
}
