import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          primary:      { value: '#0C6525' },
          primaryLight: { value: '#F0F9F5' },
          secondary:    { value: '#667085' },
        },
      },
      fonts: {
        heading: { value: 'Montserrat, sans-serif' },
        body:    { value: 'Montserrat, sans-serif' },
      },
    },
    semanticTokens: {
      colors: {
        boxBg: { value: { base: 'white', _dark: '{colors.gray.900}' } },
      },
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
