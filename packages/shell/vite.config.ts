import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import federation from '@originjs/vite-plugin-federation';

// ⚠️ NO requiredVersion — pnpm registers deps as 'undefined', breaks singleton check
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
      name: 'shell',
      exposes: {
        './auth-store': './src/store/auth-store.ts',
      },
      remotes: {
        sharedUi:  'http://localhost:3005/assets/remoteEntry.js',
        remoteCrm: 'http://localhost:3001/assets/remoteEntry.js',
      },
      shared,
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  server: {
    port: 3000,
  },
});
