import React, { memo } from 'react';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Plus } from 'lucide-react';
import AppButton from 'sharedUi/AppButton';
import type { ProviderDetails } from '../../../types';

interface Props {
  provider: ProviderDetails;
}

function ProviderDetailsCardBase({ provider }: Props) {
  const navigate = useNavigate();
  return (
    <>
      <Box borderBottom="1px solid var(--surface-border)" pb="2.4rem">
        <Flex justify="space-between" align="center" flexWrap="wrap" gap="1.2rem">
          <Text
            fontFamily="Montserrat, sans-serif"
            fontSize="2rem"
            fontWeight="700"
            color="var(--text-primary)"
          >
            Provider details
          </Text>
          <Flex gap="1.2rem" flexWrap="wrap">
            <AppButton
              variant="outline"
              leftIcon={<Pencil size={15} />}
              enableRipple
              onClick={() => navigate(`/providers/provider-list/edit/${provider.id}`)}
            >
              Edit information
            </AppButton>
            <AppButton
              variant="outline"
              leftIcon={<Plus size={15} />}
              enableRipple
              onClick={() => {}}
            >
              Add branch
            </AppButton>
            <AppButton
              variant="outline"
              leftIcon={<Plus size={15} />}
              enableRipple
              onClick={() => {}}
            >
              Add Network
            </AppButton>
          </Flex>
        </Flex>
      </Box>

      <Box mt="2.8rem">
        <Flex align="center" gap="1.6rem">
          <Flex
            w="7.2rem"
            h="7.2rem"
            borderRadius="50%"
            bg="var(--brand-primary-light)"
            align="center"
            justify="center"
            flexShrink={0}
          >
            <Text
              fontFamily="Montserrat, sans-serif"
              fontSize="2.4rem"
              fontWeight="700"
              color="var(--brand-primary)"
            >
              {provider.providerName.charAt(0)}
            </Text>
          </Flex>
          <Stack gap="0.8rem">
            <Text
              fontFamily="Montserrat, sans-serif"
              fontSize="2rem"
              fontWeight="600"
              color="var(--text-primary)"
            >
              {provider.providerName} {provider.providerType}
            </Text>
            <Flex gap="2.4rem" flexWrap="wrap">
              {[
                { label: 'CAC', value: provider.cacNumber },
                { label: 'Service Type', value: provider.serviceType },
                { label: 'Effective Date', value: provider.effectiveDate },
                { label: 'Termination Date', value: provider.terminationDate },
              ].map(({ label, value }) => (
                <Text
                  key={label}
                  fontFamily="Montserrat, sans-serif"
                  fontSize="1.4rem"
                  color="var(--text-muted)"
                >
                  {label}:{' '}
                  <Box as="span" color="var(--text-primary)" fontWeight="600">
                    {value}
                  </Box>
                </Text>
              ))}
            </Flex>
          </Stack>
        </Flex>
      </Box>
    </>
  );
}

export const ProviderDetailsCard = memo(ProviderDetailsCardBase);
export default ProviderDetailsCard;
