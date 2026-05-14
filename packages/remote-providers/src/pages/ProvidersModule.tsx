import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';
import ProvidersList from './provider-list/ProvidersList';
import SingleProvider from './provider-list/single-provider';
import NetworkList from './network/NetworkList';
import SingleNetwork from './network/single-network';
import TariffList from './tariff/TariffList';

const AddProviderPage = lazy(() => import('./provider-list/add-provider'));
const AddTariffPage = lazy(() => import('./tariff/add-tariff'));
const ViewTariff = lazy(() => import('./tariff/view-tariff'));
const ViewTariffItems = lazy(() => import('./tariff/view-tariff-items'));

function PageLoader() {
  return (
    <Flex h="40vh" align="center" justify="center">
      <Spinner color="var(--brand-primary)" size="lg" />
    </Flex>
  );
}

export default function ProvidersModule() {
  return (
    <Routes>
      {/* ─── Provider List ────────────────────────────────────────────────── */}
      <Route index element={<ProvidersList />} />
      <Route path="provider-list" element={<ProvidersList />} />

      {/* Add provider */}
      <Route
        path="provider-list/add-provider"
        element={
          <Suspense fallback={<PageLoader />}>
            <AddProviderPage />
          </Suspense>
        }
      />

      {/* Edit provider */}
      <Route
        path="provider-list/edit/:id"
        element={
          <Suspense fallback={<PageLoader />}>
            <AddProviderPage />
          </Suspense>
        }
      />

      {/* Single provider */}
      <Route path="provider-list/:id" element={<SingleProvider />} />

      {/* ─── Network ─────────────────────────────────────────────────────── */}
      <Route path="network" element={<NetworkList />} />
      <Route path="network/:id" element={<SingleNetwork />} />

      {/* ─── Tariff ──────────────────────────────────────────────────────── */}
      <Route path="tariff" element={<TariffList />} />

      {/* Add tariff */}
      <Route
        path="tariff/add-tariff"
        element={
          <Suspense fallback={<PageLoader />}>
            <AddTariffPage />
          </Suspense>
        }
      />

      {/* Edit tariff */}
      <Route
        path="tariff/edit/:id"
        element={
          <Suspense fallback={<PageLoader />}>
            <AddTariffPage />
          </Suspense>
        }
      />

      {/* View tariff */}
      <Route
        path="tariff/:id"
        element={
          <Suspense fallback={<PageLoader />}>
            <ViewTariff />
          </Suspense>
        }
      />

      {/* View tariff items */}
      <Route
        path="tariff/:id/service/:serviceId"
        element={
          <Suspense fallback={<PageLoader />}>
            <ViewTariffItems />
          </Suspense>
        }
      />
    </Routes>
  );
}
