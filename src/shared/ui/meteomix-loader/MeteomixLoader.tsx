import { Center, Image } from '@mantine/core';
import classes from './MeteomixLoader.module.css';

export function MeteomixLoader() {
  return (
    <Center aria-label="Загрузка Meteomix" role="status">
      <Image src="/meteomix.svg" alt="Загрузка Meteomix" h={40} w={40} className={classes.loader} />
    </Center>
  );
}
