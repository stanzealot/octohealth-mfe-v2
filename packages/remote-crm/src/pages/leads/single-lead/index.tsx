import React, { memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Stack, Flex, Text } from '@chakra-ui/react';
import { AlertCircle } from 'lucide-react';
import AppBreadcrumb from 'sharedUi/AppBreadcrumb';
import AppButton from 'sharedUi/AppButton';
import LeadDetailsCard from './LeadDetailsCard';
import LeadTabs from './tabs/LeadTabs';
import { getLeadById } from '../mock/leads';

const NotFound = memo(function NotFound({ onBack }: { onBack: () => void }) {
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
          Lead not found
        </Text>
        <Text fontFamily="Montserrat, sans-serif" fontSize="1.4rem" color="var(--text-muted)">
          This lead may have been removed or the link is invalid.
        </Text>
        <AppButton variant="outline" onClick={onBack}>
          Back to Leads
        </AppButton>
      </Flex>
    </Box>
  );
});

function SingleLeadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const lead = getLeadById(id ?? '');
  const handleBack = () => navigate('/crm/leads');

  return (
    <Stack gap="2.4rem">
      {}
      <AppBreadcrumb
        link="/crm/leads"
        beforeText="Leads"
        afterText="View leads"
        onBack={handleBack}
      />

      <Box
        backgroundColor="var(--surface-card)"
        p={{ base: '1.6rem', md: '2.4rem' }}
        borderRadius=".8rem"
        boxShadow="0 1px 3px rgba(0,0,0,0.04)"
      >
        {!lead ? (
          <NotFound onBack={handleBack} />
        ) : (
          <>
            <LeadDetailsCard lead={lead} />
            <LeadTabs lead={lead} />
          </>
        )}
      </Box>
    </Stack>
  );
}

export default memo(SingleLeadPage);
