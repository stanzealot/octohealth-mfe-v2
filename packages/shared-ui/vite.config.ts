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
  'react-hook-form':       { singleton: true },
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
        './AppSelect':         './src/components/AppSelect/index.tsx',
        './AppPagination':    './src/components/AppPagination/index.tsx',
        './CardActionMenu':   './src/components/CardActionMenu/index.tsx',
        './AppCheckbox':         './src/components/AppCheckbox/index.tsx',
        './AppSwitch':           './src/components/AppSwitch/index.tsx',
        './AppAsyncSelect':      './src/components/AppAsyncSelect/index.tsx',
        './AppDatePicker':         './src/components/AppDatePicker/index.tsx',
        './AppMultiPhoneInput':    './src/components/AppMultiPhoneInput/index.tsx',
        './AppAccordionSection':   './src/components/AppAccordionSection/index.tsx',
        './AppImageInput':         './src/components/AppImageInput/index.tsx',
        './AppTextTagInput':       './src/components/AppTextTagInput/index.tsx',
        './AppBreadcrumb':         './src/components/AppBreadcrumb/index.tsx',
        './DetailGrid':            './src/components/DetailGrid/index.tsx',
        './DetailGridPresets':     './src/components/DetailGridPresets/index.tsx',
        './PatientDetailCard':     './src/components/PatientDetailCard/index.tsx',
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
