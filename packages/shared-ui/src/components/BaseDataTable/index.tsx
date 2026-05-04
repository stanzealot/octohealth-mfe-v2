import React from 'react';
import DataTable, { type TableColumn, type TableStyles } from 'react-data-table-component';
import { Box, Spinner, Text, Flex } from '@chakra-ui/react';

const defaultStyles: TableStyles = {
  table: {
    style: {
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '1.4rem',
      border: '1px solid var(--table-border)',
      borderRadius: '8px',
      overflow: 'hidden',
      background: 'var(--surface-card)',
    },
  },
  headRow: {
    style: {
      backgroundColor: 'var(--table-header-bg)',
      borderBottomColor: 'var(--table-border)',
      borderBottomWidth: '1px',
      minHeight: '4.4rem',
    },
  },
  headCells: {
    style: {
      color: 'var(--text-muted)',
      fontSize: '1.2rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      padding: '1.2rem 1.6rem',
      fontFamily: 'Montserrat, sans-serif',
      background: 'var(--table-header-bg)',
    },
  },
  rows: {
    style: {
      minHeight: '5.2rem',
      borderBottomColor: 'var(--table-border)',
      background: 'var(--surface-card)',
      '&:hover': { backgroundColor: 'var(--table-row-hover)', cursor: 'pointer' },
    },
  },
  cells: {
    style: {
      color: 'var(--text-primary)',
      fontSize: '1.4rem',
      padding: '1.2rem 1.6rem',
      fontFamily: 'Montserrat, sans-serif',
    },
  },
  pagination: {
    style: {
      backgroundColor: 'var(--table-header-bg)',
      borderTopColor: 'var(--table-border)',
      borderTopWidth: '1px',
      fontSize: '1.3rem',
      color: 'var(--text-secondary)',
      fontFamily: 'Montserrat, sans-serif',
    },
    pageButtonsStyle: {
      color: 'var(--text-secondary)',
      fill: 'var(--text-secondary)',
    },
  },
};

interface BaseDataTableProps<T> {
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
  responsive?: boolean;
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
  responsive = true,
}: BaseDataTableProps<T>) {
  const mergedStyles: TableStyles = {
    ...defaultStyles,
    ...customStyles,
    table: { style: { ...defaultStyles.table?.style, ...(customStyles.table?.style ?? {}) } },
    headRow: { style: { ...defaultStyles.headRow?.style, ...(customStyles.headRow?.style ?? {}) } },
    headCells: { style: { ...defaultStyles.headCells?.style, ...(customStyles.headCells?.style ?? {}) } },
    rows: { style: { ...defaultStyles.rows?.style, ...(customStyles.rows?.style ?? {}) } },
    cells: { style: { ...defaultStyles.cells?.style, ...(customStyles.cells?.style ?? {}) } },
    pagination: {
      style: { ...defaultStyles.pagination?.style, ...(customStyles.pagination?.style ?? {}) },
      pageButtonsStyle: { ...defaultStyles.pagination?.pageButtonsStyle, ...(customStyles.pagination?.pageButtonsStyle ?? {}) },
    },
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" minH="200px">
        <Spinner size="lg" color="var(--brand-primary)" borderWidth="3px" />
      </Flex>
    );
  }

  return (
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
      onSelectedRowsChange={onSelectedRowsChange as ((state: { selectedRows: T[] }) => void) | undefined}
      fixedHeader={fixedHeader}
      fixedHeaderScrollHeight={fixedHeaderScrollHeight}
      responsive={responsive}
      noDataComponent={
        <Box py="4rem" textAlign="center">
          <Text color="var(--text-muted)" fontSize="1.4rem" fontFamily="Montserrat, sans-serif">
            {noDataMessage}
          </Text>
        </Box>
      }
    />
  );
}

export default BaseDataTable;
