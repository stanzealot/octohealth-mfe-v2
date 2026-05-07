/**
 * CompaniesList — `/crm/companies`
 *
 * Matches the monolith's companies-entry.tsx:
 *  - Search + Filter + View toggle (grid ↔ list)
 *  - Import file + Add Entity buttons
 *  - Manual pagination (8 per page in grid, 10 in list)
 *  - Grid view: GridCard layout  |  List view: ReusableDataTable
 */

import React, { useState, useMemo, useCallback, memo } from 'react';
import { Stack, Flex, Box, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Upload, Plus, Filter, LayoutGrid, List } from 'lucide-react';
import AppButton from 'sharedUi/AppButton';
import GridCompanies from './all-companies/GridCompanies';
import ListCompanies from './all-companies/ListCompanies';
import { mockEntities, filterEntities } from './mock/entities';

type ViewType = 'grid' | 'list';

/* ─── Simple search input ─────────────────────────────────────────── */
const SearchBox = memo(function SearchBox({
  value,
  onChange,
  placeholder = 'Search here…',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Box
      as="input"
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
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
      css={{
        '&::placeholder': { color: 'var(--text-placeholder)' },
        '&:focus':         { borderColor: 'var(--brand-primary)', boxShadow: '0 0 0 3px rgba(12,101,37,0.08)' },
      }}
    />
  );
});

/* ─── Grid / List toggle ──────────────────────────────────────────── */
const ViewToggle = memo(function ViewToggle({
  view,
  onChange,
}: {
  view: ViewType;
  onChange: (v: ViewType) => void;
}) {
  return (
    <Flex
      border="1px solid var(--surface-border)"
      borderRadius="8px"
      overflow="hidden"
      h="4rem"
    >
      {(['grid', 'list'] as ViewType[]).map((v) => {
        const active = view === v;
        return (
          <Box
            key={v}
            as="button"
            px="1.2rem"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={active ? 'var(--brand-primary)' : 'var(--surface-card)'}
            color={active ? 'white' : 'var(--text-muted)'}
            border="none"
            cursor="pointer"
            transition="all 0.2s"
            _hover={active ? {} : { bg: 'var(--hover-bg)' }}
            onClick={() => onChange(v)}
          >
            {v === 'grid' ? <LayoutGrid size={16} /> : <List size={16} />}
          </Box>
        );
      })}
    </Flex>
  );
});

/* ─── Pagination bar ──────────────────────────────────────────────── */
const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPage,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPage: (p: number) => void;
}) {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end   = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <Flex
      justify="space-between"
      align="center"
      pt="1.6rem"
      borderTop="1px solid var(--surface-border)"
      flexDir={{ base: 'column', sm: 'row' }}
      gap="1.2rem"
    >
      <Text fontFamily="Montserrat, sans-serif" fontSize="1.3rem" color="var(--text-muted)">
        Showing {start}–{end} of {totalItems}
      </Text>
      <Flex gap="0.8rem" align="center">
        <Box
          as="button"
          px="1.2rem"
          h="3.2rem"
          borderRadius="6px"
          border="1px solid var(--surface-border)"
          bg="var(--surface-card)"
          fontSize="1.3rem"
          fontFamily="Montserrat, sans-serif"
          color={currentPage <= 1 ? 'var(--text-placeholder)' : 'var(--text-primary)'}
          cursor={currentPage <= 1 ? 'not-allowed' : 'pointer'}
          onClick={() => currentPage > 1 && onPage(currentPage - 1)}
          _hover={currentPage > 1 ? { bg: 'var(--hover-bg)' } : {}}
        >
          Previous
        </Box>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const pg = i + 1;
          return (
            <Box
              key={pg}
              as="button"
              w="3.2rem"
              h="3.2rem"
              borderRadius="6px"
              border="1px solid var(--surface-border)"
              bg={pg === currentPage ? 'var(--brand-primary)' : 'var(--surface-card)'}
              color={pg === currentPage ? 'white' : 'var(--text-primary)'}
              fontSize="1.3rem"
              fontFamily="Montserrat, sans-serif"
              cursor="pointer"
              onClick={() => onPage(pg)}
              _hover={pg !== currentPage ? { bg: 'var(--hover-bg)' } : {}}
            >
              {pg}
            </Box>
          );
        })}
        <Box
          as="button"
          px="1.2rem"
          h="3.2rem"
          borderRadius="6px"
          border="1px solid var(--surface-border)"
          bg="var(--surface-card)"
          fontSize="1.3rem"
          fontFamily="Montserrat, sans-serif"
          color={currentPage >= totalPages ? 'var(--text-placeholder)' : 'var(--text-primary)'}
          cursor={currentPage >= totalPages ? 'not-allowed' : 'pointer'}
          onClick={() => currentPage < totalPages && onPage(currentPage + 1)}
          _hover={currentPage < totalPages ? { bg: 'var(--hover-bg)' } : {}}
        >
          Next
        </Box>
      </Flex>
    </Flex>
  );
});

