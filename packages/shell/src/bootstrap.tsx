import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'nprogress/nprogress.css';
import { system } from './theme';
import { useAuthStore } from './store/auth-store';
import { useBrandingStore } from './store/branding-store';
import { useColorModeStore } from './store/color-mode-store';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 2 },
  },
});

function Root() {
  // Hydrate all stores from localStorage/sessionStorage once on mount.
  // Called AFTER FOUC prevention script has already applied initial CSS vars.
  useEffect(() => {
    useAuthStore.getState().hydrateFromStorage();
    useBrandingStore.getState().fetchBranding();
    useColorModeStore.getState().hydrateColorMode();
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ChakraProvider value={system}>
      <BrowserRouter>
        <Root />
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </ChakraProvider>
  </QueryClientProvider>,
);
