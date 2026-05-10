import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';
import ContactsList from './ContactsList';
import SingleContact from './single-contact';
import LeadsList from '../leads/LeadsList';
import SingleLead from '../leads/single-lead';
import CompaniesList from '../companies/CompaniesList';
import SingleCompany from '../companies/single-company';

const ContactFormPage = lazy(() => import('./add-contact'));
const AddLeadPage = lazy(() => import('../leads/add-lead'));
const AddCompanyPage = lazy(() => import('../companies/add-company'));

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
      {}
      <Route index element={<ContactsList />} />
      <Route path="contacts" element={<ContactsList />} />

      {}
      <Route
        path="contacts/new"
        element={
          <Suspense fallback={<PageLoader />}>
            <ContactFormPage />
          </Suspense>
        }
      />

      {}
      <Route
        path="contacts/:id/edit"
        element={
          <Suspense fallback={<PageLoader />}>
            <ContactFormPage />
          </Suspense>
        }
      />

      {}
      <Route path="contacts/:id" element={<SingleContact />} />

      {}
      {}
      <Route path="leads" element={<LeadsList />} />

      {}
      <Route
        path="leads/add-lead"
        element={
          <Suspense fallback={<PageLoader />}>
            <AddLeadPage />
          </Suspense>
        }
      />

      {}
      <Route
        path="leads/edit/:id"
        element={
          <Suspense fallback={<PageLoader />}>
            <AddLeadPage />
          </Suspense>
        }
      />

      {}
      <Route path="leads/:id" element={<SingleLead />} />

      {}
      {}
      <Route path="companies" element={<CompaniesList />} />

      {}
      <Route
        path="companies/add"
        element={
          <Suspense fallback={<PageLoader />}>
            <AddCompanyPage />
          </Suspense>
        }
      />

      {}
      <Route
        path="companies/edit/:id"
        element={
          <Suspense fallback={<PageLoader />}>
            <AddCompanyPage />
          </Suspense>
        }
      />

      {}
      <Route path="companies/:id" element={<SingleCompany />} />
    </Routes>
  );
}
