import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';
import { useAuth } from './store/auth-store';
import PublicWrapper from './wrappers/PublicWrapper';
import PrivateWrapper from './wrappers/PrivateWrapper';
import LoginPage from './pages/login/LoginPage';

const ContactsModule = lazy(() => import('remoteCrm/ContactsModule'));

function PageLoader() {
  return (
    <Flex h="100vh" align="center" justify="center">
      <Spinner size="xl" color="#0C6525" borderWidth="3px" />
    </Flex>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Still hydrating from sessionStorage — don't redirect yet
  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={
          <PublicWrapper title="Welcome back" description="Sign in to your OctoHealth account">
            <LoginPage />
          </PublicWrapper>
        }
      />

      {/* CRM remote */}
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
