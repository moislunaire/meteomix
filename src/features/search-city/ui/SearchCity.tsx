import { Button, Group, Paper, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface SearchCityProps {
  placeholder?: string;
}

export function SearchCity({ placeholder = 'Введите город' }: SearchCityProps) {
  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Group justify="space-between">
        <Group grow>
          <TextInput placeholder={placeholder} leftSection={<IconSearch size={16} />} />
          <Button>Найти</Button>
        </Group>
      </Group>
    </Paper>
  );
}
