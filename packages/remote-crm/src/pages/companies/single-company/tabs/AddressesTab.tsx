import React, { useState, useMemo, useCallback, memo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Plus, Filter, Pencil, Trash2, X } from 'lucide-react';
import type { TableColumn } from 'react-data-table-component';
import AppButton from 'sharedUi/AppButton';
import AppInput from 'sharedUi/AppInput';
import AppSelect from 'sharedUi/AppSelect';
import BaseDataTable from 'sharedUi/BaseDataTable';
import { countryOptions, stateOptions, cityOptions } from '../../constants';

interface Address {
  id: string;
  street: string;
  townCity: string;
  country: string;
  state: string;
}

const INITIAL: Address[] = [
  {
    id: '1',
    street: 'No 123, Maple Street',
    townCity: 'Alimosho',
    country: 'Nigeria',
    state: 'Lagos',
  },
  {
    id: '2',
    street: 'No 123, Maple Street',
    townCity: 'Lagos',
    country: 'Nigeria',
    state: 'Lagos',
  },
];

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (a: Omit<Address, 'id'>) => void;
}

const BLANK = { address1: '', country: '', state: '', city: '' };

const AddAddressModal = memo(function AddAddressModal({ open, onClose, onAdd }: ModalProps) {
  const [rows, setRows] = useState([{ ...BLANK }]);

  const reset = () => setRows([{ ...BLANK }]);

  const handleDone = () => {
    rows.forEach((r) => {
      if (r.address1 && r.country && r.state && r.city) {
        onAdd({ street: r.address1, townCity: r.city, country: r.country, state: r.state });
      }
    });
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {}
      <Box position="absolute" inset={0} bg="rgba(0,0,0,0.5)" onClick={handleCancel} />

      {}
      <Box
        position="relative"
        bg="var(--surface-card)"
        borderRadius="12px"
        w={{ base: '92vw', md: '60rem' }}
        maxH="90vh"
        overflowY="auto"
        zIndex={1}
        boxShadow="0 20px 60px rgba(0,0,0,0.18)"
      >
        {}
        <Flex
          justify="space-between"
          align="center"
          px="2.4rem"
          py="2rem"
          borderBottom="1px solid var(--surface-border)"
        >
          <Text
            fontFamily="Montserrat, sans-serif"
            fontSize="1.8rem"
            fontWeight="600"
            color="var(--text-primary)"
          >
            Add New Address
          </Text>
          <Box
            as="button"
            border="none"
            bg="transparent"
            cursor="pointer"
            color="var(--text-muted)"
            onClick={handleCancel}
          >
            <X size={20} />
          </Box>
        </Flex>

        {}
        <Box px="2.4rem" py="2.4rem">
          <Box display="flex" flexDir="column" gap="1.6rem">
            {rows.map((row, i) => (
              <Box
                key={i}
                border="1px solid var(--surface-border)"
                borderRadius="8px"
                p="1.6rem"
                position="relative"
              >
                {rows.length > 1 && (
                  <Box
                    as="button"
                    position="absolute"
                    top="1.2rem"
                    right="1.2rem"
                    border="none"
                    bg="transparent"
                    cursor="pointer"
                    color="var(--status-danger)"
                    onClick={() => setRows(rows.filter((_, j) => j !== i))}
                  >
                    <X size={16} />
                  </Box>
                )}
                <Box mb="1.2rem">
                  <AppInput
                    label="Address 1"
                    placeholder="Add Address"
                    value={row.address1}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const next = [...rows];
                      next[i] = { ...next[i], address1: e.target.value };
                      setRows(next);
                    }}
                  />
                </Box>
                <Flex gap="1.2rem" flexDir={{ base: 'column', md: 'row' }}>
                  <AppSelect
                    options={countryOptions}
                    placeholder="Select"
                    label="Country *"
                    value={countryOptions.find((o) => o.value === row.country) ?? null}
                    onChange={(opt) => {
                      const next = [...rows];
                      next[i] = {
                        ...next[i],
                        country: (opt as { value: string } | null)?.value ?? '',
                      };
                      setRows(next);
                    }}
                    height="4.8rem"
                  />
                  <AppSelect
                    options={stateOptions}
                    placeholder="Select"
                    label="State *"
                    value={stateOptions.find((o) => o.value === row.state) ?? null}
                    onChange={(opt) => {
                      const next = [...rows];
                      next[i] = {
                        ...next[i],
                        state: (opt as { value: string } | null)?.value ?? '',
                      };
                      setRows(next);
                    }}
                    height="4.8rem"
                  />
                  <AppSelect
                    options={cityOptions}
                    placeholder="Select"
                    label="City *"
                    value={cityOptions.find((o) => o.value === row.city) ?? null}
                    onChange={(opt) => {
                      const next = [...rows];
                      next[i] = {
                        ...next[i],
                        city: (opt as { value: string } | null)?.value ?? '',
                      };
                      setRows(next);
                    }}
                    height="4.8rem"
                  />
                </Flex>
              </Box>
            ))}
          </Box>

          <Flex justify="flex-end" mt="1.6rem">
            <AppButton
              variant="ghost"
              leftIcon={<Plus size={16} />}
              buttonSize="md"
              onClick={() => setRows([...rows, { ...BLANK }])}
            >
              Add Another
            </AppButton>
          </Flex>
        </Box>

        {}
        <Flex
          px="2.4rem"
          py="2rem"
          borderTop="1px solid var(--surface-border)"
          justify="flex-end"
          gap="1.2rem"
        >
          <AppButton variant="outline" onClick={handleCancel}>
            Cancel
          </AppButton>
          <AppButton variant="primary" onClick={handleDone}>
            Done
          </AppButton>
        </Flex>
      </Box>
    </Box>
  );
});

