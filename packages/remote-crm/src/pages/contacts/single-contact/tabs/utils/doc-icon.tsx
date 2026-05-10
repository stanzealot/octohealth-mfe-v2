import React from 'react';
import { FileText, FileImage, File } from 'lucide-react';
import type { Document } from '../types';

export function DocIcon({ type }: { type: Document['documentType'] }) {
  if (type === 'JPG' || type === 'PNG') return <FileImage size={18} color="var(--brand-primary)" />;
  if (type === 'PDF' || type === 'DOC' || type === 'DOCX')
    return <FileText size={18} color="var(--brand-primary)" />;
  return <File size={18} color="var(--text-muted)" />;
}
