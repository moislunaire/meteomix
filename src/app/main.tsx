import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { StoreProvider } from './providers/store/StoreProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <MantineProvider defaultColorScheme="light">
        <App />
      </MantineProvider>
    </StoreProvider>
  </StrictMode>
);
