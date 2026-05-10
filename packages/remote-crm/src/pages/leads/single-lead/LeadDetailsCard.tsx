import React, { memo } from 'react';
import { Box, Flex, Text, Stack } from '@chakra-ui/react';
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppButton from 'sharedUi/AppButton';
import type { Lead } from '../types';

interface Props {
  lead: Lead;
}

function LeadDetailsCardBase({ lead }: Props) {
  const navigate = useNavigate();

  return (
    <>
      {}
      <Box borderBottom="1px solid var(--surface-border)" pb="1.6rem">
        <Flex justify="space-between" align="center">
          <Text
            fontFamily="Montserrat, sans-serif"
            fontSize="2.4rem"
            fontWeight="600"
            color="var(--text-primary)"
          >
            Lead
          </Text>
          <AppButton
            variant="outline"
            leftIcon={<Pencil size={16} />}
            buttonSize="md"
            onClick={() => navigate(`/crm/leads/edit/${lead.id}`)}
          >
            Edit information
          </AppButton>
        </Flex>
      </Box>

      {}
      <Box mt="2.8rem">
        <Stack gap="1.6rem">
          <Text
            fontFamily="Montserrat, sans-serif"
            fontSize="2rem"
            fontWeight="600"
            color="var(--text-primary)"
          >
            {lead.title}
          </Text>
          <Text fontFamily="Montserrat, sans-serif" fontSize="1.4rem" color="var(--text-muted)">
            Needs:{' '}
            <Box as="span" color="var(--text-primary)" fontWeight="600">
              {lead.needType.join(', ')}
            </Box>
          </Text>
        </Stack>
      </Box>
    </>
  );
}

export const LeadDetailsCard = memo(LeadDetailsCardBase);
export default LeadDetailsCard;