export const AddressesTab = memo(function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!searchTerm) return addresses;
    const q = searchTerm.toLowerCase();
    return addresses.filter(
      (a) =>
        a.street.toLowerCase().includes(q) ||
        a.city?.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q),
    );
  }, [addresses, searchTerm]);

  const handleAdd = useCallback((a: Omit<Address, 'id'>) => {
    setAddresses((prev) => [...prev, { ...a, id: Date.now().toString() }]);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const columns: TableColumn<Address>[] = useMemo(
    () => [
      { name: 'Street', selector: (r) => r.street, sortable: true, minWidth: '200px' },
      { name: 'Town/City', selector: (r) => r.townCity, sortable: true, width: '150px' },
      { name: 'Country', selector: (r) => r.country, sortable: true, width: '150px' },
      { name: 'State', selector: (r) => r.state, sortable: true, width: '120px' },
      {
        name: 'Action',
        width: '100px',
        cell: (row) => (
          <Flex gap="0.8rem" align="center" justify="center">
            <Box
              as="button"
              border="none"
              bg="transparent"
              cursor="pointer"
              color="var(--text-muted)"
              transition="color 0.15s"
              _hover={{ color: 'var(--brand-primary)' }}
            >
              <Pencil size={16} />
            </Box>
            <Box
              as="button"
              border="none"
              bg="transparent"
              cursor="pointer"
              color="var(--text-muted)"
              transition="color 0.15s"
              _hover={{ color: 'var(--status-danger)' }}
              onClick={() => handleDelete(row.id)}
            >
              <Trash2 size={16} />
            </Box>
          </Flex>
        ),
      },
    ],
    [handleDelete],
  );

  return (
    <Box>
      <Flex
        mb="1.6rem"
        justify="space-between"
        align={{ base: 'stretch', md: 'center' }}
        flexDir={{ base: 'column', md: 'row' }}
        gap="1.2rem"
      >
        <Box
          as="input"
          type="text"
          placeholder="Search here…"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          w={{ base: '100%', md: '32rem' }}
          h="4rem"
          px="1.2rem"
          border="1px solid var(--surface-border)"
          borderRadius="8px"
          fontSize="1.4rem"
          fontFamily="Montserrat, sans-serif"
          bg="var(--surface-card)"
          color="var(--text-primary)"
          outline="none"
          css={{ '&:focus': { borderColor: 'var(--brand-primary)' } }}
        />
        <Flex gap="1.2rem">
          <AppButton variant="gray-outline" leftIcon={<Filter size={16} />} buttonSize="md">
            Filter
          </AppButton>
          <AppButton
            variant="primary"
            leftIcon={<Plus size={16} />}
            buttonSize="md"
            onClick={() => setModalOpen(true)}
          >
            Add Address
          </AppButton>
        </Flex>
      </Flex>

      <Box border="1px solid var(--surface-border)" borderRadius="12px" overflow="hidden">
        <BaseDataTable columns={columns} data={filtered} highlightOnHover responsive />
      </Box>

      <AddAddressModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
    </Box>
  );
});

export default AddressesTab;
