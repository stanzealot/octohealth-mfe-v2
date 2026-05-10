import React, { memo } from 'react';
import { Box, Flex, Grid, Text, Image } from '@chakra-ui/react';
import { User } from 'lucide-react';
import { DetailRow } from '../DetailGrid';

export interface PatientDetailCardProps {
  firstName: string;
  lastName: string;
  photoUrl?: string | null;

  memberId?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;

  policyNo?: string | null;
  policyStartDate?: string | null;
  policyValidUpTo?: string | null;

  groupName?: string | null;
  planType?: string | null;
  planName?: string | null;

  heading?: string;
}

const Avatar = memo(function Avatar({
  photoUrl,
  fullName,
}: {
  photoUrl?: string | null;
  fullName: string;
}) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt={fullName}
        w="8rem"
        h="8rem"
        objectFit="cover"
        objectPosition="center"
        borderRadius="8px"
        flexShrink={0}
      />
    );
  }

  const initials = fullName
    .split(' ')
    .map((n) => n[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Flex
      w="8rem"
      h="8rem"
      borderRadius="8px"
      bg="var(--brand-primary-light)"
      border="1px solid var(--surface-border)"
      align="center"
      justify="center"
      flexShrink={0}
    >
      {initials ? (
        <Text
          fontSize="2.4rem"
          fontWeight="700"
          color="var(--brand-primary)"
          fontFamily="Montserrat, sans-serif"
        >
          {initials}
        </Text>
      ) : (
        <User size={32} color="var(--text-muted)" />
      )}
    </Flex>
  );
});

function PatientDetailCardBase({
  firstName,
  lastName,
  photoUrl,
  memberId,
  gender,
  dateOfBirth,
  policyNo,
  policyStartDate,
  policyValidUpTo,
  groupName,
  planType,
  planName,
  heading = 'Patient Details',
}: PatientDetailCardProps) {
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <Box
      border="1px solid var(--surface-border)"
      borderRadius="8px"
      p={{ base: '2rem', md: '3.2rem' }}
      mb="2.4rem"
      bg="var(--surface-card)"
    >
      {}
      <Text
        fontFamily="Montserrat, sans-serif"
        fontWeight="700"
        fontSize="1.8rem"
        color="var(--text-primary)"
        mb="2.4rem"
      >
        {heading}
      </Text>

      {}
      <Flex
        mb="2rem"
        align={{ base: 'flex-start', md: 'center' }}
        justify="space-between"
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: '2.4rem', md: '0' }}
      >
        {}
        <Box minWidth={{ base: 'unset', md: '20rem' }} flexShrink={0}>
          <Avatar photoUrl={photoUrl} fullName={fullName} />
          <Text
            fontFamily="Montserrat, sans-serif"
            fontWeight="700"
            fontSize="2rem"
            lineHeight="2.4rem"
            color="var(--text-primary)"
            mt="1.6rem"
          >
            {fullName}
          </Text>
        </Box>

        {}
        <Box w={{ base: '100%', md: '85%' }}>
          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            }}
            gap={{ base: 4, md: 8, lg: 12 }}
          >
            {}
            <Box>
              <DetailRow label="Member ID" value={memberId || 'N/A'} />
              <DetailRow label="Gender" value={gender || 'N/A'} />
              <DetailRow label="Date of Birth" value={dateOfBirth || 'N/A'} />
            </Box>

            {}
            <Box>
              <DetailRow label="Policy No." value={policyNo || 'N/A'} />
              <DetailRow label="Policy Start Date" value={policyStartDate || 'N/A'} />
              <DetailRow label="Policy Valid Up To" value={policyValidUpTo || 'N/A'} />
            </Box>

            {}
            <Box>
              <DetailRow label="Group Name" value={groupName || 'N/A'} />
              <DetailRow label="Plan Type" value={planType || 'N/A'} />
              <DetailRow label="Plan Name" value={planName || 'N/A'} />
            </Box>
          </Grid>
        </Box>
      </Flex>
    </Box>
  );
}

export const PatientDetailCard = memo(PatientDetailCardBase);
export default PatientDetailCard;
