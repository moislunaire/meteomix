import { Paper, Table } from '@mantine/core';
import type { ForecastBySource } from '@/entities/forecast/model/types';

interface ForecastTableProps {
  forecasts: ForecastBySource;
}

const SOURCES: { key: keyof ForecastBySource; label: string }[] = [
  { key: 'openMeteo', label: 'Open-Meteo' },
  { key: 'metNo', label: 'MET Norway' },
  { key: 'weatherApi', label: 'WeatherAPI' },
  { key: 'visualCrossing', label: 'Visual Crossing' },
];

const formatTemp = (temp?: number) => {
  if (temp === undefined || Number.isNaN(temp)) return '—';
  const sign = temp > 0 ? '+' : temp < 0 ? '' : '';
  return `${sign}${Math.round(temp)}°C`;
};

export function ForecastTable({ forecasts }: ForecastTableProps) {
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
          {SOURCES.map(({ key, label }) => {
            const days = forecasts[key];

            if (!days || days.length === 0) {
              return null; // нет данных — не рисуем строку
            }

            const d0 = days[0];
            const d1 = days[1];
            const d2 = days[2];

            return (
              <Table.Tr key={key}>
                <Table.Td>{label}</Table.Td>
                <Table.Td>{d0 ? `${formatTemp(d0.temp)} ${d0.icon}` : '—'}</Table.Td>
                <Table.Td>{d1 ? `${formatTemp(d1.temp)} ${d1.icon}` : '—'}</Table.Td>
                <Table.Td>{d2 ? `${formatTemp(d2.temp)} ${d2.icon}` : '—'}</Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
