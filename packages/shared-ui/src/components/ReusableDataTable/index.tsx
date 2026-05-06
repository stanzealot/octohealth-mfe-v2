import React, { type ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Search, SlidersHorizontal } from 'lucide-react';
import BaseDataTable from '../BaseDataTable';
import type { TableColumn, TableStyles } from 'react-data-table-component';

export interface ReusableDataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showFilter?: boolean;
  showActions?: boolean;
  actionButtons?: ReactNode;
  loading?: boolean;
  noDataMessage?: string;
  noDataText?: string;
  customStyles?: Partial<TableStyles>;
  pagination?: boolean;
  paginationPerPage?: number;
  paginationRowsPerPageOptions?: number[];
  onRowClicked?: (row: T) => void;
  selectableRows?: boolean;
  onSelectedRowsChange?: (state: unknown) => void;
  fixedHeader?: boolean;
  fixedHeaderScrollHeight?: string;
  responsive?: boolean;
  hasFixedActionColumn?: boolean;
}

function ReusableDataTable<T>({
  data,
  columns,
  title,
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Search here...',
  showSearch = true,
  showFilter = true,
  showActions = true,
  actionButtons,
  loading = false,
  noDataMessage,
  noDataText,
  customStyles = {},
  pagination = true,
  paginationPerPage = 10,
  paginationRowsPerPageOptions = [10, 25, 50, 100],
  onRowClicked,
  selectableRows = false,
  onSelectedRowsChange,
  fixedHeader = true,
  fixedHeaderScrollHeight = '580px',
  responsive = true,
  hasFixedActionColumn = false,
}: ReusableDataTableProps<T>) {
  const hasToolbar = showSearch || showFilter || (showActions && actionButtons);

  return (
    <Box w="100%" overflowX="auto" overflowY="hidden">
      {hasToolbar && (
        <Flex
          flexDir="row"
          justify="space-between"
          align="center"
          gap="1.2rem"
          py="1.6rem"
          flexWrap="wrap"
        >
          {/* Left — search + filter */}
          <Flex align="center" gap="1rem" flex={1}>
            {showSearch && onSearchChange && (
              <Box position="relative" maxW="32rem" flex={1}>
                <Box
                  position="absolute"
                  left="1.2rem"
                  top="50%"
                  transform="translateY(-50%)"
                  color="var(--text-placeholder)"
                  pointerEvents="none"
                  display="flex"
                >
                  <Search size={16} />
                </Box>
                <input
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  style={{
                    width: '100%',
                    height: '4rem',
                    paddingLeft: '3.6rem',
                    paddingRight: '1.2rem',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '8px',
                    fontSize: '1.4rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'Montserrat, sans-serif',
                    outline: 'none',
                    background: 'var(--surface-card)',
                    transition: 'all 0.3s ease-in-out',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--brand-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(12,101,37,0.12)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--surface-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Box>
            )}

            {showFilter && (
              <Box
                as="button"
                display="flex"
                alignItems="center"
                gap="0.6rem"
                h="4rem"
                px="1.4rem"
                border="1px solid var(--surface-border)"
                borderRadius="8px"
                bg="var(--surface-card)"
                cursor="pointer"
                fontSize="1.4rem"
                color="var(--text-secondary)"
                fontFamily="Montserrat, sans-serif"
                transition="all 0.2s ease"
                whiteSpace="nowrap"
                _hover={{ borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)', bg: 'var(--brand-primary-light)' }}
              >
                <SlidersHorizontal size={15} />
                Filter
              </Box>
            )}
          </Flex>

          {/* Right — action buttons */}
          {showActions && actionButtons && (
            <Flex align="center" gap="1rem">
              {actionButtons}
            </Flex>
          )}
        </Flex>
      )}

      <BaseDataTable
        data={data}
        columns={columns}
        title={title}
        loading={loading}
        noDataMessage={noDataMessage ?? noDataText}
        customStyles={customStyles}
        pagination={pagination}
        paginationPerPage={paginationPerPage}
        paginationRowsPerPageOptions={paginationRowsPerPageOptions}
        onRowClicked={onRowClicked}
        selectableRows={selectableRows}
        onSelectedRowsChange={onSelectedRowsChange}
        fixedHeader={fixedHeader}
        fixedHeaderScrollHeight={fixedHeaderScrollHeight}
        responsive={responsive}
        hasFixedActionColumn={hasFixedActionColumn}
      />
    </Box>
  );
}

export default ReusableDataTable;
