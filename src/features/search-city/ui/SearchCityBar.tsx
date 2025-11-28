import { useState } from 'react';
import { Paper, Group, TextInput, Button } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface SearchCityBarProps {
  cityName: string;
  onSearch: (cityName: string) => void;
}

export function SearchCityBar({ cityName, onSearch }: SearchCityBarProps) {
  const [value, setValue] = useState(cityName);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Group>
        <TextInput
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите город (например, Москва)"
          leftSection={<IconSearch size={16} />}
          w="100%"
        />
        <Button onClick={handleSubmit}>Найти</Button>
      </Group>
    </Paper>
  );
}
