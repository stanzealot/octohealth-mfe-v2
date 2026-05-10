import React, { memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Stack, Flex, Text } from '@chakra-ui/react';
import { AlertCircle } from 'lucide-react';
import AppBreadcrumb from 'sharedUi/AppBreadcrumb';
import AppButton from 'sharedUi/AppButton';
import CompanyDetailsCard from './CompanyDetailsCard';
import CompanyTabs from './CompanyTabs';
import { getEntityById } from '../mock/entities';

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
          Entity not found
        </Text>
        <Text fontFamily="Montserrat, sans-serif" fontSize="1.4rem" color="var(--text-muted)">
          This entity may have been removed or the link is invalid.
        </Text>
        <AppButton variant="outline" onClick={onBack}>
          Back to Entities
        </AppButton>
      </Flex>
    </Box>
  );
});

function SingleCompanyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const entity = getEntityById(id ?? '');

  const handleBack = () => navigate('/crm/companies');

  return (
    <Stack gap="2.4rem">
      <AppBreadcrumb
        link="/crm/companies"
        beforeText="Entities"
        afterText="View Entity"
        onBack={handleBack}
      />

      <Box
        backgroundColor="var(--surface-card)"
        p={{ base: '1.6rem', md: '2.4rem' }}
        borderRadius=".8rem"
        boxShadow="0 1px 3px rgba(0,0,0,0.04)"
      >
        {!entity ? (
          <NotFound onBack={handleBack} />
        ) : (
          <>
            <CompanyDetailsCard entity={entity} />
            <CompanyTabs entity={entity} />
          </>
        )}
      </Box>
    </Stack>
  );
}

export default memo(SingleCompanyPage);
