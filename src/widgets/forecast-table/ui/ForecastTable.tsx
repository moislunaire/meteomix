import { Paper, Table, Text, Group, Tooltip } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { SkeletonCell } from './SkeletonCell';
import classes from './ForecastTable.module.css';
import type {
  ForecastBySource,
  ForecastErrorsBySource,
  ForecastSourceId,
} from '@/entities/forecast';
import { FORECAST_DAYS } from '@/shared/config/forecast';

const SOURCES: { key: ForecastSourceId; label: string }[] = [
  { key: 'openMeteo', label: 'Open-Meteo' },
  { key: 'metNo', label: 'MET Norway' },
  { key: 'weatherApi', label: 'WeatherAPI' },
  { key: 'visualCrossing', label: 'Visual Crossing' },
];

const DATE_FORMATTER = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'short',
  day: 'numeric',
  month: 'numeric',
});

interface Props {
  forecasts: ForecastBySource;
  errors: ForecastErrorsBySource;
  isLoading: boolean;
  hasAnyData: boolean;
}

export function ForecastTable({ forecasts, errors, isLoading, hasAnyData }: Props) {
  const dayLabels = Array.from({ length: FORECAST_DAYS }, (_, idx) => {
    const dateString =
      forecasts.openMeteo?.[idx]?.date ??
      forecasts.metNo?.[idx]?.date ??
      forecasts.weatherApi?.[idx]?.date ??
      forecasts.visualCrossing?.[idx]?.date;

    if (dateString) {
      const parsed = new Date(dateString);
      if (!Number.isNaN(parsed.getTime())) {
        return DATE_FORMATTER.format(parsed);
      }
    }

    const fallback = new Date();
    fallback.setDate(fallback.getDate() + idx);
    return DATE_FORMATTER.format(fallback);
  });

  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Table highlightOnHover={hasAnyData} withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Источник</Table.Th>
            {dayLabels.map((label, idx) => (
              <Table.Th key={idx}>{label}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>

        {/* EMPTY STATE внутри таблицы */}
        {!hasAnyData && !isLoading ? (
          <Table.Tbody>
            <Table.Tr>
              <Table.Td colSpan={FORECAST_DAYS + 1}>
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

                  {/* дни прогноза */}
                  {Array.from({ length: FORECAST_DAYS }, (_, idx) => {
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
                        {day.temp}°C{' '}
                        <Tooltip label={day.condition} withArrow>
                          <span aria-label={day.condition}>{day.icon}</span>
                        </Tooltip>
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
