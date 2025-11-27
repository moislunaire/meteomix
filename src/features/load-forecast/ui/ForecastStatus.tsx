import { Alert, Center, Loader, Text } from '@mantine/core';

interface Props {
  isLoading: boolean;
  isError: boolean;
  hasData: boolean;
  children: React.ReactNode;
}

export function ForecastStatus({ isLoading, isError, hasData, children }: Props) {
  if (isLoading) {
    return (
      <Center py="xl">
        <Loader size="lg" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Alert color="red" variant="light" title="Error loading forecasts">
        Try again later or choose another city.
      </Alert>
    );
  }

  if (!hasData) {
    return (
      <Center py="xl">
        <Text c="dimmed">No forecast data available</Text>
      </Center>
    );
  }

  return <>{children}</>;
}