/* ─── Main page ───────────────────────────────────────────────────── */

function CompaniesListBase() {
  const navigate = useNavigate();
  const [searchTerm,  setSearchTerm]  = useState('');
  const [viewType,    setViewType]    = useState<ViewType>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = viewType === 'grid' ? 8 : 10;

  const filtered = useMemo(
    () => filterEntities(mockEntities, searchTerm),
    [searchTerm],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage, ITEMS_PER_PAGE]);

  // Reset to page 1 when search or view changes
  const handleSearch = useCallback((v: string) => {
    setSearchTerm(v);
    setCurrentPage(1);
  }, []);

  const handleViewChange = useCallback((v: ViewType) => {
    setViewType(v);
    setCurrentPage(1);
  }, []);

  const handleView   = useCallback((id: string) => navigate(`/crm/companies/${id}`),         [navigate]);
  const handleEdit   = useCallback((id: string) => navigate(`/crm/companies/edit/${id}`),    [navigate]);
  const handleDelete = useCallback((_id: string) => { /* TODO: implement */ }, []);
  const handleAdd    = useCallback(() => navigate('/crm/companies/add'), [navigate]);

  const actionButtons = useMemo(() => (
    <>
      <AppButton variant="gray-outline" leftIcon={<Filter size={16} />} buttonSize="md">
        Filter
      </AppButton>
      <ViewToggle view={viewType} onChange={handleViewChange} />
      <AppButton variant="outline" leftIcon={<Upload size={16} />} enableRipple buttonSize="md">
        Import file
      </AppButton>
      <AppButton variant="primary" leftIcon={<Plus size={16} />} enableRipple buttonSize="md" onClick={handleAdd}>
        Add Entity
      </AppButton>
    </>
  ), [viewType, handleViewChange, handleAdd]);

  return (
    <Stack
      gap="2.4rem"
      bg="var(--surface-card)"
      p="2rem 2.5rem"
      borderRadius=".8rem"
      border="1px solid var(--surface-border)"
    >
      {/* ── Heading ──────────────────────────────────────────── */}
      <Text
        fontFamily="Montserrat, sans-serif"
        fontSize="2rem"
        fontWeight="700"
        color="var(--text-primary)"
      >
        Entities
      </Text>

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <Flex
        flexDir={{ base: 'column', lg: 'row' }}
        justify="space-between"
        align={{ base: 'stretch', lg: 'center' }}
        gap="1.2rem"
      >
        <SearchBox value={searchTerm} onChange={handleSearch} />
        <Flex gap="1.2rem" align="center" flexWrap="wrap" justify={{ base: 'flex-end', lg: 'flex-start' }}>
          {actionButtons}
        </Flex>
      </Flex>

      {/* ── Content ──────────────────────────────────────────── */}
      {viewType === 'grid' ? (
        <GridCompanies
          entities={paginated}
          onEntityClick={handleView}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
        />
      ) : (
        <Box border="1px solid var(--surface-border)" borderRadius="8px" overflow="hidden">
          <ListCompanies
            entities={paginated}
            searchTerm=""
            onSearchChange={() => {}}
            onEntityClick={handleView}
            onEditClick={handleEdit}
            onDeleteClick={handleDelete}
          />
        </Box>
      )}

      {/* ── Pagination ───────────────────────────────────────── */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPage={setCurrentPage}
      />
    </Stack>
  );
}

export const CompaniesList = memo(CompaniesListBase);
export default CompaniesList;
