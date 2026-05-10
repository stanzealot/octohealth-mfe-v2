import React, { useState, useMemo, memo } from 'react';
import { Box } from '@chakra-ui/react';
import { Badge } from '@chakra-ui/react';
import { type TableColumn } from 'react-data-table-component';
import { Plus } from 'lucide-react';
import ReusableDataTable from 'sharedUi/ReusableDataTable';
import AppButton from 'sharedUi/AppButton';
import ActionMenu from 'sharedUi/ActionMenu';
import { mockClaims, type Claim } from './types';
import { TAB_TABLE_CUSTOM_STYLES } from './shared/styles';
import { formatCurrency } from './shared/formatters';
import { CLAIM_STATUS_COLORS, CLAIM_TYPE_COLORS } from './shared/status-colors';

interface Props {
  contactId: string;
}

function ClaimsTabBase({ contactId }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (!searchTerm) return mockClaims;
    const q = searchTerm.toLowerCase();
    return mockClaims.filter(
      (c) =>
        c.claimNo.toLowerCase().includes(q) ||
        c.providerName.toLowerCase().includes(q) ||
        c.planName.toLowerCase().includes(q),
    );
  }, [searchTerm]);

  const columns: TableColumn<Claim>[] = useMemo(
    () => [
      { name: 'Claim No.', selector: (r) => r.claimNo, sortable: true, minWidth: '13rem' },
      { name: 'Statement No.', selector: (r) => r.statementNo, sortable: true, minWidth: '14rem' },
      { name: 'Payer', selector: (r) => r.payer, sortable: true, minWidth: '12rem' },
      { name: 'Group Name', selector: (r) => r.groupName, sortable: true, minWidth: '14rem' },
      { name: 'Plan Name', selector: (r) => r.planName, sortable: true, minWidth: '12rem' },
      { name: 'Service Date', selector: (r) => r.serviceDate, sortable: true, minWidth: '14rem' },
      {
        name: 'Type',
        selector: (r) => r.type,
        sortable: true,
        minWidth: '9rem',
        cell: (r) => (
          <Badge colorPalette={CLAIM_TYPE_COLORS[r.type]} size="sm">
            {r.type}
          </Badge>
        ),
      },
      {
        name: 'Claim Amount',
        selector: (r) => r.claimAmount,
        sortable: true,
        minWidth: '15rem',
        cell: (r) => formatCurrency(r.claimAmount),
      },
      {
        name: 'Approved Amt.',
        selector: (r) => r.approvedAmount,
        sortable: true,
        minWidth: '15rem',
        cell: (r) => formatCurrency(r.approvedAmount),
      },
      { name: 'Provider', selector: (r) => r.providerName, sortable: true, minWidth: '13rem' },
      {
        name: 'Status',
        selector: (r) => r.status,
        sortable: true,
        minWidth: '12rem',
        cell: (r) => (
          <Badge colorPalette={CLAIM_STATUS_COLORS[r.status]} size="sm">
            {r.status}
          </Badge>
        ),
      },
      {
        name: 'Actions',
        cell: (row) => (
          <ActionMenu
            actions={[
              { label: 'View', cta: () => console.log('View claim', row.id, contactId) },
              { label: 'Edit', cta: () => console.log('Edit claim', row.id) },
              {
                label: 'Delete',
                cta: () => console.log('Delete claim', row.id),
                allowPopover: true,
                confirmationText: 'Delete this claim?',
              },
            ]}
          />
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
        width: '10rem',
      },
    ],
    [contactId],
  );

  return (
    <Box>
      <ReusableDataTable
        data={filtered}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search claims…"
        noDataMessage="No claims found"
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        customStyles={TAB_TABLE_CUSTOM_STYLES}
        fixedHeader
        fixedHeaderScrollHeight="50rem"
        hasFixedActionColumn
        actionButtons={
          <AppButton variant="primary" leftIcon={<Plus size={16} />} enableRipple>
            New Claim
          </AppButton>
        }
      />
    </Box>
  );
}

export const ClaimsTab = memo(ClaimsTabBase);
export default ClaimsTab;
