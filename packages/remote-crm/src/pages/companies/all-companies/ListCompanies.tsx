import React, { useMemo, memo } from 'react';
import { Box, Badge } from '@chakra-ui/react';
import type { TableColumn } from 'react-data-table-component';
import ReusableDataTable from 'sharedUi/ReusableDataTable';
import CardActionMenu from 'sharedUi/CardActionMenu';
import type { Entity } from '../types';
import { getStatusColor } from '../constants';

interface Props {
  entities: Entity[];
  searchTerm: string;
  onSearchChange: (v: string) => void;
  onEntityClick: (id: string) => void;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
  actionButtons?: React.ReactNode;
}

export const ListCompanies = memo(function ListCompanies({
  entities,
  searchTerm,
  onSearchChange,
  onEntityClick,
  onEditClick,
  onDeleteClick,
  actionButtons,
}: Props) {
  const columns: TableColumn<Entity>[] = useMemo(
    () => [
      {
        name: 'Provider Name',
        sortable: true,
        minWidth: '200px',
        cell: (row) => (
          <Box cursor="pointer" onClick={() => onEntityClick(row.id)}>
            <Box fontWeight="600" color="var(--text-primary)" fontSize="1.4rem">
              {row.name}
            </Box>
            <Box color="var(--text-muted)" fontSize="1.2rem">
              {row.website}
            </Box>
          </Box>
        ),
      },
      {
        name: 'Contact Info',
        sortable: true,
        minWidth: '180px',
        cell: (row) => (
          <Box>
            <Box fontSize="1.4rem" color="var(--text-primary)">
              {row.email}
            </Box>
            <Box fontSize="1.2rem" color="var(--text-muted)">
              {row.phone}
            </Box>
          </Box>
        ),
      },
      {
        name: 'CAC',
        selector: (row) => row.cac,
        sortable: true,
        width: '110px',
        cell: (row) => (
          <Box fontSize="1.4rem" color="var(--text-primary)" fontWeight="500">
            {row.providerCode}
          </Box>
        ),
      },
      {
        name: 'Effective Date',
        selector: (row) => row.effectiveDate,
        sortable: true,
        width: '140px',
        cell: (row) => (
          <Box fontSize="1.4rem" color="var(--text-primary)">
            {row.effectiveDate}
          </Box>
        ),
      },
      {
        name: 'Status',
        selector: (row) => row.status,
        sortable: true,
        width: '110px',
        cell: (row) => (
          <Badge
            colorPalette={getStatusColor(row.status)}
            variant="subtle"
            fontSize="1.2rem"
            px={2}
            py={1}
            borderRadius="6px"
          >
            {row.status}
          </Badge>
        ),
      },
      {
        name: 'Actions',
        width: '120px',
        right: true,
        cell: (row) => (
          <CardActionMenu
            actions={[
              { label: 'View', cta: () => onEntityClick(row.id) },
              { label: 'Edit', cta: () => onEditClick(row.id) },
              { label: 'Delete', cta: () => onDeleteClick(row.id) },
            ]}
          />
        ),
      },
    ],
    [onEntityClick, onEditClick, onDeleteClick],
  );

  return (
    <ReusableDataTable
      title="Entities"
      data={entities}
      columns={columns}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search here..."
      paginationPerPage={10}
      hasFixedActionColumn
      noDataMessage="No entities found"
      actionButtons={actionButtons}
    />
  );
});

export default ListCompanies;
