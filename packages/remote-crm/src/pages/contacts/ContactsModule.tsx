import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Flex, Spinner } from '@chakra-ui/react';
import ContactsList    from './ContactsList';
import SingleContact   from './SingleContact';

const ContactFormPage = lazy(() => import('./form/ContactFormPage'));

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
    </Routes>
  );
}
