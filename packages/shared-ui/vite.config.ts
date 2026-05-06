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
      name: 'sharedUi',
      exposes: {
        './Sidebar':           './src/components/Sidebar/index.tsx',
        './TopBar':            './src/components/TopBar/index.tsx',
        './AppButton':         './src/components/AppButton/index.tsx',
        './AppInput':          './src/components/AppInput/index.tsx',
        './BaseDataTable':     './src/components/BaseDataTable/index.tsx',
        './ReusableDataTable': './src/components/ReusableDataTable/index.tsx',
        './ActionMenu':        './src/components/ActionMenu/index.tsx',
        './AnimatedModal':     './src/components/AnimatedModal/index.tsx',
        './GridCard':          './src/components/GridCard/index.tsx',
        './ConfirmDeleteModal':'./src/components/ConfirmDeleteModal/index.tsx',
        './CustomSelect':      './src/components/CustomSelect/index.tsx',
        './AppPagination':    './src/components/AppPagination/index.tsx',
      },
      remotes: {
        shell: 'http://localhost:3000/assets/remoteEntry.js',
      },
      shared,
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  preview: {
    port: 3005,
    strictPort: true,
  },
});
