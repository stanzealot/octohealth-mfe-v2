import React, { useState, useMemo, memo } from 'react';
import { Box } from '@chakra-ui/react';
import { Badge } from '@chakra-ui/react';
import { type TableColumn } from 'react-data-table-component';
import { Plus } from 'lucide-react';
import ReusableDataTable from 'sharedUi/ReusableDataTable';
import AppButton from 'sharedUi/AppButton';
import ActionMenu from 'sharedUi/ActionMenu';
import { mockActivities, type Activity } from './types';

/* ─── Status/Priority badges ─────────────────────────────────────────── */

const STATUS_COLORS: Record<Activity['status'], string> = {
  'Completed':   'green',
  'Pending':     'orange',
  'In-progress': 'blue',
  'Past due':    'red',
};

const PRIORITY_COLORS: Record<Activity['priority'], string> = {
  'Urgent':    'red',
  'Important': 'blue',
  'Normal':    'gray',
  'Low':       'green',
};

const StatusBadge  = memo(({ status   }: { status:   Activity['status']   }) => <Badge colorPalette={STATUS_COLORS[status]}   size="sm">{status}</Badge>);
const PriorityBadge = memo(({ priority }: { priority: Activity['priority'] }) => <Badge colorPalette={PRIORITY_COLORS[priority]} size="sm">{priority}</Badge>);

/* ─── Column styles ──────────────────────────────────────────────────── */

const customStyles = {
  headCells: { style: { color: 'var(--text-muted)', fontWeight: '500', fontSize: '1.2rem', textTransform: 'uppercase' as const, letterSpacing: '0.5px' } },
  cells:     { style: { color: 'var(--text-primary)', fontSize: '1.4rem', paddingTop: '1.2rem', paddingBottom: '1.2rem', borderBottom: '1px solid var(--table-border)' } },
};

/* ─── Component ──────────────────────────────────────────────────────── */

interface Props { contactId: string }

function ActivitiesTabBase({ contactId }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (!searchTerm) return mockActivities;
    const q = searchTerm.toLowerCase();
    return mockActivities.filter((a) =>
      a.subject.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q),
    );
  }, [searchTerm]);

  const columns: TableColumn<Activity>[] = [
    { name: 'Activity Type', selector: (r) => r.type,        sortable: true, minWidth: '14rem' },
    { name: 'Subject',       selector: (r) => r.subject,     sortable: true, minWidth: '20rem' },
    { name: 'Description',   selector: (r) => r.description, sortable: true, minWidth: '25rem' },
    { name: 'Due By',        selector: (r) => r.dueBy,       sortable: true, minWidth: '13rem' },
    { name: 'Priority',      selector: (r) => r.priority,    sortable: true, minWidth: '12rem', cell: (r) => <PriorityBadge priority={r.priority} /> },
    { name: 'Date Created',  selector: (r) => r.dateCreated, sortable: true, minWidth: '14rem' },
    { name: 'Status',        selector: (r) => r.status,      sortable: true, minWidth: '13rem', cell: (r) => <StatusBadge status={r.status} /> },
    { name: 'Date Updated',  selector: (r) => r.dateUpdated, sortable: true, minWidth: '14rem' },
    {
      name: 'Actions',
      cell: (row) => (
        <ActionMenu
          actions={[
            { label: 'View',   cta: () => console.log('View activity',   row.id, contactId) },
            { label: 'Edit',   cta: () => console.log('Edit activity',   row.id) },
            { label: 'Delete', cta: () => console.log('Delete activity', row.id), allowPopover: true, confirmationText: 'Delete this activity?' },
          ]}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '10rem',
    },
  ];

  return (
    <Box>
      <ReusableDataTable
        data={filtered}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search activities…"
        noDataMessage="No activities found"
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        customStyles={customStyles}
        fixedHeader
        fixedHeaderScrollHeight="50rem"
        hasFixedActionColumn
        actionButtons={
          <AppButton variant="primary" leftIcon={<Plus size={16} />} enableRipple>
            New Activity
          </AppButton>
        }
      />
    </Box>
  );
}

export const ActivitiesTab = memo(ActivitiesTabBase);
export default ActivitiesTab;
