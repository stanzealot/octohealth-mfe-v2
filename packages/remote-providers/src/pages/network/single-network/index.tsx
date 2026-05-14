import React, { memo, useMemo } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import type { TableColumn } from 'react-data-table-component';
import type { NetworkProvider } from '../../../types';
import { getNetworkById, getProvidersByNetworkId } from '../../../mock';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppBreadcrumb = React.lazy(() => import('sharedUi/AppBreadcrumb')) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BaseDataTable = React.lazy(() => import('sharedUi/BaseDataTable')) as any;

function SingleNetworkBase() {
  const { id } = useParams<{ id: string }>();

  const network = useMemo(() => (id ? getNetworkById(id) : null), [id]);
  const providers = useMemo(() => (id ? getProvidersByNetworkId(id) : []), [id]);

  const columns: TableColumn<NetworkProvider>[] = useMemo(
    () => [
      {
        name: 'Provider Name',
        selector: (row) => row.providerName,
        sortable: true,
        width: '200px',
      },
      {
        name: 'Master Provider Code',
        selector: (row) => row.masterProviderCode,
        sortable: true,
        width: '200px',
      },
      {
        name: "Provider's Address",
        selector: (row) => row.providerAddress,
        sortable: true,
        grow: 2,
      },
      {
        name: 'City',
        selector: (row) => row.city,
        sortable: true,
        width: '150px',
      },
      {
        name: 'State',
        selector: (row) => row.state,
        sortable: true,
        width: '150px',
      },
    ],
    [],
  );

  if (!network) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="1.8rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
          Network not found
        </Text>
      </Box>
    );
  }

  return (
    <Stack gap={6}>
      <AppBreadcrumb beforeText="Network list" afterText="View Network" link="/providers/network" />

      <Box
        bg="var(--surface-card)"
        borderRadius=".8rem"
        p="2.4rem"
        border="1px solid var(--surface-border)"
      >
        <Text
          fontSize="2rem"
          fontWeight="600"
          color="var(--text-primary)"
          mb="2.4rem"
          fontFamily="Montserrat, sans-serif"
        >
          Providers under this Network
        </Text>

        <BaseDataTable
          data={providers}
          columns={columns}
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 50]}
          noDataMessage="No providers found in this network"
          fixedHeader
          fixedHeaderScrollHeight="600px"
        />
      </Box>
    </Stack>
  );
}

export const SingleNetwork = memo(SingleNetworkBase);
export default SingleNetwork;
