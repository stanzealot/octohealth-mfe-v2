import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import federation from '@originjs/vite-plugin-federation';

const shared = {
  react: { singleton: true, eager: true },
  'react-dom': { singleton: true, eager: true },
  'react-router-dom': { singleton: true },
  '@chakra-ui/react': { singleton: true },
  '@emotion/react': { singleton: true },
  'framer-motion': { singleton: true },
  zustand: { singleton: true },
  '@tanstack/react-query': { singleton: true },
  axios: { singleton: true },
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      federation({
        name: 'shell',
        exposes: {
          './auth-store': './src/store/auth-store.ts',
          './branding-store': './src/store/branding-store.ts',
          './color-mode-store': './src/store/color-mode-store.ts',
        },
        remotes: {
          sharedUi: env.VITE_SHARED_UI_URL || 'http://localhost:3005/assets/remoteEntry.js',
          remoteCrm: env.VITE_REMOTE_CRM_URL || 'http://localhost:3001/assets/remoteEntry.js',
          remoteAdmin: env.VITE_REMOTE_ADMIN_URL || 'http://localhost:3002/assets/remoteEntry.js',
          remoteSales: env.VITE_REMOTE_SALES_URL || 'http://localhost:3003/assets/remoteEntry.js',
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
  };
});
