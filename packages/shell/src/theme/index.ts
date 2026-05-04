import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          primary:      { value: 'var(--brand-primary)' },
          primaryLight: { value: 'var(--brand-primary-light)' },
          primaryDark:  { value: 'var(--brand-primary-dark)' },
          secondary:    { value: 'var(--brand-secondary)' },
        },
      },
      fonts: {
        heading: { value: 'Montserrat, sans-serif' },
        body:    { value: 'Montserrat, sans-serif' },
      },
    },
    semanticTokens: {
      colors: {
        boxBg: { value: { base: 'var(--surface-card)', _dark: 'var(--surface-card)' } },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
