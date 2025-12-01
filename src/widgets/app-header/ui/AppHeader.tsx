import { Group, Image, Title } from '@mantine/core';

export function AppHeader() {
  return (
    <Group gap="sm" align="center">
      <Image src="/meteomix.svg" alt="Meteomix — агрегатор погодных данных" h={40} w={40} />
      <Title order={1} fw={700} size="h3">
        Meteomix
      </Title>
    </Group>
  );
}
