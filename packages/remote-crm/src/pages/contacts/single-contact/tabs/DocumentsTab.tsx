import React, { useState, useMemo, memo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Badge } from '@chakra-ui/react';
import { type TableColumn } from 'react-data-table-component';
import { Plus, FileText, FileImage, File } from 'lucide-react';
import ReusableDataTable from 'sharedUi/ReusableDataTable';
import AppButton from 'sharedUi/AppButton';
import ActionMenu from 'sharedUi/ActionMenu';
import { mockDocuments, type Document } from './types';

const STATUS_COLORS: Record<Document['status'], string> = {
  Active:   'green',
  Archived: 'gray',
  Deleted:  'red',
};

const CATEGORY_COLORS: Record<Document['category'], string> = {
  Medical:   'blue',
  Legal:     'orange',
  Financial: 'green',
  Other:     'gray',
};

function DocIcon({ type }: { type: Document['documentType'] }) {
  if (type === 'JPG' || type === 'PNG') return <FileImage size={18} color="var(--brand-primary)" />;
  if (type === 'PDF' || type === 'DOC' || type === 'DOCX') return <FileText size={18} color="var(--brand-primary)" />;
  return <File size={18} color="var(--text-muted)" />;
}

const customStyles = {
  headCells: { style: { color: 'var(--text-muted)', fontWeight: '500', fontSize: '1.2rem', textTransform: 'uppercase' as const, letterSpacing: '0.5px' } },
  cells:     { style: { color: 'var(--text-primary)', fontSize: '1.4rem', paddingTop: '1.2rem', paddingBottom: '1.2rem', borderBottom: '1px solid var(--table-border)' } },
};

interface Props { contactId: string }

function DocumentsTabBase({ contactId }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (!searchTerm) return mockDocuments;
    const q = searchTerm.toLowerCase();
    return mockDocuments.filter((d) =>
      d.documentName.toLowerCase().includes(q) ||
      d.uploadedBy.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q),
    );
  }, [searchTerm]);

  const columns: TableColumn<Document>[] = [
    {
      name: 'Document Name',
      selector: (r) => r.documentName,
      sortable: true,
      minWidth: '22rem',
      cell: (r) => (
        <Flex align="center" gap="0.8rem">
          <DocIcon type={r.documentType} />
          <Box>
            <Text fontFamily="Montserrat, sans-serif" fontSize="1.4rem" color="var(--text-primary)" fontWeight="500">{r.documentName}</Text>
            <Text fontFamily="Montserrat, sans-serif" fontSize="1.2rem" color="var(--text-muted)">{r.fileSize}</Text>
          </Box>
        </Flex>
      ),
    },
    { name: 'Type',          selector: (r) => r.documentType,  sortable: true, minWidth: '10rem', cell: (r) => <Badge variant="outline" size="sm">{r.documentType}</Badge> },
    { name: 'Category',      selector: (r) => r.category,      sortable: true, minWidth: '13rem', cell: (r) => <Badge colorPalette={CATEGORY_COLORS[r.category]} size="sm">{r.category}</Badge> },
    { name: 'Uploaded By',   selector: (r) => r.uploadedBy,    sortable: true, minWidth: '14rem' },
    { name: 'Uploaded Date', selector: (r) => r.uploadedDate,  sortable: true, minWidth: '14rem' },
    { name: 'Status',        selector: (r) => r.status,        sortable: true, minWidth: '12rem', cell: (r) => <Badge colorPalette={STATUS_COLORS[r.status]} size="sm">{r.status}</Badge> },
    {
      name: 'Actions',
      cell: (row) => (
        <ActionMenu
          actions={[
            { label: 'View',     cta: () => console.log('View document',   row.id, contactId) },
            { label: 'Download', cta: () => console.log('Download',        row.id) },
            { label: 'Delete',   cta: () => console.log('Delete document', row.id), allowPopover: true, confirmationText: 'Delete this document?' },
          ]}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '10rem',
    },
  ];

  return (
    <Box>
      <ReusableDataTable
        data={filtered}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search documents…"
        noDataMessage="No documents found"
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        customStyles={customStyles}
        fixedHeader
        fixedHeaderScrollHeight="50rem"
        hasFixedActionColumn
        actionButtons={
          <AppButton variant="primary" leftIcon={<Plus size={16} />} enableRipple>
            Upload Document
          </AppButton>
        }
      />
    </Box>
  );
}

export const DocumentsTab = memo(DocumentsTabBase);
export default DocumentsTab;
