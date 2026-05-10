import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';

const BrandingSettings = lazy(() => import('./branding/BrandingSettings'));

function Loader() {
  return (
    <Flex h="40rem" align="center" justify="center">
      <Spinner color="var(--brand-primary)" size="lg" borderWidth="3px" />
    </Flex>
  );
}

export default function SettingsModule() {
  return (
    <Routes>
      {}
      <Route
        path="branding"
        element={
          <Suspense fallback={<Loader />}>
            <BrandingSettings />
          </Suspense>
        }
      />

      {}
      <Route index element={<Navigate to="/admin/settings/branding" replace />} />
    </Routes>
  );
}
