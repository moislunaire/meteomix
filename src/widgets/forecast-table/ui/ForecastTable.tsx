import { Paper, Table, Text, Group, Tooltip } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { SkeletonCell } from './SkeletonCell';
import classes from './ForecastTable.module.css';
import type {
  ForecastBySource,
  ForecastErrorsBySource,
  ForecastSourceId,
} from '@/entities/forecast/model/types';

const SOURCES: { key: ForecastSourceId; label: string }[] = [
  { key: 'openMeteo', label: 'Open-Meteo' },
  { key: 'metNo', label: 'MET Norway' },
  { key: 'weatherApi', label: 'WeatherAPI' },
  { key: 'visualCrossing', label: 'Visual Crossing' },
];

interface Props {
  forecasts: ForecastBySource;
  errors: ForecastErrorsBySource;
  isLoading: boolean;
  hasAnyData: boolean;
}

export function ForecastTable({ forecasts, errors, isLoading, hasAnyData }: Props) {
  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Table highlightOnHover={hasAnyData} withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Источник</Table.Th>
            <Table.Th>Сегодня</Table.Th>
            <Table.Th>Завтра</Table.Th>
            <Table.Th>Послезавтра</Table.Th>
          </Table.Tr>
        </Table.Thead>

        {/* 🟡 EMPTY STATE внутри таблицы */}
        {!hasAnyData && !isLoading ? (
          <Table.Tbody>
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Group justify="center">
                  <IconAlertTriangle size={18} color="gold" />
                  <Text ta="center" c="dimmed" size="sm">
                    Не удалось получить прогноз погоды ни от одного сервиса.
                  </Text>
                </Group>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        ) : (
          <Table.Tbody>
            {SOURCES.map(({ key, label }) => {
              const days = forecasts[key];
              const isError = errors[key];

              return (
                <Table.Tr key={key} className={isError ? classes.rowError : undefined}>
                  {/* источник */}
                  <Table.Td>
                    {label}{' '}
                    {isError ? (
                      <Tooltip
                        label={`Не удалось получить данные от сервиса ${label}`}
                        withArrow
                        color="red"
                      >
                        <span className={classes.errorIcon}>⚠️</span>
                      </Tooltip>
                    ) : null}
                  </Table.Td>

                  {/* 3 дня */}
                  {[0, 1, 2].map((idx) => {
                    const day = days?.[idx];

                    if (isLoading && !day) {
                      return (
                        <Table.Td key={idx}>
                          <SkeletonCell />
                        </Table.Td>
                      );
                    }

                    if (isError || !day) {
                      return <Table.Td key={idx}>—</Table.Td>;
                    }

                    return (
                      <Table.Td key={idx}>
                        {day.temp}°C {day.icon}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        )}
      </Table>
    </Paper>
  );
}
