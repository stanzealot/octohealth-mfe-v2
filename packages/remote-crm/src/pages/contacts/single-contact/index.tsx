import React, { memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Flex, Spinner, Stack, Text } from '@chakra-ui/react';
import { AlertCircle } from 'lucide-react';
import AppBreadcrumb from 'sharedUi/AppBreadcrumb';
import PatientDetailCard from 'sharedUi/PatientDetailCard';
import AppButton from 'sharedUi/AppButton';
import ContactTabs from './tabs/ContactTabs';
import { fetchContactById } from '../../../lib/contacts-api';
import { mockContacts, type Contact } from '../../../mock/contacts';
import type { ContactDetail, ContactGender } from '../../../types/contact';

function adaptMockContact(mock: Contact): ContactDetail {
  return {
    id: mock.id,
    firstName: mock.firstName,
    lastName: mock.lastName,
    prefix: mock.prefix,
    gender: mock.gender as ContactGender | undefined,
    dateOfBirth: mock.dateOfBirth,
    membership: mock.membership ? { regNumber: mock.membership.regNumber } : null,
    contactEmails: mock.email ? [{ email: mock.email }] : [],
    contactPhones: mock.phone ? [{ phone: mock.phone }] : [],
  };
}

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
        <Text fontFamily="Montserrat, sans-serif" fontSize="1.4rem" color="var(--text-muted)">
          This contact may have been removed or the link is invalid.
        </Text>
        <AppButton variant="outline" onClick={onBack}>
          Back to Contacts
        </AppButton>
      </Flex>
    </Box>
  );
});

function SingleContactPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: contact,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['contact', id],
    queryFn: async (): Promise<ContactDetail> => {
      try {
        return await fetchContactById(id!);
      } catch {
        const mock = mockContacts.find((c) => c.id === id);
        if (!mock) throw new Error('Contact not found');
        return adaptMockContact(mock);
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const handleBack = () => navigate('/crm/contacts');

  return (
    <Stack gap="2.4rem">
      {}
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
        {}
        {isLoading && <LoadingSkeleton />}

        {isError && <ErrorState onBack={handleBack} />}

        {contact && !isLoading && (
          <>
            <PatientDetailCard
              firstName={contact.firstName}
              lastName={contact.lastName}
              photoUrl={contact.photo?.url}
              memberId={contact.membership?.regNumber}
              gender={contact.gender}
              dateOfBirth={
                contact.dateOfBirth
                  ? new Date(contact.dateOfBirth).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : undefined
              }
              policyNo={contact.membership?.policyNo}
              policyStartDate={contact.membership?.policyStartDate}
              policyValidUpTo={contact.membership?.policyValidUpTo}
              groupName={contact.membership?.groupName}
              planType={contact.membership?.planType}
              planName={contact.membership?.planName}
            />

            {}
            <ContactTabs contact={contact} />
          </>
        )}
      </Box>
    </Stack>
  );
}

export default memo(SingleContactPage);
