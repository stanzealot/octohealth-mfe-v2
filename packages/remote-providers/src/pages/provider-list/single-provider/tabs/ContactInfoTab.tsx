import React, { memo } from 'react';
import { Box } from '@chakra-ui/react';
import { TwoColumnDetailGrid } from 'sharedUi/DetailGridPresets';
import type { ProviderDetails } from '../../../../types';

interface Props {
  provider: ProviderDetails;
}

function ContactInfoTabBase({ provider }: Props) {
  const sections = [
    {
      items: [
        { label: "Provider's phone number", value: provider.phoneNumber },
        { label: "Provider's phone number 1", value: provider.phoneNumber1 ?? 'N/A' },
        { label: "Provider's phone number 2", value: provider.phoneNumber2 ?? 'N/A' },
        { label: 'Email address', value: provider.email },
        { label: 'Email address 1', value: provider.email1 ?? 'N/A' },
        { label: 'Address 1', value: provider.address1 },
        { label: 'Address 2', value: provider.address2 ?? 'N/A' },
      ],
    },
    {
      items: [
        { label: 'Country', value: provider.country },
        { label: 'State', value: provider.state },
        { label: 'City', value: provider.city },
        { label: 'Town/City', value: provider.townCity },
        { label: 'PO BOX', value: provider.poBox ?? 'N/A' },
        { label: 'Provider OWN Code', value: provider.providerOwnCode },
        { label: 'Professional fees', value: provider.professionalFees ? 'YES' : 'NO' },
      ],
    },
  ];
  return (
    <Box
      p="2.4rem"
      border="1px solid var(--surface-border)"
      borderRadius="8px"
      bg="var(--surface-card)"
    >
      <TwoColumnDetailGrid sections={sections} />
    </Box>
  );
}

export default memo(ContactInfoTabBase);
