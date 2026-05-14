import React, { memo } from 'react';
import { Box } from '@chakra-ui/react';
import { TwoColumnDetailGrid } from 'sharedUi/DetailGridPresets';
import type { ProviderDetails } from '../../../../types';

interface Props {
  provider: ProviderDetails;
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'Active';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0.3rem 1rem',
        borderRadius: '2rem',
        fontSize: '1.2rem',
        fontWeight: 500,
        background: isActive ? 'rgba(18,183,106,0.12)' : 'var(--hover-bg)',
        color: isActive ? 'var(--status-success)' : 'var(--text-muted)',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'currentColor',
          display: 'inline-block',
        }}
      />
      {status}
    </span>
  );
}

function ProviderInfoTabBase({ provider }: Props) {
  const sections = [
    {
      items: [
        { label: 'Provider name', value: provider.providerName },
        { label: 'Provider Type', value: provider.providerType },
        { label: 'Service type', value: provider.serviceType },
        { label: 'Effective Date', value: provider.effectiveDate },
      ],
    },
    {
      items: [
        { label: 'Master provider code', value: provider.masterProviderCode },
        { label: 'Status', value: <StatusBadge status={provider.status} /> },
        { label: 'Part of', value: provider.partOf },
        { label: 'Termination Date', value: provider.terminationDate },
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

export default memo(ProviderInfoTabBase);
