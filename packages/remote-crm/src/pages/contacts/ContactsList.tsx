import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { Box, Flex, Text } from '@chakra-ui/react';
import type { TableColumn } from 'react-data-table-component';
import ReusableDataTable from 'sharedUi/ReusableDataTable';
import { AdvancedButton } from 'sharedUi/AppButton';
import SharedActionMenu from 'sharedUi/ActionMenu';
import { GridCard, GridCardList } from 'sharedUi/GridCard';
import AnimatedModal from 'sharedUi/AnimatedModal';
import ConfirmDeleteModal from 'sharedUi/ConfirmDeleteModal';
import AppInput from 'sharedUi/AppInput';
import CustomSelect from 'sharedUi/CustomSelect';
import { filterContacts, type Contact } from '../../mock/contacts';
import { toast } from 'react-toastify';

/* ─── Helpers ────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: Contact['contactStatus'] }) {
  const map: Record<string, { bg: string; color: string }> = {
    Active:    { bg: '#E0FAEC', color: '#12B76A' },
    Inactive:  { bg: '#F2F5F8', color: '#475467' },
    Suspended: { bg: '#FFEBEC', color: '#B42318' },
  };
  const s = map[status] ?? map.Inactive;
  return (
    <span style={{ display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '2rem', fontSize: '1.2rem', fontWeight: 500, background: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function ContactAvatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  return (
    <Flex align="center" justify="center" w="4rem" h="4rem" borderRadius="50%" bg="#E0FAEC" color="#0C6525" fontWeight={700} fontSize="1.3rem" flexShrink={0} fontFamily="Montserrat, sans-serif">
      {firstName[0]}{lastName[0]}
    </Flex>
  );
}

function calculateAge(dob: string | undefined): string {
  if (!dob) return '-';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return String(age);
}

/* ─── Component ──────────────────────────────────────────────── */
export default function ContactsList() {
  const navigate  = useNavigate();
  const [search,       setSearch]       = useState('');
  const [viewType,     setViewType]     = useState<'grid' | 'list'>('grid');
  const [addOpen,      setAddOpen]      = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', prefix: 'Mr.', gender: 'Male', email: '', phone: '' });

  const filtered      = filterContacts(search);
  const activeCount   = filtered.filter((c) => c.contactStatus === 'Active').length;
  const inactiveCount = filtered.filter((c) => c.contactStatus === 'Inactive').length;

  /* Table columns */
  const columns: TableColumn<Contact>[] = [
    {
      name: 'Full Name',
      cell: (row) => (
        <Flex align="center" gap="1rem" cursor="pointer" onClick={() => navigate(row.id)}>
          <ContactAvatar firstName={row.firstName} lastName={row.lastName} />
          <Text fontFamily="Montserrat, sans-serif">{`${row.firstName} ${row.lastName}`}</Text>
        </Flex>
      ),
      minWidth: '20rem',
      sortable: true,
    },
    { name: 'Title',       selector: (r) => r.prefix || '-',                sortable: true, width: '9rem' },
    { name: 'Gender',      selector: (r) => r.gender || '-',                sortable: true, width: '10rem' },
    { name: 'Reg. Number', selector: (r) => r.membership?.regNumber || '-', sortable: true, width: '13rem' },
    { name: 'Status',      cell: (r) => <StatusBadge status={r.contactStatus} />,            width: '11rem' },
    {
      name: 'Actions',
      cell: (row) => (
        <SharedActionMenu
          actions={[
            { label: 'View',   cta: () => navigate(row.id) },
            { label: 'Edit',   cta: () => toast.info(`Edit ${row.firstName} — coming soon`) },
            { label: 'Delete', cta: () => setDeleteTarget(row), allowPopover: true, confirmationText: `Delete ${row.firstName} ${row.lastName}? This cannot be undone.` },
          ]}
        />
      ),
      width: '13rem',
      right: true,
    },
  ];

  return (
    <Box bg="white" p="2rem 2.5rem" borderRadius="0.8rem" border="1px solid #EAECF0">
      <Text fontSize="1.8rem" fontWeight={700} color="#1D2939" mb="2rem" fontFamily="Montserrat, sans-serif">
        Contacts
      </Text>

      {/* Toolbar */}
      <Flex flexWrap="wrap" justify="space-between" align="center" gap="1.2rem" mb="1.6rem">
        <Flex align="center" gap="1rem">
          <Box position="relative">
            <Box position="absolute" left="1.2rem" top="50%" transform="translateY(-50%)" color="#98A2B3" display="flex" pointerEvents="none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </Box>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search here..."
              style={{ height: '4rem', paddingLeft: '3.6rem', paddingRight: '1.2rem', border: '1px solid #D0D5DD', borderRadius: '0.8rem', fontSize: '1.4rem', fontFamily: 'Montserrat, sans-serif', outline: 'none', width: '26rem', color: '#1D2939' }}
            />
          </Box>
          <AdvancedButton variant="gray-outline" leftIcon={<SlidersHorizontal size={15} />} onClick={() => toast.info('Filter — coming soon')}>
            Filter
          </AdvancedButton>
        </Flex>

        <Flex align="center" gap="1rem">
          {/* Grid/List toggle */}
          <Flex border="1px solid #D0D5DD" borderRadius="0.8rem" overflow="hidden">
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
                bg={viewType === v ? '#F0F9F5' : '#fff'}
                color={viewType === v ? '#0C6525' : '#667085'}
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

          <AdvancedButton variant="gray-outline" onClick={() => toast.info('Merge contacts — coming soon')}>
            Merge Contacts
          </AdvancedButton>
          <AdvancedButton variant="gray-outline" leftIcon={<Upload size={15} />} onClick={() => toast.info('Import — coming soon')}>
            Import file
          </AdvancedButton>
          <AdvancedButton leftIcon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
            Add Contacts
          </AdvancedButton>
        </Flex>
      </Flex>

      {/* Status summary */}
      <Flex justify="space-between" align="center" mb="1.6rem" flexWrap="wrap" gap="1rem">
        <Flex gap="1rem">
          <Flex align="center" px="0.8rem" h="3rem" bg="#E0FAEC" borderRadius="0.5rem">
            <Text fontSize="1.3rem" color="#12B76A" fontWeight={500} fontFamily="Montserrat, sans-serif">Active</Text>
          </Flex>
          <Flex align="center" px="0.8rem" h="3rem" bg="#FFEBEC" borderRadius="0.5rem">
            <Text fontSize="1.3rem" color="#B42318" fontWeight={500} fontFamily="Montserrat, sans-serif">Inactive</Text>
          </Flex>
        </Flex>
        <Text fontSize="1.4rem" color="#A3AED0" fontFamily="Montserrat, sans-serif">
          Total contacts: <strong style={{ color: '#1B2559' }}>{filtered.length}</strong>{' '}
          Active: <strong style={{ color: '#1B2559' }}>{activeCount}</strong>{' '}
          Inactive: <strong style={{ color: '#1B2559' }}>{inactiveCount}</strong>
        </Text>
      </Flex>

      {/* Grid view */}
      {viewType === 'grid' && (
        <GridCardList>
          {filtered.map((c) => (
            <GridCard
              key={c.id}
              id={c.id}
              title={`${c.prefix ? c.prefix + ' ' : ''}${c.firstName} ${c.lastName}`}
              status={c.contactStatus}
              avatar={{ name: `${c.firstName} ${c.lastName}` }}
              details={[
                { label: 'Gender',    value: c.gender || '-' },
                { label: 'Age',       value: calculateAge(c.dateOfBirth) },
                { label: 'Reg. Date', value: new Date(c.createdAt).toLocaleDateString() },
                { label: 'Reg. Num',  value: c.membership?.regNumber || '-' },
              ]}
              onCardClick={(id) => navigate(id)}
              actions={[
                { label: 'View',            cta: () => navigate(c.id) },
                { label: 'Edit',            cta: () => toast.info(`Edit ${c.firstName} — coming soon`) },
                { label: 'Request Service', cta: () => toast.info('Request service — coming soon') },
                { label: 'Delete',          cta: () => setDeleteTarget(c), allowPopover: true, confirmationText: `Delete ${c.firstName} ${c.lastName}?` },
              ]}
            />
          ))}
        </GridCardList>
      )}

      {/* List view */}
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
          hasFixedActionColumn
        />
      )}

      {/* Add Contact modal */}
      <AnimatedModal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Contact" size="md">
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap="1.6rem">
          <CustomSelect label="Title" required value={form.prefix}
            onChange={(v) => setForm((p) => ({ ...p, prefix: v }))}
            options={['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'].map((o) => ({ label: o, value: o }))} />
          <CustomSelect label="Gender" required value={form.gender}
            onChange={(v) => setForm((p) => ({ ...p, gender: v }))}
            options={['Male', 'Female'].map((o) => ({ label: o, value: o }))} />
          <AppInput label="First Name" required placeholder="Enter first name" value={form.firstName}
            onChange={(e) => setForm((p) => ({ ...p, firstName: (e.target as HTMLInputElement).value }))} />
          <AppInput label="Last Name" required placeholder="Enter last name" value={form.lastName}
            onChange={(e) => setForm((p) => ({ ...p, lastName: (e.target as HTMLInputElement).value }))} />
          <AppInput label="Email" required type="email" placeholder="Enter email" value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: (e.target as HTMLInputElement).value }))}
            style={{ gridColumn: '1 / -1' }} />
          <AppInput label="Phone" required placeholder="+234..." value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: (e.target as HTMLInputElement).value }))}
            style={{ gridColumn: '1 / -1' }} />
        </Box>
        <Flex gap="1.2rem" justify="flex-end" mt="2.4rem">
          <AdvancedButton variant="gray-outline" onClick={() => setAddOpen(false)}>Cancel</AdvancedButton>
          <AdvancedButton onClick={() => {
            if (!form.firstName || !form.lastName) { toast.error('First and last name are required'); return; }
            toast.success(`Contact ${form.firstName} ${form.lastName} added! (mock)`);
            setAddOpen(false);
            setForm({ firstName: '', lastName: '', prefix: 'Mr.', gender: 'Male', email: '', phone: '' });
          }}>
            Add Contact
          </AdvancedButton>
        </Flex>
      </AnimatedModal>

      <ConfirmDeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { toast.success(`${deleteTarget?.firstName} deleted (mock)`); setDeleteTarget(null); }}
        title={`Delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}?`}
        description="This will permanently remove this contact and all associated data."
      />
    </Box>
  );
}
