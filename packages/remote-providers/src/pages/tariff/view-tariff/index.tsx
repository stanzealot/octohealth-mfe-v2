import React, { memo, useMemo, useState, useCallback } from 'react';
import { Box, Stack, Text, Flex, Grid } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, Copy } from 'lucide-react';
import type { TableColumn } from 'react-data-table-component';
import type { TariffService } from '../../../types';
import { getTariffById, getTariffServicesByTariffId } from '../../../mock';
import { TARIFF_PAGINATION_OPTIONS } from '../../../constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppBreadcrumb = React.lazy(() => import('sharedUi/AppBreadcrumb')) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BaseDataTable = React.lazy(() => import('sharedUi/BaseDataTable')) as any;

// ─── Inline search ───────────────────────────────────────────────────────────
function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search here..."
      style={{
        width: '32rem',
        padding: '0.8rem 1.2rem',
        border: '1px solid var(--surface-border)',
        borderRadius: '6px',
        fontSize: '1.4rem',
        fontFamily: 'Montserrat, sans-serif',
        background: 'var(--surface-card)',
        color: 'var(--text-primary)',
        outline: 'none',
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--brand-primary)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--surface-border)';
      }}
    />
  );
}

// ─── Detail field ─────────────────────────────────────────────────────────────
function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={1}>
      <Text fontSize="1.3rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
        {label}
      </Text>
      <Text
        fontSize="1.4rem"
        fontWeight="600"
        color="var(--text-primary)"
        fontFamily="Montserrat, sans-serif"
      >
        {value}
      </Text>
    </Stack>
  );
}

function ViewTariffBase() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const tariff = useMemo(() => getTariffById(id!), [id]);
  const services = useMemo(() => getTariffServicesByTariffId(id!), [id]);

  const filteredServices = useMemo(() => {
    if (!searchTerm) return services;
    const lower = searchTerm.toLowerCase();
    return services.filter((s) => s.serviceName.toLowerCase().includes(lower));
  }, [services, searchTerm]);

  const handleViewService = useCallback(
    (serviceId: string) => navigate(`/providers/tariff/${id}/service/${serviceId}`),
    [id, navigate],
  );

  const handleCopyService = useCallback((_serviceId: string) => {
    // TODO: copy service
  }, []);

  const columns: TableColumn<TariffService>[] = useMemo(
    () => [
      {
        name: 'Service Name',
        selector: (row) => row.serviceName,
        sortable: true,
        grow: 2,
      },
      {
        name: 'Action',
        cell: (row) => (
          <Flex gap="1.2rem" align="center">
            <Box
              as="button"
              type="button"
              cursor="pointer"
              onClick={() => handleViewService(row.id)}
              color="var(--text-muted)"
              bg="transparent"
              border="none"
              display="flex"
              alignItems="center"
              _hover={{ color: 'var(--brand-primary)' }}
              transition="color 0.15s"
            >
              <Eye size={20} />
            </Box>
            <Box
              as="button"
              type="button"
              cursor="pointer"
              onClick={() => handleCopyService(row.id)}
              color="var(--text-muted)"
              bg="transparent"
              border="none"
              display="flex"
              alignItems="center"
              _hover={{ color: 'var(--brand-primary)' }}
              transition="color 0.15s"
            >
              <Copy size={20} />
            </Box>
          </Flex>
        ),
        width: '120px',
        right: true,
      },
    ],
    [handleViewService, handleCopyService],
  );

  if (!tariff) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="1.8rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
          Tariff not found
        </Text>
      </Box>
    );
  }

  return (
    <Stack gap={6}>
      <AppBreadcrumb beforeText="Tariff list" afterText="View Tariff" link="/providers/tariff" />

      <Box
        bg="var(--surface-card)"
        borderRadius=".8rem"
        p="2.4rem"
        border="1px solid var(--surface-border)"
      >
        {/* Tariff Details */}
        <Stack gap={6}>
          <Text
            fontSize="1.8rem"
            fontWeight="600"
            color="var(--text-primary)"
            fontFamily="Montserrat, sans-serif"
          >
            Tariff Details
          </Text>

          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
            gap={6}
            p={6}
            bg="var(--table-header-bg)"
            borderRadius="8px"
            border="1px solid var(--surface-border)"
          >
            <DetailField label="Tariff Name" value={`${tariff.tariffName.toUpperCase()} TARIFF`} />
            <DetailField label="Effective Date" value={tariff.effectiveDate} />
            <DetailField label="Network" value={tariff.network ?? 'N/A'} />
            <DetailField label="Expiry Date" value={tariff.expiryDate} />
            <DetailField label="Discount" value={tariff.discount} />
            <DetailField label="Status" value={tariff.status} />
          </Grid>
        </Stack>

        {/* Tariff Items / Services */}
        <Stack gap={4} mt={8}>
          <Text
            fontSize="1.8rem"
            fontWeight="600"
            color="var(--text-primary)"
            fontFamily="Montserrat, sans-serif"
          >
            Tariff Items
          </Text>

          <Box maxW="32rem">
            <SearchBox value={searchTerm} onChange={setSearchTerm} />
          </Box>

          <BaseDataTable
            data={filteredServices}
            columns={columns}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={TARIFF_PAGINATION_OPTIONS}
            noDataMessage="No tariff items found"
            fixedHeader
            fixedHeaderScrollHeight="600px"
          />
        </Stack>
      </Box>
    </Stack>
  );
}

export const ViewTariff = memo(ViewTariffBase);
export default ViewTariff;
