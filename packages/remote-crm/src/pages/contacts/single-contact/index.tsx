/**
 * SingleContact — `/crm/contacts/:id`
 *
 * Matches the monolith's single-contact/single-contact.tsx exactly:
 *  1. Breadcrumb nav:  ← Contacts | View Contact
 *  2. PatientDetailCard: avatar + name + 3-column member/policy/plan grid
 *  3. ContactTabs:  10 tabs — Activities, Authorization, Claims, Invoices,
 *                   Notes, Documents, Addresses, Emails, Phone Numbers, Relations
 *
 * Data: fetched from the API via react-query. Shows a skeleton card while
 * loading and a friendly "not found" state on error.
 */

import React, { memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Flex, Spinner, Stack, Text } from '@chakra-ui/react';
import { AlertCircle } from 'lucide-react';
import AppBreadcrumb     from 'sharedUi/AppBreadcrumb';
import PatientDetailCard from 'sharedUi/PatientDetailCard';
import AppButton         from 'sharedUi/AppButton';
import ContactTabs       from './tabs/ContactTabs';
import { fetchContactById } from '../../../lib/contacts-api';
import { mockContacts, type Contact } from '../../../mock/contacts';
import type { ContactDetail, ContactGender } from '../../../types/contact';

/* ─── Mock → ContactDetail adapter ───────────────────────────────────────
 * Used as a dev fallback when the real API is unavailable or returns a 404
 * for a mock ID (e.g. "c-001"). Keeps the page functional during development.
 * ──────────────────────────────────────────────────────────────────────── */
function adaptMockContact(mock: Contact): ContactDetail {
  return {
    id:          mock.id,
    firstName:   mock.firstName,
    lastName:    mock.lastName,
    prefix:      mock.prefix,
    gender:      mock.gender as ContactGender | undefined,
    dateOfBirth: mock.dateOfBirth,
    membership:  mock.membership
      ? { regNumber: mock.membership.regNumber }
      : null,
    contactEmails:  mock.email ? [{ email: mock.email }] : [],
    contactPhones:  mock.phone ? [{ phone: mock.phone }] : [],
  };
}

/* ─── Loading skeleton ────────────────────────────────────────────────── */

const LoadingSkeleton = memo(function LoadingSkeleton() {
  return (
    <Box
      border="1px solid var(--surface-border)"
      borderRadius="8px"
      p="3.2rem"
      mb="2.4rem"
      bg="var(--surface-card)"
    >
      <Flex align="center" justify="center" h="20rem">
        <Spinner size="lg" color="var(--brand-primary)" />
      </Flex>
    </Box>
  );
});

/* ─── Error state ─────────────────────────────────────────────────────── */

const ErrorState = memo(function ErrorState({ onBack }: { onBack: () => void }) {
  return (
    <Box
      border="1px solid var(--surface-border)"
      borderRadius="8px"
      p="4rem"
      bg="var(--surface-card)"
      textAlign="center"
    >
      <Flex direction="column" align="center" gap="1.6rem">
        <AlertCircle size={48} color="var(--text-muted)" />
        <Text
          fontFamily="Montserrat, sans-serif"
          fontSize="1.8rem"
          fontWeight="600"
          color="var(--text-primary)"
        >
          Contact not found
        </Text>
        <Text
          fontFamily="Montserrat, sans-serif"
          fontSize="1.4rem"
          color="var(--text-muted)"
        >
          This contact may have been removed or the link is invalid.
        </Text>
        <AppButton variant="outline" onClick={onBack}>
          Back to Contacts
        </AppButton>
      </Flex>
    </Box>
  );
});

/* ─── Main page ───────────────────────────────────────────────────────── */

function SingleContactPage() {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();

  const { data: contact, isLoading, isError } = useQuery({
    queryKey:  ['contact', id],
    queryFn:   async (): Promise<ContactDetail> => {
      try {
        return await fetchContactById(id!);
      } catch {
        // API unavailable or ID not found (e.g. mock IDs during development).
        // Fall back to the local mock contacts list so the UI stays functional.
        const mock = mockContacts.find((c) => c.id === id);
        if (!mock) throw new Error('Contact not found');
        return adaptMockContact(mock);
      }
    },
    enabled:   !!id,
    staleTime: 1000 * 60 * 5,   // 5 min
    retry:     0,                // we handle the fallback ourselves — no retry needed
  });

  const handleBack = () => navigate('/crm/contacts');

  return (
    <Stack gap="2.4rem">
      {/* ← Contacts | View Contact */}
      <AppBreadcrumb
        link="/crm/contacts"
        beforeText="Contacts"
        afterText="View Contact"
        onBack={handleBack}
      />

      <Box
        backgroundColor="var(--surface-card)"
        p={{ base: '1.6rem', md: '2.4rem' }}
        borderRadius=".8rem"
        boxShadow="0 1px 3px rgba(0,0,0,0.04)"
      >
        {/* PatientDetailCard */}
        {isLoading && <LoadingSkeleton />}

        {isError && <ErrorState onBack={handleBack} />}

        {contact && !isLoading && (
          <>
            <PatientDetailCard
              firstName={contact.firstName}
              lastName={contact.lastName}
              photoUrl={contact.photo?.url}

              /* Member Details */
              memberId={contact.membership?.regNumber}
              gender={contact.gender}
              dateOfBirth={contact.dateOfBirth
                ? new Date(contact.dateOfBirth).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })
                : undefined}

              /* Policy Details — from membership sub-object */
              policyNo={contact.membership?.policyNo}
              policyStartDate={contact.membership?.policyStartDate}
              policyValidUpTo={contact.membership?.policyValidUpTo}

              /* Plan Details */
              groupName={contact.membership?.groupName}
              planType={contact.membership?.planType}
              planName={contact.membership?.planName}
            />

            {/* ContactTabs */}
            <ContactTabs contact={contact} />
          </>
        )}
      </Box>
    </Stack>
  );
}

export default memo(SingleContactPage);
