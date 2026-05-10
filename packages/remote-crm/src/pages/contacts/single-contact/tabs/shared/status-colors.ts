import type { Activity, Authorization, Claim, Invoice, Document } from '../types';

export const ACTIVITY_STATUS_COLORS: Record<Activity['status'], string> = {
  Completed: 'green',
  Pending: 'orange',
  'In-progress': 'blue',
  'Past due': 'red',
};

export const ACTIVITY_PRIORITY_COLORS: Record<Activity['priority'], string> = {
  Urgent: 'red',
  Important: 'blue',
  Normal: 'gray',
  Low: 'green',
};

export const AUTHORIZATION_STATUS_COLORS: Record<Authorization['status'], string> = {
  Completed: 'green',
  Pending: 'orange',
  'In-progress': 'blue',
  'Past due': 'red',
};

export const CLAIM_STATUS_COLORS: Record<Claim['status'], string> = {
  Approved: 'green',
  Closed: 'gray',
  Denied: 'red',
};

export const CLAIM_TYPE_COLORS: Record<Claim['type'], string> = {
  IP: 'blue',
  OP: 'purple',
};

export const INVOICE_STATUS_COLORS: Record<Invoice['status'], string> = {
  Paid: 'green',
  Unpaid: 'orange',
  Overdue: 'red',
  Pending: 'blue',
};

export const DOCUMENT_STATUS_COLORS: Record<Document['status'], string> = {
  Active: 'green',
  Archived: 'gray',
  Deleted: 'red',
};

export const DOCUMENT_CATEGORY_COLORS: Record<Document['category'], string> = {
  Medical: 'blue',
  Legal: 'orange',
  Financial: 'green',
  Other: 'gray',
};
