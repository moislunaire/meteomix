import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@mantine/core/styles.css';
import { createTheme, Loader, MantineProvider } from '@mantine/core';
import { StoreProvider } from './providers/store/StoreProvider.tsx';
import { MeteomixLoader } from '@/shared/ui/meteomix-loader';

const theme = createTheme({
  components: {
    Loader: Loader.extend({
      defaultProps: {
        loaders: { ...Loader.defaultLoaders, custom: MeteomixLoader },
        type: 'custom',
      },
    }),
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <MantineProvider defaultColorScheme="light" theme={theme}>
        <App />
      </MantineProvider>
    </StoreProvider>
  </StrictMode>
);
