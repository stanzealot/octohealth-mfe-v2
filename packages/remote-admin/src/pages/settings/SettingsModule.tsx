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

/**
 * EXPOSED via federation as 'remoteAdmin/SettingsModule'.
 * Shell mounts this at /admin/* — routes here handle everything under /admin/
 */
export default function SettingsModule() {
  return (
    <Routes>
      {/*
       * Shell mounts this at /admin/settings/*
       * Paths here are relative to /admin/settings/
       */}
      <Route
        path="branding"
        element={
          <Suspense fallback={<Loader />}>
            <BrandingSettings />
          </Suspense>
        }
      />

      {/*
       * <Route index> only fires when the URL is EXACTLY /admin/settings (no sub-path).
       * This is intentionally NOT a catch-all (*) — a wildcard caused infinite loops
       * because it also fired during transitions to unrelated routes like /crm/contacts,
       * which Chrome then throttled as a navigation attack.
       */}
      <Route index element={<Navigate to="/admin/settings/branding" replace />} />
    </Routes>
  );
}
