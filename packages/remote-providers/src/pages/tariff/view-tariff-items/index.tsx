import React, { memo, useMemo, useState, useCallback } from 'react';
import { Box, Stack, Text, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { Edit2, Trash2, Ban, Filter } from 'lucide-react';
import type { TableColumn } from 'react-data-table-component';
import type { TariffItem, EditTariffItemFormData } from '../../../types';
import { getTariffItemsByServiceId } from '../../../mock';
import { TARIFF_PAGINATION_OPTIONS } from '../../../constants';
import EditTariffItemModal from './EditTariffItemModal';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppBreadcrumb = React.lazy(() => import('sharedUi/AppBreadcrumb')) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppButton = React.lazy(() => import('sharedUi/AppButton')) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BaseDataTable = React.lazy(() => import('sharedUi/BaseDataTable')) as any;

// ─── Inline search ────────────────────────────────────────────────────────────
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

function ViewTariffItemsBase() {
  const { id, serviceId } = useParams<{ id: string; serviceId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TariffItem | null>(null);

  const items = useMemo(() => getTariffItemsByServiceId(serviceId!), [serviceId]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    const lower = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.itemCode.toLowerCase().includes(lower) ||
        item.itemDescription.toLowerCase().includes(lower) ||
        item.providerItemCode.toLowerCase().includes(lower) ||
        item.providerItemDescription.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower),
    );
  }, [items, searchTerm]);

  const handleEdit = useCallback((item: TariffItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  }, []);

  const handleDelete = useCallback((_itemId: string) => {
    // TODO: API call
  }, []);

  const handleDisable = useCallback((_itemId: string) => {
    // TODO: API call
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedItem(null);
  }, []);

  const handleSaveItem = useCallback(
    (_data: EditTariffItemFormData) => {
      handleCloseModal();
    },
    [handleCloseModal],
  );

  const columns: TableColumn<TariffItem>[] = useMemo(
    () => [
      {
        name: 'Category',
        selector: (row) => row.category,
        sortable: true,
        width: '150px',
      },
      {
        name: 'Item Code',
        selector: (row) => row.itemCode,
        sortable: true,
        width: '130px',
      },
      {
        name: 'Item Description',
        selector: (row) => row.itemDescription,
        sortable: true,
        width: '200px',
      },
      {
        name: "Provider's Item Code",
        selector: (row) => row.providerItemCode,
        sortable: true,
        width: '180px',
      },
      {
        name: "Provider's Item Description",
        selector: (row) => row.providerItemDescription,
        sortable: true,
        width: '220px',
      },
      {
        name: 'Claim Type',
        selector: (row) => row.claimType,
        sortable: true,
        width: '120px',
      },
      {
        name: "Provider's Amount",
        selector: (row) => row.providerAmount,
        sortable: true,
        width: '150px',
      },
      {
        name: 'Effective Date',
        selector: (row) => row.effectiveDate,
        sortable: true,
        width: '140px',
      },
      {
        name: 'Expiry Date',
        selector: (row) => row.expiryDate,
        sortable: true,
        width: '120px',
      },
      {
        name: 'Action',
        cell: (row) => (
          <Flex gap="1.2rem" align="center">
            <Box
              as="button"
              type="button"
              cursor="pointer"
              onClick={() => handleEdit(row)}
              color="var(--text-muted)"
              bg="transparent"
              border="none"
              display="flex"
              alignItems="center"
              _hover={{ color: 'var(--brand-primary)' }}
              transition="color 0.15s"
              title="Edit"
            >
              <Edit2 size={18} />
            </Box>
            <Box
              as="button"
              type="button"
              cursor="pointer"
              onClick={() => handleDelete(row.id)}
              color="var(--text-muted)"
              bg="transparent"
              border="none"
              display="flex"
              alignItems="center"
              _hover={{ color: 'var(--status-danger)' }}
              transition="color 0.15s"
              title="Delete"
            >
              <Trash2 size={18} />
            </Box>
            <Box
              as="button"
              type="button"
              cursor="pointer"
              onClick={() => handleDisable(row.id)}
              color="var(--text-muted)"
              bg="transparent"
              border="none"
              display="flex"
              alignItems="center"
              _hover={{ color: 'var(--status-warning)' }}
              transition="color 0.15s"
              title="Disable"
            >
              <Ban size={18} />
            </Box>
          </Flex>
        ),
        width: '130px',
        right: true,
      },
    ],
    [handleEdit, handleDelete, handleDisable],
  );

  return (
    <>
      <Stack gap={6}>
        <AppBreadcrumb
          beforeText="Tariff list"
          afterText="View Tariff Item"
          link={`/providers/tariff/${id}`}
        />

        <Box
          bg="var(--surface-card)"
          borderRadius=".8rem"
          p="2.4rem"
          border="1px solid var(--surface-border)"
        >
          {/* Header section */}
          <Stack gap={6}>
            <Text
              fontSize="1.8rem"
              fontWeight="600"
              color="var(--text-primary)"
              fontFamily="Montserrat, sans-serif"
            >
              Tariff Details
            </Text>

            <Box
              p={6}
              bg="var(--table-header-bg)"
              borderRadius="8px"
              border="1px solid var(--surface-border)"
            >
              <Stack gap={1}>
                <Text
                  fontSize="1.3rem"
                  color="var(--text-muted)"
                  fontFamily="Montserrat, sans-serif"
                >
                  Service
                </Text>
                <Text
                  fontSize="1.4rem"
                  fontWeight="600"
                  color="var(--text-primary)"
                  fontFamily="Montserrat, sans-serif"
                >
                  Physiotherapy &amp; Rehabilitation
                </Text>
              </Stack>
            </Box>
          </Stack>

          {/* Items table */}
          <Stack gap={4} mt={8}>
            <Text
              fontSize="1.8rem"
              fontWeight="600"
              color="var(--text-primary)"
              fontFamily="Montserrat, sans-serif"
            >
              Items
            </Text>

            <Flex gap={3} align="center" flexWrap="wrap">
              <SearchBox value={searchTerm} onChange={setSearchTerm} />
              <AppButton variant="outline" leftIcon={<Filter size={16} />} buttonSize="md">
                Filter
              </AppButton>
            </Flex>

            <BaseDataTable
              data={filteredItems}
              columns={columns}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={TARIFF_PAGINATION_OPTIONS}
              noDataMessage="No tariff items found"
              fixedHeader
              fixedHeaderScrollHeight="600px"
              hasFixedActionColumn
            />
          </Stack>
        </Box>
      </Stack>

      <EditTariffItemModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        item={selectedItem}
      />
    </>
  );
}

export const ViewTariffItems = memo(ViewTariffItemsBase);
export default ViewTariffItems;
