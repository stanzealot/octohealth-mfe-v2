import React, { memo, useState, useMemo, useCallback } from 'react';
import { Stack, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import type { TableColumn } from 'react-data-table-component';
import type { Network } from '../../types';
import { mockNetworks, filterNetworksData } from '../../mock';
import { getProviderStatusColor } from '../../constants';
import AddNetworkModal from './AddNetworkModal';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppButton = React.lazy(() => import('sharedUi/AppButton')) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ReusableDataTable = React.lazy(() => import('sharedUi/ReusableDataTable')) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CardActionMenu = React.lazy(() => import('sharedUi/CardActionMenu')) as any;

function NetworkListBase() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);

  const filteredData = useMemo(
    () => filterNetworksData(mockNetworks, { search: searchTerm }),
    [searchTerm],
  );

  const handleView = useCallback((id: string) => navigate(`/providers/network/${id}`), [navigate]);

  const handleEdit = useCallback((network: Network) => {
    setSelectedNetwork(network);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((_id: string) => {
    // TODO: API call
  }, []);

  const handleAddNetwork = useCallback(() => {
    setSelectedNetwork(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNetwork(null);
  }, []);

  const handleSaveNetwork = useCallback(
    (_data: { networkName: string; description?: string }) => {
      // TODO: API call
      handleCloseModal();
    },
    [handleCloseModal],
  );

  const columns: TableColumn<Network>[] = useMemo(
    () => [
      {
        name: 'Network Name',
        selector: (row) => row.networkName,
        sortable: true,
      },
      {
        name: 'Last Updated',
        selector: (row) => row.lastUpdated,
        sortable: true,
      },
      {
        name: 'Status',
        cell: (row) => (
          <Badge colorPalette={getProviderStatusColor(row.status)} fontSize="1.2rem" px={3} py={1}>
            {row.status}
          </Badge>
        ),
        sortable: false,
      },
      {
        name: 'Action',
        cell: (row) => (
          <CardActionMenu
            actions={[
              { label: 'View', cta: () => handleView(row.id) },
              { label: 'Edit', cta: () => handleEdit(row) },
              { label: 'Delete', cta: () => handleDelete(row.id) },
            ]}
          />
        ),
        center: true,
        width: '120px',
      },
    ],
    [handleView, handleEdit, handleDelete],
  );

  return (
    <>
      <Stack
        gap={0}
        bg="var(--surface-card)"
        borderRadius=".8rem"
        border="1px solid var(--surface-border)"
        overflow="hidden"
      >
        <ReusableDataTable
          title="Network List"
          data={filteredData}
          columns={columns}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search here..."
          paginationPerPage={10}
          noDataMessage="No networks found"
          actionButtons={
            <AppButton variant="primary" onClick={handleAddNetwork}>
              + Add Network
            </AppButton>
          }
        />
      </Stack>

      <AddNetworkModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNetwork}
        network={selectedNetwork}
      />
    </>
  );
}

export const NetworkList = memo(NetworkListBase);
export default NetworkList;
