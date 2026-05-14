import React, { useState, useMemo, useCallback, memo } from 'react';
import { Stack, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus } from 'lucide-react';
import type { TableColumn } from 'react-data-table-component';
import ReusableDataTable from 'sharedUi/ReusableDataTable';
import CardActionMenu from 'sharedUi/CardActionMenu';
import AppButton from 'sharedUi/AppButton';
import type { Provider } from '../../types';
import { mockProviders, filterProvidersData } from '../../mock';
import { getProviderStatusColor } from '../../constants';

function ProvidersListBase() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredData = useMemo(
    () => filterProvidersData(mockProviders, { search: searchTerm }),
    [searchTerm],
  );

  const handleView = useCallback(
    (id: string) => navigate(`/providers/provider-list/${id}`),
    [navigate],
  );
  const handleEdit = useCallback(
    (id: string) => navigate(`/providers/provider-list/edit/${id}`),
    [navigate],
  );
  const handleDelete = useCallback((_id: string) => {}, []);
  const handleAdd = useCallback(
    () => navigate('/providers/provider-list/add-provider'),
    [navigate],
  );

  const columns: TableColumn<Provider>[] = useMemo(
    () => [
      {
        name: 'Provider Name',
        selector: (row) => row.providerName,
        sortable: true,
        width: '150px',
      },
      {
        name: 'Provider Type',
        selector: (row) => row.providerType,
        sortable: true,
        width: '130px',
      },
      { name: 'Service Type', selector: (row) => row.serviceType, sortable: true, width: '120px' },
      {
        name: 'Master Provider Code',
        selector: (row) => row.masterProviderCode,
        sortable: true,
        width: '190px',
      },
      { name: 'Part of', selector: (row) => row.partOf, sortable: true, width: '120px' },
      {
        name: "Provider's Address",
        selector: (row) => row.providerAddress,
        sortable: true,
        width: '300px',
      },
      { name: 'City', selector: (row) => row.city, sortable: true, width: '100px' },
      { name: 'State', selector: (row) => row.state, sortable: true, width: '100px' },
      {
        name: 'Status',
        cell: (row) => (
          <Badge
            colorPalette={getProviderStatusColor(row.status)}
            fontSize="1.1rem"
            px="1rem"
            py="0.4rem"
          >
            {row.status}
          </Badge>
        ),
        sortable: true,
        width: '110px',
      },
      {
        name: 'Action',
        cell: (row) => (
          <CardActionMenu
            actions={[
              { label: 'View', cta: () => handleView(row.id) },
              { label: 'Edit', cta: () => handleEdit(row.id) },
              { label: 'Delete', cta: () => handleDelete(row.id) },
            ]}
          />
        ),
        width: '120px',
        center: true,
      },
    ],
    [handleView, handleEdit, handleDelete],
  );

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
          onClick={handleAdd}
        >
          Add Provider
        </AppButton>
      </>
    ),
    [handleAdd],
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
        title="Providers List"
        data={filteredData}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search here..."
        paginationPerPage={10}
        hasFixedActionColumn
        noDataMessage="No providers found"
        actionButtons={actionButtons}
      />
    </Stack>
  );
}

export const ProvidersList = memo(ProvidersListBase);
export default ProvidersList;
