// Provider constants
export const getProviderStatusColor = (status: string): string => {
  const map: Record<string, string> = { Active: 'green', Inactive: 'gray' };
  return map[status] ?? 'gray';
};

export const getTariffStatusColor = (status: string): string => {
  const map: Record<string, string> = { Active: 'green', Expired: 'red' };
  return map[status] ?? 'gray';
};

export const PROVIDERS_PAGINATION_OPTIONS = [10, 20, 50];
export const TARIFF_PAGINATION_OPTIONS = [10, 20, 50];
export const NETWORK_PAGINATION_OPTIONS = [10, 20, 50];

export const PROVIDER_TYPE_OPTIONS = [
  { value: 'Hospital', label: 'Hospital' },
  { value: 'Pharmacy', label: 'Pharmacy' },
  { value: 'Diagnostic', label: 'Diagnostic' },
];

export const PART_OF_OPTIONS = [
  { value: 'R-Jolad', label: 'R-Jolad' },
  { value: 'St. Ives', label: 'St. Ives' },
  { value: 'Bee Hess', label: 'Bee Hess' },
  { value: 'Duchess', label: 'Duchess' },
  { value: 'Branch', label: 'Branch' },
];

export const NETWORK_OPTIONS = [
  { value: 'Regular', label: 'Regular' },
  { value: 'IRIS NETWORK', label: 'IRIS NETWORK' },
  { value: 'LILY NETWORK', label: 'LILY NETWORK' },
  { value: 'ALL INET', label: 'ALL INET' },
];

export const COUNTRY_OPTIONS = [
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Kenya', label: 'Kenya' },
];

export const STATE_OPTIONS = [
  { value: 'Lagos', label: 'Lagos' },
  { value: 'Ogun', label: 'Ogun' },
  { value: 'Abuja', label: 'Abuja' },
];

export const STATEMENT_GENERATION_OPTIONS = [
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Daily', label: 'Daily' },
];

export const BANK_OPTIONS = [
  { value: 'Access Bank', label: 'Access Bank' },
  { value: 'GTBank', label: 'GTBank' },
  { value: 'First Bank', label: 'First Bank' },
  { value: 'Zenith Bank', label: 'Zenith Bank' },
  { value: 'UBA', label: 'UBA' },
];

export const TARIFF_PROVIDER_OPTIONS = [
  { value: 'R-Jolad', label: 'R-Jolad' },
  { value: 'Victoria Island Hospital', label: 'Victoria Island Hospital' },
  { value: 'Test Hospital', label: 'Test Hospital' },
  { value: 'Ever Care Hospital', label: 'Ever Care Hospital' },
];

export const TARIFF_NETWORK_OPTIONS = [
  { value: 'ESSENTIAL', label: 'ESSENTIAL' },
  { value: 'PREMIUM', label: 'PREMIUM' },
  { value: 'STANDARD', label: 'STANDARD' },
];
