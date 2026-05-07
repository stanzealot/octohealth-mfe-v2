import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';
import ContactsList    from './ContactsList';
import SingleContact   from './single-contact';
import LeadsList       from '../leads/LeadsList';
import SingleLead      from '../leads/single-lead';
import CompaniesList   from '../companies/CompaniesList';
import SingleCompany   from '../companies/single-company';

const ContactFormPage  = lazy(() => import('./add-contact'));
const AddLeadPage      = lazy(() => import('../leads/add-lead'));
const AddCompanyPage   = lazy(() => import('../companies/add-company'));

function PageLoader() {
  return (
    <Flex h="40vh" align="center" justify="center">
      <Spinner color="var(--brand-primary)" size="lg" />
    </Flex>
  );
}

export default function ContactsModule() {
  return (
    <Routes>
      {/* List */}
      <Route index element={<ContactsList />} />
      <Route path="contacts" element={<ContactsList />} />

      {/* Add */}
      <Route
        path="contacts/new"
        element={
          <Suspense fallback={<PageLoader />}>
            <ContactFormPage />
          </Suspense>
        }
      />

      {/* Edit */}
      <Route
        path="contacts/:id/edit"
        element={
          <Suspense fallback={<PageLoader />}>
            <ContactFormPage />
          </Suspense>
        }
      />

      {/* Detail */}
      <Route path="contacts/:id" element={<SingleContact />} />

      {/* ── Leads ──────────────────────────────────────────────── */}
      {/* List */}
      <Route path="leads" element={<LeadsList />} />

      {/* Add */}
      <Route
        path="leads/add-lead"
        element={
          <Suspense fallback={<PageLoader />}>
            <AddLeadPage />
          </Suspense>
        }
      />

      {/* Edit */}
      <Route
        path="leads/edit/:id"
        element={
          <Suspense fallback={<PageLoader />}>
            <AddLeadPage />
          </Suspense>
        }
      />

      {/* Single lead */}
      <Route path="leads/:id" element={<SingleLead />} />

      {/* ── Companies / Entities ───────────────────────────────── */}
      {/* List */}
      <Route path="companies" element={<CompaniesList />} />

      {/* Add */}
      <Route
        path="companies/add"
        element={
          <Suspense fallback={<PageLoader />}>
            <AddCompanyPage />
          </Suspense>
        }
      />

      {/* Edit */}
      <Route
        path="companies/edit/:id"
        element={
          <Suspense fallback={<PageLoader />}>
            <AddCompanyPage />
          </Suspense>
        }
      />

      {/* Single company */}
      <Route path="companies/:id" element={<SingleCompany />} />
    </Routes>
  );
}
