import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import federation from '@originjs/vite-plugin-federation';

const shared = {
  'react':                 { singleton: true, eager: true },
  'react-dom':             { singleton: true, eager: true },
  'react-router-dom':      { singleton: true },
  '@chakra-ui/react':      { singleton: true },
  '@emotion/react':        { singleton: true },
  'framer-motion':         { singleton: true },
  'zustand':               { singleton: true },
  '@tanstack/react-query': { singleton: true },
  'axios':                 { singleton: true },
};

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remoteCrm',
      exposes: {
        './ContactsModule': './src/pages/contacts/ContactsModule.tsx',
      },
      remotes: {
        shell:    'http://localhost:3000/assets/remoteEntry.js',
        sharedUi: 'http://localhost:3005/assets/remoteEntry.js',
      },
      shared,
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  preview: {
    port: 3001,
    strictPort: true,
  },
});
