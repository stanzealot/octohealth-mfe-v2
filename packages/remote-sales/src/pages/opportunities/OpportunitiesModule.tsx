import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';
import OpportunitiesEntry from './OpportunitiesEntry';
import SingleOpportunity from './single-opportunity';

const AddOpportunityPage = lazy(() => import('./add-opportunity'));

function PageLoader() {
  return (
    <Flex h="40vh" align="center" justify="center">
      <Spinner color="var(--brand-primary)" size="lg" />
    </Flex>
  );
}

export default function OpportunitiesModule() {
  return (
    <Routes>
      {}
      <Route index element={<OpportunitiesEntry />} />
      <Route path="opportunities" element={<OpportunitiesEntry />} />

      {}
      <Route
        path="opportunities/add-opportunity"
        element={
          <Suspense fallback={<PageLoader />}>
            <AddOpportunityPage />
          </Suspense>
        }
      />

      {}
      <Route
        path="opportunities/edit/:id"
        element={
          <Suspense fallback={<PageLoader />}>
            <AddOpportunityPage />
          </Suspense>
        }
      />

      {}
      <Route path="opportunities/:id" element={<SingleOpportunity />} />
    </Routes>
  );
}
