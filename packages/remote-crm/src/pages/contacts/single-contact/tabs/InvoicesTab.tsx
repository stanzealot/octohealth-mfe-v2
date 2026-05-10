import React, { useState, useMemo, memo } from 'react';
import { Box } from '@chakra-ui/react';
import { Badge } from '@chakra-ui/react';
import { type TableColumn } from 'react-data-table-component';
import { Plus } from 'lucide-react';
import ReusableDataTable from 'sharedUi/ReusableDataTable';
import AppButton from 'sharedUi/AppButton';
import ActionMenu from 'sharedUi/ActionMenu';
import { mockInvoices, type Invoice } from './types';
import { TAB_TABLE_CUSTOM_STYLES } from './shared/styles';
import { formatCurrency } from './shared/formatters';
import { INVOICE_STATUS_COLORS } from './shared/status-colors';

interface Props {
  contactId: string;
}

function InvoicesTabBase({ contactId }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (!searchTerm) return mockInvoices;
    const q = searchTerm.toLowerCase();
    return mockInvoices.filter(
      (inv) =>
        inv.invoiceId.toLowerCase().includes(q) ||
        inv.issuedFor.toLowerCase().includes(q) ||
        inv.service.toLowerCase().includes(q),
    );
  }, [searchTerm]);

  const columns: TableColumn<Invoice>[] = useMemo(
    () => [
      { name: 'Invoice ID', selector: (r) => r.invoiceId, sortable: true, minWidth: '13rem' },
      { name: 'Service', selector: (r) => r.service, sortable: true, minWidth: '22rem' },
      { name: 'Issued For', selector: (r) => r.issuedFor, sortable: true, minWidth: '16rem' },
      {
        name: 'Amount Paid',
        selector: (r) => r.amountPaid,
        sortable: true,
        minWidth: '16rem',
        cell: (r) => formatCurrency(r.amountPaid),
      },
      { name: 'Issued Date', selector: (r) => r.issuedPaid, sortable: true, minWidth: '14rem' },
      { name: 'Date Paid', selector: (r) => r.datePaid, sortable: true, minWidth: '14rem' },
      {
        name: 'Status',
        selector: (r) => r.status,
        sortable: true,
        minWidth: '12rem',
        cell: (r) => (
          <Badge colorPalette={INVOICE_STATUS_COLORS[r.status]} size="sm">
            {r.status}
          </Badge>
        ),
      },
      {
        name: 'Actions',
        cell: (row) => (
          <ActionMenu
            actions={[
              { label: 'View', cta: () => console.log('View invoice', row.id, contactId) },
              { label: 'Edit', cta: () => console.log('Edit invoice', row.id) },
              {
                label: 'Delete',
                cta: () => console.log('Delete invoice', row.id),
                allowPopover: true,
                confirmationText: 'Delete this invoice?',
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
        searchPlaceholder="Search invoices…"
        noDataMessage="No invoices found"
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        customStyles={TAB_TABLE_CUSTOM_STYLES}
        fixedHeader
        fixedHeaderScrollHeight="50rem"
        hasFixedActionColumn
        actionButtons={
          <AppButton variant="primary" leftIcon={<Plus size={16} />} enableRipple>
            New Invoice
          </AppButton>
        }
      />
    </Box>
  );
}

export const InvoicesTab = memo(InvoicesTabBase);
export default InvoicesTab;
