import React, { useMemo } from 'react';
import DataTable, { type TableColumn, type TableStyles } from 'react-data-table-component';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';

const BASE_STYLES: TableStyles = {
  table: {
    style: {
      fontFamily: 'Montserrat, sans-serif',

      backgroundColor: 'transparent',
    },
  },
  headRow: {
    style: {
      backgroundColor: 'var(--table-header-bg)',
      borderBottom: '1px solid var(--table-border)',
      minHeight: '52px',
    },
  },
  headCells: {
    style: {
      color: 'var(--text-muted)',
      fontSize: '12px',
      fontWeight: '500',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
      paddingLeft: '16px',
      paddingRight: '16px',
      fontFamily: 'Montserrat, sans-serif',
      whiteSpace: 'nowrap' as const,
      overflow: 'visible' as const,
      textOverflow: 'clip' as const,
      minWidth: 'fit-content',
    },
  },
  rows: {
    style: {
      minHeight: '48px',
      borderBottom: '1px solid var(--table-border)',
      backgroundColor: 'var(--surface-card)',
      '&:hover': {
        backgroundColor: 'var(--table-row-hover)',
        cursor: 'pointer',
      },
    },
  },
  cells: {
    style: {
      color: 'var(--text-primary)',
      fontSize: '14px',
      fontWeight: '400',
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingTop: '12px',
      paddingBottom: '12px',
      fontFamily: 'Montserrat, sans-serif',
    },
  },
  pagination: {
    style: {
      backgroundColor: 'var(--table-header-bg)',
      borderTop: '1px solid var(--table-border)',
      fontSize: '13px',
      color: 'var(--text-muted)',
      fontFamily: 'Montserrat, sans-serif',
      minHeight: '52px',
    },
    pageButtonsStyle: {
      color: 'var(--text-secondary)',
      fill: 'var(--text-secondary)',
    },
  },
};

const FIXED_HEADER_CSS = {
  '& .rdt_TableHead': {
    position: 'sticky',
    top: 0,
    zIndex: 9,
    backgroundColor: 'var(--table-header-bg)',
  },

  '& .rdt_Pagination': {
    position: 'sticky',
    bottom: 0,
    zIndex: 8,
    backgroundColor: 'var(--table-header-bg)',
  },
} as const;

const STICKY_COL_CSS = {
  '& .rdt_TableBody': { position: 'relative' },
  '& .rdt_TableRow': { position: 'relative' },

  '& .rdt_TableCell:last-child, & .rdt_TableCol:last-child': {
    position: 'sticky !important',
    right: '0 !important',
    backgroundColor: 'var(--surface-card) !important',
    borderLeft: '1px solid var(--table-border) !important',
    zIndex: '5 !important',
    boxShadow: '-3px 0 8px rgba(0,0,0,0.06)',
  },

  '& .rdt_TableHeadRow .rdt_TableCol:last-child': {
    backgroundColor: 'var(--table-header-bg) !important',
    zIndex: '15 !important',
    position: 'sticky !important',
    right: '0 !important',
    top: '0 !important',
    boxShadow: '-3px 0 8px rgba(0,0,0,0.06)',
  },

  '& .rdt_TableRow:hover .rdt_TableCell:last-child': {
    backgroundColor: 'var(--table-row-hover) !important',
  },

  '& .rdt_Table': { position: 'relative', overflow: 'visible' },
} as const;

const BASE_CSS = {
  '& .rdt_TableWrapper': { position: 'relative' },
} as const;

export interface BaseDataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  loading?: boolean;
  noDataMessage?: string;
  customStyles?: Partial<TableStyles>;
  pagination?: boolean;
  paginationPerPage?: number;
  paginationRowsPerPageOptions?: number[];
  onRowClicked?: (row: T) => void;
  selectableRows?: boolean;
  onSelectedRowsChange?: (state: unknown) => void;

  fixedHeader?: boolean;
  fixedHeaderScrollHeight?: string;

  hasFixedActionColumn?: boolean;
}

function BaseDataTable<T>({
  data,
  columns,
  title,
  loading = false,
  noDataMessage = 'No records found',
  customStyles = {},
  pagination = true,
  paginationPerPage = 10,
  paginationRowsPerPageOptions = [10, 25, 50, 100],
  onRowClicked,
  selectableRows = false,
  onSelectedRowsChange,
  fixedHeader = true,
  fixedHeaderScrollHeight = '480px',
  hasFixedActionColumn = false,
}: BaseDataTableProps<T>) {
  const mergedStyles = useMemo<TableStyles>(
    () => ({
      ...BASE_STYLES,
      ...customStyles,
      table: { style: { ...BASE_STYLES.table?.style, ...(customStyles?.table?.style ?? {}) } },
      headRow: {
        style: { ...BASE_STYLES.headRow?.style, ...(customStyles?.headRow?.style ?? {}) },
      },
      headCells: {
        style: { ...BASE_STYLES.headCells?.style, ...(customStyles?.headCells?.style ?? {}) },
      },
      rows: { style: { ...BASE_STYLES.rows?.style, ...(customStyles?.rows?.style ?? {}) } },
      cells: { style: { ...BASE_STYLES.cells?.style, ...(customStyles?.cells?.style ?? {}) } },
      pagination: {
        style: { ...BASE_STYLES.pagination?.style, ...(customStyles?.pagination?.style ?? {}) },
        pageButtonsStyle: {
          ...BASE_STYLES.pagination?.pageButtonsStyle,
          ...(customStyles?.pagination?.pageButtonsStyle ?? {}),
        },
      },
    }),
    [customStyles],
  );

  const scrollerCss = useMemo(
    () => ({
      ...BASE_CSS,
      ...(fixedHeader ? FIXED_HEADER_CSS : {}),
      ...(hasFixedActionColumn ? STICKY_COL_CSS : {}),
    }),
    [fixedHeader, hasFixedActionColumn],
  );

  return (
    <Box
      border="1px solid var(--table-border)"
      borderRadius="12px"
      bg="var(--surface-card)"
      overflow="hidden"
      position="relative"
    >
      {loading ? (
        <Flex align="center" justify="center" minH="20rem">
          <Spinner size="lg" color="var(--brand-primary)" borderWidth="3px" />
        </Flex>
      ) : (
        <Box
          overflow="auto"
          maxH={fixedHeader ? fixedHeaderScrollHeight : undefined}
          css={scrollerCss}
        >
          <DataTable
            title={title}
            columns={columns}
            data={data}
            customStyles={mergedStyles}
            pagination={pagination}
            paginationPerPage={paginationPerPage}
            paginationRowsPerPageOptions={paginationRowsPerPageOptions}
            onRowClicked={onRowClicked}
            selectableRows={selectableRows}
            onSelectedRowsChange={
              onSelectedRowsChange as ((state: { selectedRows: T[] }) => void) | undefined
            }
            fixedHeader={false}
            responsive={false}
            noDataComponent={
              <Box py="4rem" textAlign="center" w="100%">
                <Text
                  color="var(--text-muted)"
                  fontSize="1.4rem"
                  fontFamily="Montserrat, sans-serif"
                >
                  {noDataMessage}
                </Text>
              </Box>
            }
          />
        </Box>
      )}
    </Box>
  );
}

export default BaseDataTable;
