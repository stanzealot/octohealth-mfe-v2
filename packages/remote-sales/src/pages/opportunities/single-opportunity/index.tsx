import React, { memo, useCallback } from 'react';
import { Stack, Flex, Box, Text } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import AppButton from 'sharedUi/AppButton';
import AppBreadcrumb from 'sharedUi/AppBreadcrumb';

import { getOpportunityById } from '../mock/opportunities';
import { getOpportunityCardColors, formatCurrency } from '../constants';

const DetailRow = memo(function DetailRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <Box>
      <Text
        fontSize="1.2rem"
        fontWeight="500"
        color="var(--text-muted)"
        fontFamily="Montserrat, sans-serif"
        mb="0.4rem"
        textTransform="uppercase"
        letterSpacing="0.05em"
      >
        {label}
      </Text>
      <Text
        fontSize="1.4rem"
        fontWeight="600"
        color={accent ?? 'var(--text-primary)'}
        fontFamily="Montserrat, sans-serif"
      >
        {value || '—'}
      </Text>
    </Box>
  );
});

function SingleOpportunityBase() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const opp = id ? getOpportunityById(id) : undefined;

  const handleEdit = useCallback(() => {
    navigate(`/sales/opportunities/edit/${id}`);
  }, [navigate, id]);

  const handleBack = useCallback(() => {
    navigate('/sales/opportunities');
  }, [navigate]);

  if (!opp) {
    return (
      <Stack gap="2.4rem">
        <AppBreadcrumb
          link="/sales/opportunities"
          beforeText="Opportunities"
          afterText="Not found"
          onBack={handleBack}
        />
        <Flex
          direction="column"
          align="center"
          justify="center"
          py="8rem"
          bg="var(--surface-card)"
          borderRadius=".8rem"
          border="1px solid var(--surface-border)"
        >
          <Text
            fontSize="2rem"
            fontWeight="700"
            color="var(--text-primary)"
            fontFamily="Montserrat, sans-serif"
            mb="0.8rem"
          >
            Opportunity not found
          </Text>
          <Text
            fontSize="1.4rem"
            color="var(--text-muted)"
            fontFamily="Montserrat, sans-serif"
            mb="2.4rem"
          >
            The opportunity you're looking for doesn't exist or has been removed.
          </Text>
          <AppButton variant="primary" onClick={handleBack}>
            Back to Opportunities
          </AppButton>
        </Flex>
      </Stack>
    );
  }

  const cardColors = getOpportunityCardColors(opp.stage);

  return (
    <Stack gap="2.4rem">
      {}
      <AppBreadcrumb
        link="/sales/opportunities"
        beforeText="Opportunities"
        afterText={opp.title}
        onBack={handleBack}
      />

      {}
      <Box
        bg="var(--surface-card)"
        borderRadius=".8rem"
        border="1px solid var(--surface-border)"
        borderTop={`4px solid ${cardColors.borderTop}`}
        px={{ base: '1.6rem', md: '4rem' }}
        py="2.4rem"
      >
        <Flex justify="space-between" align="flex-start" mb="1.6rem" gap="1.2rem" flexWrap="wrap">
          <Box flex={1}>
            {}
            <Flex
              display="inline-flex"
              align="center"
              gap="0.6rem"
              bg={cardColors.badge.bg}
              color={cardColors.badge.text}
              fontSize="1.2rem"
              px="1rem"
              py="0.4rem"
              borderRadius="4px"
              fontWeight="500"
              border="1px solid"
              borderColor={cardColors.badge.text + '20'}
              fontFamily="Montserrat, sans-serif"
              mb="1.2rem"
            >
              <Box w="6px" h="6px" borderRadius="50%" bg={cardColors.borderTop} />
              {opp.stage}
            </Flex>

            <Text
              fontFamily="Montserrat, sans-serif"
              fontSize="2.2rem"
              fontWeight="700"
              color="var(--text-primary)"
              mb="0.8rem"
            >
              {opp.title}
            </Text>
            {opp.description && (
              <Text fontFamily="Montserrat, sans-serif" fontSize="1.4rem" color="var(--text-muted)">
                {opp.description}
              </Text>
            )}
          </Box>

          {}
          <Flex direction="column" align="flex-end" gap="1.2rem" flexShrink={0}>
            <Box textAlign="right">
              <Text fontSize="1.2rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
                Opportunity Value
              </Text>
              <Text
                fontSize="2.4rem"
                fontWeight="700"
                color="var(--brand-primary)"
                fontFamily="Montserrat, sans-serif"
              >
                {formatCurrency(opp.value)}
              </Text>
            </Box>
            <AppButton variant="outline" buttonSize="sm" onClick={handleEdit}>
              Edit information
            </AppButton>
          </Flex>
        </Flex>
      </Box>

      {}
      <Box
        bg="var(--surface-card)"
        borderRadius=".8rem"
        border="1px solid var(--surface-border)"
        px={{ base: '1.6rem', md: '4rem' }}
        py="2.4rem"
      >
        <Text
          fontFamily="Montserrat, sans-serif"
          fontSize="1.6rem"
          fontWeight="600"
          color="var(--text-primary)"
          mb="2.4rem"
          pb="1.6rem"
          borderBottom="1px solid var(--surface-border)"
        >
          Opportunity Information
        </Text>

        <Flex
          gap="3.2rem"
          flexWrap="wrap"
          sx={{
            '& > *': { flex: { base: '1 1 100%', md: '1 1 calc(50% - 1.6rem)' } },
          }}
        >
          <DetailRow label="Stage" value={opp.stage} accent={cardColors.badge.text} />
          <DetailRow label="Source" value={opp.source} />
          <DetailRow label="Priority" value={opp.priority} />
          <DetailRow label="Probability" value={`${opp.probability}%`} />
          <DetailRow label="Contact Person" value={opp.contactPerson} />
          <DetailRow label="Company" value={opp.company} />
          <DetailRow label="Created Date" value={opp.createdDate} />
          <DetailRow label="Created By" value={opp.createdBy} />
          {opp.closeDate && <DetailRow label="Close Date" value={opp.closeDate} />}
        </Flex>
      </Box>
    </Stack>
  );
}

export const SingleOpportunity = memo(SingleOpportunityBase);
export default SingleOpportunity;
