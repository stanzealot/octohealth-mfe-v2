import React from 'react';
import DataTable, { type TableColumn, type TableStyles } from 'react-data-table-component';
import { Box, Spinner, Text, Flex } from '@chakra-ui/react';

const defaultStyles: TableStyles = {
  table: {
    style: {
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '1.4rem',
      border: '1px solid #EAECF0',
      borderRadius: '8px',
      overflow: 'hidden',
    },
  },
  headRow: {
    style: {
      backgroundColor: '#F9FAFB',
      borderBottomColor: '#EAECF0',
      borderBottomWidth: '1px',
      minHeight: '4.4rem',
    },
  },
  headCells: {
    style: {
      color: '#667085',
      fontSize: '1.2rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      padding: '1.2rem 1.6rem',
      fontFamily: 'Montserrat, sans-serif',
    },
  },
  rows: {
    style: {
      minHeight: '5.2rem',
      borderBottomColor: '#EAECF0',
      '&:hover': { backgroundColor: '#F9FAFB', cursor: 'pointer' },
    },
  },
  cells: {
    style: {
      color: '#101828',
      fontSize: '1.4rem',
      padding: '1.2rem 1.6rem',
      fontFamily: 'Montserrat, sans-serif',
    },
  },
  pagination: {
    style: {
      backgroundColor: '#FCFCFD',
      borderTopColor: '#EAECF0',
      borderTopWidth: '1px',
      fontSize: '1.3rem',
      color: '#344054',
      fontFamily: 'Montserrat, sans-serif',
    },
    pageButtonsStyle: {
      color: '#344054',
      fill: '#344054',
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
        <Spinner size="lg" color="#0C6525" borderWidth="3px" />
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
          <Text color="#667085" fontSize="1.4rem" fontFamily="Montserrat, sans-serif">
            {noDataMessage}
          </Text>
        </Box>
      }
    />
  );
}

export default BaseDataTable;
