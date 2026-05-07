/**
 * LeadInfoTab — Lead Info tab content
 *
 * Uses TwoColumnDetailGrid from sharedUi/DetailGridPresets.
 * Left section:  Lead stage, Status (inline dot badge), Created Date, Entity
 * Right section: Need Maturity, Source, Created by, Needs
 */

import React, { memo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { TwoColumnDetailGrid } from 'sharedUi/DetailGridPresets';
import { getStatusColor } from '../../constants';
import type { Lead } from '../../types';

/* ─── Inline status dot badge ────────────────────────────────────── */

const STATUS_COLORS: Record<string, string> = {
  Active:       'var(--status-success)',
  Qualified:    'var(--status-success)',
  Disqualified: 'var(--status-danger)',
};

function StatusDot({ status }: { status: string }) {
  const color = STATUS_COLORS[status] ?? 'var(--text-muted)';
  return (
    <Flex align="center" gap="0.6rem">
      <Box
        w="0.8rem"
        h="0.8rem"
        borderRadius="50%"
        bg={color}
        flexShrink={0}
      />
      <Text
        fontFamily="Montserrat, sans-serif"
        fontSize="1.4rem"
        color={color}
        fontWeight="500"
      >
        {status}
      </Text>
    </Flex>
  );
}

/* ─── Component ──────────────────────────────────────────────────── */

interface Props { lead: Lead }

function LeadInfoTabBase({ lead }: Props) {
  const sections = [
    {
      items: [
        { label: 'Lead stage',   value: lead.leadStage                },
        { label: 'Lead status',  value: <StatusDot status={lead.status} /> },
        { label: 'Created Date', value: lead.createdDate              },
        { label: 'Entity',       value: lead.entity                   },
      ],
    },
    {
      items: [
        { label: 'Need Maturity', value: lead.needMaturity            },
        { label: 'Source',        value: lead.source                  },
        { label: 'Created by',    value: lead.createdBy               },
        { label: 'Needs',         value: lead.needType.join(', ')     },
      ],
    },
  ];

  return (
    <Box
      border="1px solid var(--surface-border)"
      borderRadius="8px"
      p="2.4rem"
      bg="var(--surface-card)"
    >
      <TwoColumnDetailGrid sections={sections} />
    </Box>
  );
}

export const LeadInfoTab = memo(LeadInfoTabBase);
export default LeadInfoTab;
