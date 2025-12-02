import { Select } from '@mantine/core';
import { useCityAutocomplete } from '../model/useCityAutocomplete';
import type { CityResult } from '../model/types';
import { IconSearch } from '@tabler/icons-react';
import { MeteomixLoader } from '@/shared/ui/meteomix-loader';

interface Props {
  onSelect: (city: CityResult) => void;
  /** Название текущего выбранного города */
  selectedCity?: string;
}

export function CitySelect({ onSelect, selectedCity }: Props) {
  const { input, setInput, suggestions, loading, selectCity, value, setValue } =
    useCityAutocomplete(onSelect, selectedCity);

  return (
    <Select
      allowDeselect={false}
      withCheckIcon={false}
      searchable
      clearable
      value={value}
      searchValue={input}
      onSearchChange={setInput}
      data={suggestions}
      placeholder="Введите город"
      nothingFoundMessage="Нет вариантов"
      rightSection={loading ? <MeteomixLoader /> : <MeteomixLoader />}
      maxDropdownHeight={300}
      leftSection={<IconSearch size={16} stroke={1.5} />}
      onChange={(nextValue) => {
        setValue(nextValue);
        if (nextValue) selectCity(nextValue);
      }}
    />
  );
}
