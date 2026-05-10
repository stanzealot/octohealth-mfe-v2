export const TAB_TABLE_CUSTOM_STYLES = {
  headCells: {
    style: {
      color: 'var(--text-muted)',
      fontWeight: '500',
      fontSize: '1.2rem',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    },
  },
  cells: {
    style: {
      color: 'var(--text-primary)',
      fontSize: '1.4rem',
      paddingTop: '1.2rem',
      paddingBottom: '1.2rem',
      borderBottom: '1px solid var(--table-border)',
    },
  },
} as const;
