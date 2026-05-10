export interface CardColorPalette {
  borderTop: string;
  badgeBg: string;
  badgeText: string;
}

export const STAGE_COLOR_MAP: Record<string, CardColorPalette> = {
  Proposal: {
    borderTop: '#98A2B3',
    badgeBg: '#F2F5F8',
    badgeText: '#344054',
  },
  Quotation: {
    borderTop: '#DC6803',
    badgeBg: '#FFFAEB',
    badgeText: '#DC6803',
  },
  'Contract signing': {
    borderTop: '#2592FF',
    badgeBg: '#F0F7FF',
    badgeText: '#1E75CC',
  },
  'Payment collection': {
    borderTop: '#12B76A',
    badgeBg: '#ECFDF3',
    badgeText: '#039855',
  },
  Lost: {
    borderTop: '#F04438',
    badgeBg: '#FEF3F2',
    badgeText: '#D92D20',
  },
};

export const OPPORTUNITY_STAGE_SUMMARY_COLORS: Record<string, string> = {
  Proposal: '#3B82F6',
  Quotation: '#F59E0B',
  'Contract signing': '#10B981',
  'Payment collection': '#06B6D4',
  Lost: '#EF4444',
};

export const OPPORTUNITY_STAGES = [
  { value: 'Proposal', label: 'Proposal' },
  { value: 'Quotation', label: 'Quotation' },
  { value: 'Contract signing', label: 'Contract signing' },
  { value: 'Payment collection', label: 'Payment collection' },
  { value: 'Lost', label: 'Lost' },
];

export const SOURCE_OPTIONS = [
  { value: 'Website', label: 'Website' },
  { value: 'Email', label: 'Email' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Social Media', label: 'Social Media' },
];

export const PRIORITY_OPTIONS = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

const DEFAULT_COLORS: CardColorPalette = STAGE_COLOR_MAP.Proposal;

export function getOpportunityCardColors(stage: string) {
  const c = STAGE_COLOR_MAP[stage] ?? DEFAULT_COLORS;
  return {
    borderTop: c.borderTop,
    badge: { bg: c.badgeBg, text: c.badgeText },
    hover: {
      borderColor: c.borderTop,
      boxShadow: `0 8px 25px ${c.borderTop}30`,
    },
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}
