const STATUS_COLORS: Record<string, string> = {
  Active: 'green',
  Qualified: 'green',
  Disqualified: 'red',
};

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? 'gray';
}

const NEED_MATURITY_COLORS: Record<string, string> = {
  'Sales-ready': 'green',
  Suspected: 'orange',
  'Not ready': 'gray',
};

export function getNeedMaturityColor(maturity: string): string {
  return NEED_MATURITY_COLORS[maturity] ?? 'gray';
}

export const LEADS_PAGINATION_OPTIONS = [10, 20, 50];

export const SOURCE_OPTIONS = [
  { label: 'Email', value: 'Email' },
  { label: 'Website', value: 'Website' },
  { label: 'Social Media', value: 'Social Media' },
];

export const NEED_MATURITY_OPTIONS = [
  { label: 'Sales-ready', value: 'Sales-ready' },
  { label: 'Suspected', value: 'Suspected' },
  { label: 'Not ready', value: 'Not ready' },
];

export const LEAD_STAGE_OPTIONS = [
  { label: 'Distribution', value: 'Distribution' },
  { label: 'Qualification', value: 'Qualification' },
];

export const NEED_TYPE_OPTIONS = [
  { label: 'Claim authorization', value: 'Claim authorization' },
  { label: 'Tariff mapping', value: 'Tariff mapping' },
  { label: 'Claims Processing', value: 'Claims Processing' },
];

export const CONTACT_OPTIONS = [
  { label: 'Jade Jackson - 090873645', value: 'Jade Jackson - 090873645' },
  { label: 'John Doe - 090873646', value: 'John Doe - 090873646' },
];

export const FORM_LABELS = {
  LEAD_TITLE: 'Lead title *',
  NEED_TYPE: 'Need type *',
  SOURCE: 'Source *',
  NEED_MATURITY: 'Need Maturity *',
  LEAD_STAGE: 'Lead stage *',
  CONTACT: 'Contact *',
  ENTITY: 'Entity',
} as const;

export const FORM_PLACEHOLDERS = {
  TITLE: 'Enter title',
  NEED_TYPE: 'select need type',
  SOURCE: 'select source',
  NEED_MATURITY: 'select',
  LEAD_STAGE: 'select stage',
  CONTACT: 'select contact',
  ENTITY: 'Enter entity',
} as const;
