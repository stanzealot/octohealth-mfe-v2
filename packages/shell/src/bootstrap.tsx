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
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 2 },
  },
});

function Root() {
  // Hydrate auth state from sessionStorage once on mount
  // (replaces Zustand persist middleware — avoids React 19 concurrent-mode conflict)
  useEffect(() => {
    useAuthStore.getState().hydrateFromStorage();
  }, []);

  return (
    <App />
  );
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
