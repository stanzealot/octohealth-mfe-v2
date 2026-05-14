import React, { memo } from 'react';
import { Box } from '@chakra-ui/react';
import { TwoColumnDetailGrid } from 'sharedUi/DetailGridPresets';
import type { ProviderDetails } from '../../../../types';

interface Props {
  provider: ProviderDetails;
}

function FinancialInfoTabBase({ provider }: Props) {
  const sections = [
    {
      items: [
        { label: 'Longitude', value: provider.longitude ?? 'N/A' },
        { label: 'Latitude', value: provider.latitude ?? 'N/A' },
      ],
    },
    {
      items: [
        { label: 'Fee Value', value: provider.feeValue },
        { label: 'Available days', value: provider.availableDays.join(', ') },
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

export default memo(FinancialInfoTabBase);
