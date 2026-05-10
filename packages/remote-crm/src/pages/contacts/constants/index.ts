import type { Contact } from '../../../mock/contacts';

export const GRID_PAGE_SIZE_OPTIONS = [8, 12, 20, 32] as const;

export const DEFAULT_GRID_PAGE_SIZE = 12;

export const ADD_CONTACT_PREFIX_OPTIONS = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'] as const;

export const ADD_CONTACT_GENDER_OPTIONS = ['Male', 'Female'] as const;

export const CONTACT_STATUS_STYLES: Record<
  Contact['contactStatus'],
  { bg: string; color: string }
> = {
  Active: { bg: 'rgba(18,183,106,0.12)', color: 'var(--status-success)' },
  Inactive: { bg: 'var(--hover-bg)', color: 'var(--text-muted)' },
  Suspended: { bg: 'rgba(240,68,56,0.12)', color: 'var(--status-danger)' },
};
