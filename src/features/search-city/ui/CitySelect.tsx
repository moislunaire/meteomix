import { Select } from '@mantine/core';
import { useCityAutocomplete } from '../model/useCityAutocomplete';
import type { CityResult } from '../model/types';

interface Props {
  onSelect: (city: CityResult) => void;
}

export function CitySelect({ onSelect }: Props) {
  const { input, setInput, suggestions, loading, selectCity, value, setValue } =
    useCityAutocomplete(onSelect);

  return (
    <Select
      searchable
      value={value}
      searchValue={input}
      onSearchChange={setInput}
      data={suggestions}
      placeholder="Введите город"
      nothingFoundMessage="Нет вариантов"
      rightSection={loading ? '…' : null}
      maxDropdownHeight={300}
      onChange={(nextValue) => {
        setValue(nextValue);
        if (nextValue) selectCity(nextValue);
      }}
    />
  );
}
