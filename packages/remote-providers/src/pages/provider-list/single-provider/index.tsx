import React, { memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Stack, Text } from '@chakra-ui/react';
import AppBreadcrumb from 'sharedUi/AppBreadcrumb';
import { getProviderById } from '../../../mock';
import ProviderDetailsCard from './ProviderDetailsCard';
import ProviderTabs from './tabs/ProviderTabs';

function SingleProviderBase() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const provider = getProviderById(id ?? '');
  const handleBack = () => navigate('/providers/provider-list');

  return (
    <Stack gap="2.4rem">
      <AppBreadcrumb
        link="/providers/provider-list"
        beforeText="Providers List"
        afterText="View provider"
        onBack={handleBack}
      />
      <Box
        bg="var(--surface-card)"
        borderRadius=".8rem"
        p={{ base: '1.6rem', md: '2.4rem' }}
        border="1px solid var(--surface-border)"
      >
        {!provider ? (
          <Box p="4rem" textAlign="center">
            <Text fontFamily="Montserrat, sans-serif" fontSize="1.8rem" color="var(--text-muted)">
              Provider not found
            </Text>
          </Box>
        ) : (
          <>
            <ProviderDetailsCard provider={provider} />
            <ProviderTabs provider={provider} />
          </>
        )}
      </Box>
    </Stack>
  );
}

export default memo(SingleProviderBase);
