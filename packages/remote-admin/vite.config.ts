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
        name: 'remoteAdmin',
        exposes: {
          './SettingsModule': './src/pages/settings/SettingsModule.tsx',
        },
        remotes: {
          shell: env.VITE_SHELL_URL || 'http://localhost:3000/assets/remoteEntry.js',
          sharedUi: env.VITE_SHARED_UI_URL || 'http://localhost:3005/assets/remoteEntry.js',
        },
        shared,
      }),
    ],
    build: {
      target: 'esnext',
      minify: false,
    },
    preview: {
      port: 3002,
      strictPort: true,
    },
  };
});
