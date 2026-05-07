/**
 * LeadsList — `/crm/leads`
 *
 * Matches the monolith's leads-entry.tsx exactly:
 *  - Searchable data table with 11 columns + actions
 *  - Badge coloring for Need Maturity and Status
 *  - Import file + Add Lead action buttons
 *  - useMemo for columns + filtered data; useCallback for handlers
 */

import React, { useState, useMemo, useCallback, memo } from 'react';
import { Stack, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus } from 'lucide-react';
import type { TableColumn } from 'react-data-table-component';
import ReusableDataTable from 'sharedUi/ReusableDataTable';
import CardActionMenu   from 'sharedUi/CardActionMenu';
import AppButton        from 'sharedUi/AppButton';
import { mockLeads, filterLeadsData } from './mock/leads';
import { getNeedMaturityColor, getStatusColor } from './constants';
import type { Lead } from './types';

/* ─── Component ──────────────────────────────────────────────────── */

function LeadsListBase() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredData = useMemo(
    () => filterLeadsData(mockLeads, { search: searchTerm }),
    [searchTerm],
  );

  const handleView = useCallback(
    (id: string) => navigate(`/crm/leads/${id}`),
    [navigate],
  );

  const handleEdit = useCallback(
    (id: string) => navigate(`/crm/leads/edit/${id}`),
    [navigate],
  );

  const handleDelete = useCallback((_id: string) => {
    // TODO: implement delete
  }, []);

  const handleAddLead = useCallback(
    () => navigate('/crm/leads/add-lead'),
    [navigate],
  );

  /* ─── Column definitions ─────────────────────────────────────── */
  const columns: TableColumn<Lead>[] = useMemo(
    () => [
      {
        name:     'Lead Title',
        selector: (row) => row.title,
        sortable: true,
        width:    '180px',
      },
      {
        name:     'Need Type',
        selector: (row) => row.needType.join(', '),
        sortable: true,
        width:    '250px',
      },
      {
        name:     'Source',
        selector: (row) => row.source,
        sortable: true,
        width:    '120px',
      },
      {
        name:  'Need Maturity',
        cell:  (row) => (
          <Badge colorPalette={getNeedMaturityColor(row.needMaturity)} fontSize="1.2rem" p={2}>
            {row.needMaturity}
          </Badge>
        ),
        sortable: true,
        width:    '140px',
      },
      {
        name:     'Lead Stage',
        selector: (row) => row.leadStage,
        sortable: true,
        width:    '120px',
      },
      {
        name:     'Contact',
        selector: (row) => row.contact,
        sortable: true,
        width:    '120px',
      },
      {
        name:     'Entity',
        selector: (row) => row.entity,
        sortable: true,
        width:    '120px',
      },
      {
        name:  'Status',
        cell:  (row) => (
          <Badge colorPalette={getStatusColor(row.status)} fontSize="1.2rem" p={2}>
            {row.status}
          </Badge>
        ),
        sortable: true,
        width:    '150px',
      },
      {
        name:     'Disqualification reason',
        cell:     (row) => row.disqualificationReason ?? '-',
        sortable: true,
        width:    '200px',
      },
      {
        name:     'Created Date',
        selector: (row) => row.createdDate,
        sortable: true,
        width:    '120px',
      },
      {
        name:     'Created By',
        selector: (row) => row.createdBy,
        sortable: true,
        width:    '130px',
      },
      {
        name:  'Actions',
        cell:  (row) => (
          <CardActionMenu
            actions={[
              { label: 'View',   cta: () => handleView(row.id)   },
              { label: 'Edit',   cta: () => handleEdit(row.id)   },
              { label: 'Delete', cta: () => handleDelete(row.id) },
            ]}
          />
        ),
        width: '120px',
        right: true,
      },
    ],
    [handleView, handleEdit, handleDelete],
  );

  /* ─── Toolbar action buttons ─────────────────────────────────── */
  const actionButtons = useMemo(
    () => (
      <>
        <AppButton variant="outline" leftIcon={<Upload size={16} />} enableRipple buttonSize="md">
          Import file
        </AppButton>
        <AppButton
          variant="primary"
          leftIcon={<Plus size={16} />}
          enableRipple
          buttonSize="md"
          onClick={handleAddLead}
        >
          Add Lead
        </AppButton>
      </>
    ),
    [handleAddLead],
  );

  return (
    <Stack
      gap={0}
      bg="var(--surface-card)"
      p="2rem 2.5rem"
      borderRadius=".8rem"
      border="1px solid var(--surface-border)"
      overflow="hidden"
    >
      <ReusableDataTable
        title="Leads"
        data={filteredData}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search here..."
        paginationPerPage={10}
        hasFixedActionColumn
        noDataMessage="No leads found"
        actionButtons={actionButtons}
      />
    </Stack>
  );
}

export const LeadsList = memo(LeadsListBase);
export default LeadsList;
