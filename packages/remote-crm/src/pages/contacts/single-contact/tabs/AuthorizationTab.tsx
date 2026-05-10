import React, { useState, useMemo, memo } from 'react';
import { Box } from '@chakra-ui/react';
import { Badge } from '@chakra-ui/react';
import { type TableColumn } from 'react-data-table-component';
import { Plus } from 'lucide-react';
import ReusableDataTable from 'sharedUi/ReusableDataTable';
import AppButton from 'sharedUi/AppButton';
import ActionMenu from 'sharedUi/ActionMenu';
import { mockAuthorizations, type Authorization } from './types';
import { TAB_TABLE_CUSTOM_STYLES } from './shared/styles';
import { formatCurrency } from './shared/formatters';
import { AUTHORIZATION_STATUS_COLORS } from './shared/status-colors';

interface Props {
  contactId: string;
}

function AuthorizationTabBase({ contactId }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (!searchTerm) return mockAuthorizations;
    const q = searchTerm.toLowerCase();
    return mockAuthorizations.filter(
      (a) =>
        a.authNumber.toLowerCase().includes(q) ||
        a.providerName.toLowerCase().includes(q) ||
        a.submittedBy.toLowerCase().includes(q),
    );
  }, [searchTerm]);

  const columns: TableColumn<Authorization>[] = useMemo(
    () => [
      { name: 'Auth Number', selector: (r) => r.authNumber, sortable: true, minWidth: '14rem' },
      { name: 'Provider', selector: (r) => r.providerName, sortable: true, minWidth: '13rem' },
      {
        name: 'Type',
        selector: (r) => r.type,
        sortable: true,
        minWidth: '9rem',
        cell: (r) => (
          <Badge colorPalette={r.type === 'IP' ? 'blue' : 'purple'} size="sm">
            {r.type}
          </Badge>
        ),
      },
      {
        name: 'Request Amt.',
        selector: (r) => r.requestAmount,
        sortable: true,
        minWidth: '14rem',
        cell: (r) => formatCurrency(r.requestAmount),
      },
      {
        name: 'Approved Amt.',
        selector: (r) => r.approvedAmount,
        sortable: true,
        minWidth: '14rem',
        cell: (r) => formatCurrency(r.approvedAmount),
      },
      {
        name: 'Created Date',
        selector: (r) => r.authCreatedDate,
        sortable: true,
        minWidth: '14rem',
      },
      { name: 'Submitted By', selector: (r) => r.submittedBy, sortable: true, minWidth: '14rem' },
      { name: 'Processed By', selector: (r) => r.processedBy, sortable: true, minWidth: '14rem' },
      {
        name: 'Status',
        selector: (r) => r.status,
        sortable: true,
        minWidth: '13rem',
        cell: (r) => (
          <Badge colorPalette={AUTHORIZATION_STATUS_COLORS[r.status]} size="sm">
            {r.status}
          </Badge>
        ),
      },
      { name: 'Last Updated', selector: (r) => r.lastUpdated, sortable: true, minWidth: '13rem' },
      {
        name: 'Actions',
        cell: (row) => (
          <ActionMenu
            actions={[
              { label: 'View', cta: () => console.log('View auth', row.id, contactId) },
              { label: 'Edit', cta: () => console.log('Edit auth', row.id) },
              {
                label: 'Delete',
                cta: () => console.log('Delete auth', row.id),
                allowPopover: true,
                confirmationText: 'Delete this authorization?',
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
        searchPlaceholder="Search authorizations…"
        noDataMessage="No authorizations found"
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        customStyles={TAB_TABLE_CUSTOM_STYLES}
        fixedHeader
        fixedHeaderScrollHeight="50rem"
        hasFixedActionColumn
        actionButtons={
          <AppButton variant="primary" leftIcon={<Plus size={16} />} enableRipple>
            New Authorization
          </AppButton>
        }
      />
    </Box>
  );
}

export const AuthorizationTab = memo(AuthorizationTabBase);
export default AuthorizationTab;
