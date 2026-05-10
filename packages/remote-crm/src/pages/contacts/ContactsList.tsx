import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { Box, Flex, Text } from '@chakra-ui/react';
import type { TableColumn } from 'react-data-table-component';
import ReusableDataTable from 'sharedUi/ReusableDataTable';
import { AdvancedButton } from 'sharedUi/AppButton';
import CardActionMenu from 'sharedUi/CardActionMenu';
import { GridCard, GridCardList } from 'sharedUi/GridCard';
import AnimatedModal from 'sharedUi/AnimatedModal';
import ConfirmDeleteModal from 'sharedUi/ConfirmDeleteModal';
import AppInput from 'sharedUi/AppInput';
import { AppSelect as CustomSelect } from 'sharedUi/AppSelect';
import AppPagination from 'sharedUi/AppPagination';
import { filterContacts, type Contact } from '../../mock/contacts';
import { toast } from 'react-toastify';
import {
  GRID_PAGE_SIZE_OPTIONS,
  DEFAULT_GRID_PAGE_SIZE,
  ADD_CONTACT_PREFIX_OPTIONS,
  ADD_CONTACT_GENDER_OPTIONS,
} from './constants';
import { calculateAge, StatusBadge, ContactAvatar } from './utils/contact-helpers';

export default function ContactsList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    prefix: 'Mr.',
    gender: 'Male',
    email: '',
    phone: '',
  });

  const [gridPage, setGridPage] = useState(1);
  const [gridRowsPerPage, setGridRowsPerPage] = useState(DEFAULT_GRID_PAGE_SIZE);

  const filtered = useMemo(() => filterContacts(search), [search]);

  const activeCount = useMemo(
    () => filtered.filter((c) => c.contactStatus === 'Active').length,
    [filtered],
  );
  const inactiveCount = useMemo(
    () => filtered.filter((c) => c.contactStatus === 'Inactive').length,
    [filtered],
  );

  const gridSlice = useMemo(() => {
    const start = (gridPage - 1) * gridRowsPerPage;
    return filtered.slice(start, start + gridRowsPerPage);
  }, [filtered, gridPage, gridRowsPerPage]);

  useEffect(() => {
    setGridPage(1);
  }, [search]);

  const handleGridPageChange = useCallback((p: number) => setGridPage(p), []);
  const handleGridRowsPerPageChange = useCallback((size: number) => {
    setGridRowsPerPage(size);
    setGridPage(1);
  }, []);

  const columns: TableColumn<Contact>[] = useMemo(
    () => [
      {
        name: 'Full Name',
        cell: (row) => (
          <Flex
            align="center"
            gap="1rem"
            cursor="pointer"
            onClick={() => navigate(`/crm/contacts/${row.id}`)}
          >
            <ContactAvatar firstName={row.firstName} lastName={row.lastName} />
            <Text fontFamily="Montserrat, sans-serif" color="var(--text-primary)">
              {`${row.firstName} ${row.lastName}`}
            </Text>
          </Flex>
        ),
        minWidth: '20rem',
        sortable: true,
      },
      {
        name: 'Title',
        selector: (r) => r.prefix || '-',
        sortable: true,
        width: '9rem',
      },
      {
        name: 'Gender',
        selector: (r) => r.gender || '-',
        sortable: true,
        width: '10rem',
      },
      {
        name: 'Reg. Number',
        selector: (r) => r.membership?.regNumber || '-',
        sortable: true,
        width: '13rem',
      },
      {
        name: 'Status',
        cell: (r) => <StatusBadge status={r.contactStatus} />,
        width: '11rem',
      },
      {
        name: 'Actions',
        cell: (row) => (
          <CardActionMenu
            actions={[
              { label: 'View', cta: () => navigate(`/crm/contacts/${row.id}`) },
              {
                label: 'Edit',
                cta: () => navigate(`/crm/contacts/${row.id}/edit`),
              },
              {
                label: 'Delete',
                cta: () => setDeleteTarget(row),
              },
            ]}
          />
        ),
        width: '13rem',
        right: true,
      },
    ],
    [navigate],
  );

  return (
    <Box
      bg="var(--surface-card)"
      p={{ base: '1.4rem', md: '2rem 2.5rem' }}
      borderRadius="1.2rem"
      border="1px solid var(--surface-border)"
      boxShadow="var(--shadow-card)"
    >
      <Text
        fontSize="1.8rem"
        fontWeight={700}
        color="var(--text-primary)"
        mb="2rem"
        fontFamily="Montserrat, sans-serif"
      >
        Contacts
      </Text>

      {}
      <Flex
        flexDir={{ base: 'column', md: 'row' }}
        align={{ base: 'stretch', md: 'center' }}
        justify="space-between"
        gap="1.2rem"
        mb="1.6rem"
      >
        {}
        <Flex align="center" gap="1rem" flexWrap="wrap">
          {}
          <Box position="relative" flex={{ base: 1, md: 'none' }} minW={0}>
            <Box
              position="absolute"
              left="1.2rem"
              top="50%"
              transform="translateY(-50%)"
              color="var(--text-placeholder)"
              display="flex"
              pointerEvents="none"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </Box>
            <input
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Search here..."
              style={{
                height: '4rem',
                paddingLeft: '3.6rem',
                paddingRight: '1.2rem',
                border: '1px solid var(--surface-border)',
                borderRadius: '0.8rem',
                fontSize: '1.4rem',
                fontFamily: 'Montserrat, sans-serif',
                outline: 'none',
                width: '100%',
                minWidth: '0',
                color: 'var(--text-primary)',
                background: 'var(--surface-bg)',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                e.target.style.borderColor = 'var(--brand-primary)';
              }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                e.target.style.borderColor = 'var(--surface-border)';
              }}
            />
          </Box>
          <AdvancedButton
            variant="outline"
            leftIcon={<SlidersHorizontal size={15} />}
            onClick={() => toast.info('Filter — coming soon')}
          >
            Filter
          </AdvancedButton>
        </Flex>

        {}
        <Flex
          align="center"
          gap="1rem"
          flexWrap="wrap"
          justify={{ base: 'flex-end', md: 'flex-start' }}
        >
          {}
          <Flex border="1px solid var(--surface-border)" borderRadius="0.8rem" overflow="hidden">
            {(['grid', 'list'] as const).map((v) => (
              <Box
                key={v}
                as="button"
                h="4rem"
                px="1.2rem"
                border="none"
                cursor="pointer"
                display="flex"
                alignItems="center"
                gap="0.4rem"
                bg={viewType === v ? 'var(--brand-primary-light)' : 'var(--surface-card)'}
                color={viewType === v ? 'var(--brand-primary)' : 'var(--text-muted)'}
                fontSize="1.3rem"
                fontFamily="Montserrat, sans-serif"
                fontWeight={viewType === v ? 600 : 400}
                onClick={() => setViewType(v)}
                transition="all 0.15s"
              >
                {v === 'grid' ? <LayoutGrid size={15} /> : <List size={15} />}
              </Box>
            ))}
          </Flex>

          <AdvancedButton
            variant="outline"
            onClick={() => toast.info('Merge contacts — coming soon')}
          >
            Merge Contacts
          </AdvancedButton>
          <AdvancedButton
            variant="outline"
            leftIcon={<Upload size={15} />}
            onClick={() => toast.info('Import — coming soon')}
            enableRipple={true}
          >
            Import file
          </AdvancedButton>
          <AdvancedButton
            leftIcon={<Plus size={16} />}
            onClick={() => navigate('/crm/contacts/new')}
          >
            Add Contact
          </AdvancedButton>
        </Flex>
      </Flex>

      {}
      <Flex justify="space-between" align="center" mb="1.6rem" flexWrap="wrap" gap="1rem">
        <Flex gap="1rem">
          <Flex
            align="center"
            px="0.8rem"
            h="3rem"
            bg="rgba(18,183,106,0.12)"
            borderRadius="0.5rem"
          >
            <Text
              fontSize="1.3rem"
              color="var(--status-success)"
              fontWeight={500}
              fontFamily="Montserrat, sans-serif"
            >
              Active
            </Text>
          </Flex>
          <Flex align="center" px="0.8rem" h="3rem" bg="rgba(240,68,56,0.12)" borderRadius="0.5rem">
            <Text
              fontSize="1.3rem"
              color="var(--status-danger)"
              fontWeight={500}
              fontFamily="Montserrat, sans-serif"
            >
              Inactive
            </Text>
          </Flex>
        </Flex>
        <Text fontSize="1.4rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
          Total contacts:{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> Active:{' '}
          <strong style={{ color: 'var(--status-success)' }}>{activeCount}</strong> Inactive:{' '}
          <strong style={{ color: 'var(--status-danger)' }}>{inactiveCount}</strong>
        </Text>
      </Flex>

      {}
      {viewType === 'grid' && (
        <Box border="1px solid var(--surface-border)" borderRadius="1rem" overflow="hidden">
          {filtered.length === 0 ? (
            <Flex align="center" justify="center" minH="20rem">
              <Text color="var(--text-muted)" fontSize="1.4rem" fontFamily="Montserrat, sans-serif">
                No contacts found
              </Text>
            </Flex>
          ) : (
            <Box p="2rem">
              <GridCardList>
                {gridSlice.map((c) => (
                  <GridCard
                    key={c.id}
                    id={c.id}
                    title={`${c.prefix ? c.prefix + ' ' : ''}${c.firstName} ${c.lastName}`}
                    status={c.contactStatus}
                    avatar={{ name: `${c.firstName} ${c.lastName}` }}
                    details={[
                      { label: 'Gender', value: c.gender || '-' },
                      { label: 'Age', value: calculateAge(c.dateOfBirth) },
                      {
                        label: 'Reg. Date',
                        value: new Date(c.createdAt).toLocaleDateString(),
                      },
                      {
                        label: 'Reg. Num',
                        value: c.membership?.regNumber || '-',
                      },
                    ]}
                    onCardClick={(id: string) => navigate(`/crm/contacts/${id}`)}
                    actions={[
                      { label: 'View', cta: () => navigate(`/crm/contacts/${c.id}`) },
                      {
                        label: 'Edit',
                        cta: () => navigate(`/crm/contacts/${c.id}/edit`),
                      },
                      {
                        label: 'Request Service',
                        cta: () => toast.info('Request service — coming soon'),
                      },
                      {
                        label: 'Delete',
                        cta: () => setDeleteTarget(c),
                        allowPopover: true,
                        confirmationText: `Delete ${c.firstName} ${c.lastName}?`,
                      },
                    ]}
                  />
                ))}
              </GridCardList>
            </Box>
          )}

          {}
          <AppPagination
            totalRows={filtered.length}
            currentPage={gridPage}
            rowsPerPage={gridRowsPerPage}
            rowsPerPageOptions={GRID_PAGE_SIZE_OPTIONS}
            onPageChange={handleGridPageChange}
            onRowsPerPageChange={handleGridRowsPerPageChange}
          />
        </Box>
      )}

      {}
      {viewType === 'list' && (
        <ReusableDataTable
          data={filtered}
          columns={columns}
          showSearch={false}
          showFilter={false}
          showActions={false}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
          hasFixedActionColumn={false}
          noDataMessage="No contacts found"
        />
      )}

      {}
      <AnimatedModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Contact"
        size="md"
      >
        <Box display="grid" gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="1.6rem">
          <CustomSelect
            label="Title"
            required
            value={form.prefix}
            onChange={(v: string) => setForm((p) => ({ ...p, prefix: v }))}
            options={ADD_CONTACT_PREFIX_OPTIONS.map((o) => ({
              label: o,
              value: o,
            }))}
          />
          <CustomSelect
            label="Gender"
            required
            value={form.gender}
            onChange={(v: string) => setForm((p) => ({ ...p, gender: v }))}
            options={ADD_CONTACT_GENDER_OPTIONS.map((o) => ({
              label: o,
              value: o,
            }))}
          />
          <AppInput
            label="First Name"
            required
            placeholder="Enter first name"
            value={form.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((p) => ({ ...p, firstName: e.target.value }))
            }
          />
          <AppInput
            label="Last Name"
            required
            placeholder="Enter last name"
            value={form.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((p) => ({ ...p, lastName: e.target.value }))
            }
          />
          <AppInput
            label="Email"
            required
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((p) => ({ ...p, email: e.target.value }))
            }
            style={{ gridColumn: '1 / -1' }}
          />
          <AppInput
            label="Phone"
            required
            placeholder="+234..."
            value={form.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setForm((p) => ({ ...p, phone: e.target.value }))
            }
            style={{ gridColumn: '1 / -1' }}
          />
        </Box>
        <Flex gap="1.2rem" justify="flex-end" mt="2.4rem">
          <AdvancedButton variant="gray-outline" onClick={() => setAddOpen(false)}>
            Cancel
          </AdvancedButton>
          <AdvancedButton
            onClick={() => {
              if (!form.firstName || !form.lastName) {
                toast.error('First and last name are required');
                return;
              }
              toast.success(`Contact ${form.firstName} ${form.lastName} added! (mock)`);
              setAddOpen(false);
              setForm({
                firstName: '',
                lastName: '',
                prefix: 'Mr.',
                gender: 'Male',
                email: '',
                phone: '',
              });
            }}
          >
            Add Contact
          </AdvancedButton>
        </Flex>
      </AnimatedModal>

      {}
      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          toast.success(`${deleteTarget?.firstName} deleted (mock)`);
          setDeleteTarget(null);
        }}
        title={`Delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}?`}
        description="This will permanently remove this contact and all associated data."
      />
    </Box>
  );
}
