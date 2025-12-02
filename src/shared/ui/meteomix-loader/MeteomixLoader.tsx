import { forwardRef } from 'react';
import cx from 'clsx';
import { Box, type MantineLoaderComponent } from '@mantine/core';
import classes from './MeteomixLoader.module.css';

export const MeteomixLoader: MantineLoaderComponent = forwardRef(
  ({ className, ...others }, ref) => (
    <Box
      component="span"
      className={cx(classes['meteomix-css-loader'], className)}
      {...others}
      ref={ref}
    />
  )
);
