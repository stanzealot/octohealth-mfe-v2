import React, { useMemo } from 'react';
import DataTable, { type TableColumn, type TableStyles } from 'react-data-table-component';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';

/* ─── Base styles (static — defined once, never re-allocated) ──────── */
const BASE_STYLES: TableStyles = {
  table: {
    style: {
      fontFamily: 'Montserrat, sans-serif',
      // No border/borderRadius here — the outer Box owns those visuals
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

/* ─── CSS applied when fixedHeader=true ──────────────────────────────
 *
 * We intentionally do NOT use the DataTable `fixedHeader` prop.
 * Instead, we set a maxH + overflow:auto on our own wrapper (ONE scroll
 * container for the whole table) and sticky-position the head + pagination
 * rows via CSS. This eliminates the split head/body scroll context that
 * causes the action-column overflow bug.
 *
 * ─────────────────────────────────────────────────────────────────── */
const FIXED_HEADER_CSS = {
  /* Stick the column-header row to the top of our scroll container */
  '& .rdt_TableHead': {
    position: 'sticky',
    top: 0,
    zIndex: 9,
    backgroundColor: 'var(--table-header-bg)',
  },
  /* Stick the pagination bar to the bottom of our scroll container */
  '& .rdt_Pagination': {
    position: 'sticky',
    bottom: 0,
    zIndex: 8,
    backgroundColor: 'var(--table-header-bg)',
  },
} as const;

/* ─── CSS applied when hasFixedActionColumn=true ──────────────────────
 *
 * The last <th> and last <td> become sticky at the right edge of the
 * scroll container. Using !important because the library injects inline
 * style overrides on the column cells that would otherwise win the
 * specificity battle.
 *
 * ─────────────────────────────────────────────────────────────────── */
const STICKY_COL_CSS = {
  '& .rdt_TableBody': { position: 'relative' },
  '& .rdt_TableRow':  { position: 'relative' },

  /* Body cells — sticky right */
  '& .rdt_TableCell:last-child, & .rdt_TableCol:last-child': {
    position: 'sticky !important',
    right: '0 !important',
    backgroundColor: 'var(--surface-card) !important',
    borderLeft: '1px solid var(--table-border) !important',
    zIndex: '5 !important',
    boxShadow: '-3px 0 8px rgba(0,0,0,0.06)',
  },

  /* Header cell — higher z-index so it sits above body cells when scrolling */
  '& .rdt_TableHeadRow .rdt_TableCol:last-child': {
    backgroundColor: 'var(--table-header-bg) !important',
    zIndex: '15 !important',
    position: 'sticky !important',
    right: '0 !important',
    top: '0 !important',
    boxShadow: '-3px 0 8px rgba(0,0,0,0.06)',
  },

  /* Match row hover colour on the sticky cell */
  '& .rdt_TableRow:hover .rdt_TableCell:last-child': {
    backgroundColor: 'var(--table-row-hover) !important',
  },

  '& .rdt_Table': { position: 'relative', overflow: 'visible' },
} as const;

/* ─── Always-on baseline CSS ──────────────────────────────────────── */
const BASE_CSS = {
  '& .rdt_TableWrapper': { position: 'relative' },
} as const;

/* ─── Props ────────────────────────────────────────────────────────── */
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
  /**
   * When true, the table body scrolls within `fixedHeaderScrollHeight`
   * and the header row + pagination bar remain visible (sticky via CSS).
   */
  fixedHeader?: boolean;
  fixedHeaderScrollHeight?: string;
  /**
   * When true, the last column (Actions) becomes sticky at the right edge
   * of the scroll container so it remains visible during horizontal scroll.
   */
  hasFixedActionColumn?: boolean;
}

/* ─── Component ────────────────────────────────────────────────────── */
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
  /* Deep-merge custom overrides once per `customStyles` reference change */
  const mergedStyles = useMemo<TableStyles>(
    () => ({
      ...BASE_STYLES,
      ...customStyles,
      table:   { style: { ...BASE_STYLES.table?.style,      ...(customStyles?.table?.style      ?? {}) } },
      headRow: { style: { ...BASE_STYLES.headRow?.style,    ...(customStyles?.headRow?.style    ?? {}) } },
      headCells:{ style: { ...BASE_STYLES.headCells?.style, ...(customStyles?.headCells?.style  ?? {}) } },
      rows:    { style: { ...BASE_STYLES.rows?.style,       ...(customStyles?.rows?.style       ?? {}) } },
      cells:   { style: { ...BASE_STYLES.cells?.style,      ...(customStyles?.cells?.style      ?? {}) } },
      pagination: {
        style:            { ...BASE_STYLES.pagination?.style,            ...(customStyles?.pagination?.style            ?? {}) },
        pageButtonsStyle: { ...BASE_STYLES.pagination?.pageButtonsStyle, ...(customStyles?.pagination?.pageButtonsStyle ?? {}) },
      },
    }),
    [customStyles],
  );

  /* Build the CSS object for the inner scroll wrapper, memoised */
  const scrollerCss = useMemo(
    () => ({
      ...BASE_CSS,
      ...(fixedHeader           ? FIXED_HEADER_CSS : {}),
      ...(hasFixedActionColumn  ? STICKY_COL_CSS   : {}),
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
        /*
         * Single scroll container — handles BOTH x and y scrolling.
         * maxH activates vertical scroll only when fixedHeader=true.
         *
         * Having ONE ancestor with overflow:auto means:
         *  • sticky header  sticks to the TOP    of this element ✓
         *  • sticky last col sticks to the RIGHT of this element ✓
         *  • sticky pagination sticks to the BOTTOM of this element ✓
         *  — No split-context bleed, no action-column overflow bug.
         */
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
              onSelectedRowsChange as
                | ((state: { selectedRows: T[] }) => void)
                | undefined
            }
            /*
             * Disable the library's own fixedHeader and responsive features.
             * Our overflow:auto wrapper + CSS handles both concerns, giving
             * a single scroll context instead of nested ones.
             */
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
