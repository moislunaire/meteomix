import { Container, TextInput, Button, Table, Title, Group, Paper, Space } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export default function App() {
  return (
    <Container size="md" py="xl">
      {/* Поисковая панель */}
      <Paper shadow="sm" p="md" radius="md" withBorder>
        <Group justify="space-between">
          <Group grow>
            <TextInput placeholder="Введите город" leftSection={<IconSearch size={16} />} />
            <Button>Найти</Button>
          </Group>
        </Group>
      </Paper>

      <Space h="xl" />

      {/* Заголовок */}
      <Title order={2} ta="center">
        Meteomix — прогноз на 3 дня
      </Title>

      <Space h="lg" />

      {/* Таблица прогноза */}
      <Paper shadow="sm" p="md" radius="md" withBorder>
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Источник</Table.Th>
              <Table.Th>Сегодня</Table.Th>
              <Table.Th>Завтра</Table.Th>
              <Table.Th>Послезавтра</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            <Table.Tr>
              <Table.Td>OpenWeatherMap</Table.Td>
              <Table.Td>+3°C ☁️</Table.Td>
              <Table.Td>+1°C ❄️</Table.Td>
              <Table.Td>+2°C 🌥</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td>AccuWeather</Table.Td>
              <Table.Td>+4°C 🌥</Table.Td>
              <Table.Td>+0°C ❄️</Table.Td>
              <Table.Td>+3°C 🌧</Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td>WeatherAPI</Table.Td>
              <Table.Td>+2°C 🌧</Table.Td>
              <Table.Td>+1°C 🌥</Table.Td>
              <Table.Td>+1°C 🌧</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Paper>
    </Container>
  );
}
