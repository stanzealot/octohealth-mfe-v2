import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';
import { useAuth } from './store/auth-store';
import PublicWrapper from './wrappers/PublicWrapper';
import PrivateWrapper from './wrappers/PrivateWrapper';
import LoginPage from './pages/login/LoginPage';

const ContactsModule = lazy(() => import('remoteCrm/ContactsModule'));
const SettingsModule = lazy(() => import('remoteAdmin/SettingsModule'));
const OpportunitiesModule = lazy(() => import('remoteSales/OpportunitiesModule'));
const ProvidersModule = lazy(() => import('remoteProviders/ProvidersModule'));

function PageLoader() {
  return (
    <Flex h="100vh" align="center" justify="center">
      <Spinner size="xl" color="var(--brand-primary)" borderWidth="3px" />
    </Flex>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {}
      <Route
        path="/"
        element={
          <PublicWrapper title="Welcome back" description="Sign in to your OctoHealth account">
            <LoginPage />
          </PublicWrapper>
        }
      />

      {}
      <Route
        path="/crm/*"
        element={
          <ProtectedRoute>
            <PrivateWrapper>
              <Suspense fallback={<PageLoader />}>
                <ContactsModule />
              </Suspense>
            </PrivateWrapper>
          </ProtectedRoute>
        }
      />

      {}
      <Route
        path="/admin/settings/*"
        element={
          <ProtectedRoute>
            <PrivateWrapper>
              <Suspense fallback={<PageLoader />}>
                <SettingsModule />
              </Suspense>
            </PrivateWrapper>
          </ProtectedRoute>
        }
      />

      {}
      <Route
        path="/sales/*"
        element={
          <ProtectedRoute>
            <PrivateWrapper>
              <Suspense fallback={<PageLoader />}>
                <OpportunitiesModule />
              </Suspense>
            </PrivateWrapper>
          </ProtectedRoute>
        }
      />

      {}
      <Route
        path="/providers/*"
        element={
          <ProtectedRoute>
            <PrivateWrapper>
              <Suspense fallback={<PageLoader />}>
                <ProvidersModule />
              </Suspense>
            </PrivateWrapper>
          </ProtectedRoute>
        }
      />

      {}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
