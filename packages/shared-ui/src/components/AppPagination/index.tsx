import React, { memo, useCallback, useMemo } from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────────── */
export interface AppPaginationProps {
  /** Total number of items (unsliced) */
  totalRows: number;
  /** Currently active page (1-indexed) */
  currentPage: number;
  /** How many rows are shown per page */
  rowsPerPage: number;
  /** Options shown in the "per page" selector */
  rowsPerPageOptions?: number[];
  /** Called when the user clicks a page button */
  onPageChange: (page: number) => void;
  /** Called when the user picks a new page-size */
  onRowsPerPageChange: (size: number) => void;
  /** Label shown before the per-page selector  */
  rowsPerPageLabel?: string;
}

/* ─── NavButton ─────────────────────────────────────────────────── */
const NavButton = memo(function NavButton({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      as="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="3.2rem"
      h="3.2rem"
      borderRadius="6px"
      border="none"
      bg="transparent"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      color={disabled ? 'var(--text-placeholder)' : 'var(--text-secondary)'}
      opacity={disabled ? 0.45 : 1}
      transition="background 0.15s, color 0.15s"
      style={{
        /* can't use _hover on Box-as-button without Chakra v3 factory — inline style pseudo workaround */
      }}
      _hover={!disabled ? { bg: 'var(--hover-bg)', color: 'var(--text-primary)' } : {}}
    >
      {children}
    </Box>
  );
});

/* ─── AppPagination ─────────────────────────────────────────────── */
const AppPagination = memo(function AppPagination({
  totalRows,
  currentPage,
  rowsPerPage,
  rowsPerPageOptions = [10, 20, 30, 50],
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageLabel = 'Rows per page:',
}: AppPaginationProps) {
  /* Derived values — all O(1) */
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalRows / rowsPerPage)),
    [totalRows, rowsPerPage],
  );

  const rangeStart = useMemo(
    () => (totalRows === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1),
    [currentPage, rowsPerPage, totalRows],
  );

  const rangeEnd = useMemo(
    () => Math.min(currentPage * rowsPerPage, totalRows),
    [currentPage, rowsPerPage, totalRows],
  );

  /* Stable callbacks — don't recreate on every render */
  const goFirst = useCallback(() => onPageChange(1), [onPageChange]);
  const goPrev  = useCallback(() => onPageChange(Math.max(1, currentPage - 1)), [onPageChange, currentPage]);
  const goNext  = useCallback(() => onPageChange(Math.min(totalPages, currentPage + 1)), [onPageChange, currentPage, totalPages]);
  const goLast  = useCallback(() => onPageChange(totalPages), [onPageChange, totalPages]);

  const handleRowsChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onRowsPerPageChange(Number(e.target.value));
      onPageChange(1); // reset to page 1 whenever page-size changes
    },
    [onRowsPerPageChange, onPageChange],
  );

  return (
    <Flex
      align="center"
      justify="space-between"
      flexWrap="wrap"
      gap="1rem"
      px="1.6rem"
      py="1rem"
      borderTop="1px solid var(--table-border)"
      bg="var(--table-header-bg)"
      borderRadius="0 0 8px 8px"
      minH="5rem"
    >
      {/* ── Left: rows-per-page ───────────────────────────────── */}
      <Flex align="center" gap="0.8rem">
        <Text
          fontSize="1.3rem"
          color="var(--text-muted)"
          fontFamily="Montserrat, sans-serif"
          whiteSpace="nowrap"
        >
          {rowsPerPageLabel}
        </Text>
        <Box
          as="select"
          value={rowsPerPage}
          onChange={handleRowsChange}
          h="3rem"
          px="0.6rem"
          borderRadius="6px"
          border="1px solid var(--surface-border)"
          bg="var(--surface-card)"
          color="var(--text-secondary)"
          fontSize="1.3rem"
          fontFamily="Montserrat, sans-serif"
          cursor="pointer"
          outline="none"
          style={{ appearance: 'auto' }}
          _focus={{ borderColor: 'var(--brand-primary)' }}
        >
          {rowsPerPageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Box>
      </Flex>

      {/* ── Right: range info + nav buttons ──────────────────── */}
      <Flex align="center" gap="0.4rem">
        {/* "X–Y of Z" */}
        <Text
          fontSize="1.3rem"
          color="var(--text-muted)"
          fontFamily="Montserrat, sans-serif"
          whiteSpace="nowrap"
          mr="0.8rem"
        >
          {totalRows === 0
            ? '0 of 0'
            : `${rangeStart}–${rangeEnd} of ${totalRows}`}
        </Text>

        <NavButton onClick={goFirst} disabled={currentPage === 1} title="First page">
          <ChevronFirst size={16} />
        </NavButton>
        <NavButton onClick={goPrev} disabled={currentPage === 1} title="Previous page">
          <ChevronLeft size={16} />
        </NavButton>

        {/* Current / total pages pill */}
        <Flex
          align="center"
          gap="0.3rem"
          px="1rem"
          h="3.2rem"
          borderRadius="6px"
          bg="var(--surface-card)"
          border="1px solid var(--surface-border)"
        >
          <Text
            fontSize="1.3rem"
            fontWeight={600}
            color="var(--text-primary)"
            fontFamily="Montserrat, sans-serif"
          >
            {currentPage}
          </Text>
          <Text
            fontSize="1.3rem"
            color="var(--text-muted)"
            fontFamily="Montserrat, sans-serif"
          >
            / {totalPages}
          </Text>
        </Flex>

        <NavButton onClick={goNext} disabled={currentPage === totalPages} title="Next page">
          <ChevronRight size={16} />
        </NavButton>
        <NavButton onClick={goLast} disabled={currentPage === totalPages} title="Last page">
          <ChevronLast size={16} />
        </NavButton>
      </Flex>
    </Flex>
  );
});

export default AppPagination;
