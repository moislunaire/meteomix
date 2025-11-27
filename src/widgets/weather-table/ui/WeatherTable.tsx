import { Paper, Table } from '@mantine/core';

export interface WeatherForecastRow {
  source: string;
  today: string;
  tomorrow: string;
  dayAfterTomorrow: string;
}

interface WeatherTableProps {
  data: WeatherForecastRow[];
}

export function WeatherTable({ data }: WeatherTableProps) {
  return (
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
          {data.map((row) => (
            <Table.Tr key={row.source}>
              <Table.Td>{row.source}</Table.Td>
              <Table.Td>{row.today}</Table.Td>
              <Table.Td>{row.tomorrow}</Table.Td>
              <Table.Td>{row.dayAfterTomorrow}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
