import type {
  Provider,
  ProviderDetails,
  Network,
  NetworkProvider,
  Tariff,
  TariffDetails,
  TariffService,
  TariffItem,
  GroupedTariff,
} from '../types';

const PROVIDER_ADDRESS = '98, Ilupeju Araromi street, iyana-ipaja ilori, orgun state';

// ─── Mock Providers ────────────────────────────────────────────────────────
export const mockProviders: Provider[] = [
  {
    id: '1',
    providerName: 'R-Jolad',
    providerType: 'Hospital',
    serviceType: 'IP',
    masterProviderCode: '090379',
    partOf: 'R-Jolad',
    providerAddress: PROVIDER_ADDRESS,
    city: 'Ota',
    state: 'Ogun',
    status: 'Active',
  },
  {
    id: '2',
    providerName: 'R-Jolad',
    providerType: 'Pharmacy',
    serviceType: 'OP',
    masterProviderCode: '379386',
    partOf: 'St. Ives',
    providerAddress: PROVIDER_ADDRESS,
    city: 'Ikeja',
    state: 'Lagos',
    status: 'Active',
  },
  {
    id: '3',
    providerName: 'R-Jolad',
    providerType: 'Hospital',
    serviceType: 'BOTH',
    masterProviderCode: '379386',
    partOf: 'Bee Hess',
    providerAddress: PROVIDER_ADDRESS,
    city: 'Mushin',
    state: 'Lagos',
    status: 'Inactive',
  },
  {
    id: '4',
    providerName: 'R-Jolad',
    providerType: 'Pharmacy',
    serviceType: 'OP',
    masterProviderCode: '090379',
    partOf: 'Duchess',
    providerAddress: PROVIDER_ADDRESS,
    city: 'Island',
    state: 'Lagos',
    status: 'Active',
  },
  {
    id: '5',
    providerName: 'R-Jolad',
    providerType: 'Hospital',
    serviceType: 'IP',
    masterProviderCode: '379386',
    partOf: 'R-Jolad',
    providerAddress: PROVIDER_ADDRESS,
    city: 'Island',
    state: 'Lagos',
    status: 'Active',
  },
  {
    id: '6',
    providerName: 'R-Jolad',
    providerType: 'Pharmacy',
    serviceType: 'BOTH',
    masterProviderCode: '379386',
    partOf: 'Branch',
    providerAddress: PROVIDER_ADDRESS,
    city: 'Ikeja',
    state: 'Lagos',
    status: 'Active',
  },
  {
    id: '7',
    providerName: 'R-Jolad',
    providerType: 'Hospital',
    serviceType: 'IP',
    masterProviderCode: '379386',
    partOf: 'R-Jolad',
    providerAddress: PROVIDER_ADDRESS,
    city: 'Ikeja',
    state: 'Lagos',
    status: 'Active',
  },
  {
    id: '8',
    providerName: 'R-Jolad',
    providerType: 'Hospital',
    serviceType: 'OP',
    masterProviderCode: '379386',
    partOf: 'R-Jolad',
    providerAddress: PROVIDER_ADDRESS,
    city: 'Ikeja',
    state: 'Lagos',
    status: 'Active',
  },
  {
    id: '9',
    providerName: 'R-Jolad',
    providerType: 'Hospital',
    serviceType: 'BOTH',
    masterProviderCode: '379386',
    partOf: 'R-Jolad',
    providerAddress: PROVIDER_ADDRESS,
    city: 'Ikeja',
    state: 'Lagos',
    status: 'Active',
  },
];

export function getProviderById(id: string): ProviderDetails | null {
  const provider = mockProviders.find((p) => p.id === id);
  if (!provider) return null;
  return {
    ...provider,
    cacNumber: '789009',
    effectiveDate: '09/Jun/2024',
    terminationDate: '10/Oct/2025',
    phoneNumber: '090737846',
    phoneNumber1: '090737846',
    phoneNumber2: '090737846',
    email: 'emailaddress@gmail.com',
    email1: 'emailaddress@gmail.com',
    address1: provider.providerAddress,
    address2: provider.providerAddress,
    country: 'Nigeria',
    townCity: 'Alimosho',
    poBox: '547857',
    providerOwnCode: 'YES',
    professionalFees: true,
    longitude: 'N/A',
    latitude: 'N/A',
    feeValue: '30%',
    availableDays: ['MON', 'TUES', 'WED', 'THURS', 'FRI'],
  };
}

export function filterProvidersData(
  providers: Provider[],
  filters: { search?: string; status?: string },
): Provider[] {
  return providers.filter((p) => {
    if (filters.status && p.status !== filters.status) return false;
    if (filters.search) {
      const term = filters.search.toLowerCase();
      return (
        p.providerName.toLowerCase().includes(term) ||
        p.masterProviderCode.toLowerCase().includes(term) ||
        p.city.toLowerCase().includes(term) ||
        p.state.toLowerCase().includes(term) ||
        p.providerType.toLowerCase().includes(term) ||
        p.partOf.toLowerCase().includes(term)
      );
    }
    return true;
  });
}

// ─── Mock Networks ─────────────────────────────────────────────────────────
export const mockNetworks: Network[] = [
  { id: '1', networkName: 'Tier 1', lastUpdated: '12-May-2025', status: 'Active' },
  { id: '2', networkName: 'Tier 1', lastUpdated: '12-May-2025', status: 'Active' },
  { id: '3', networkName: 'Tier 1', lastUpdated: '12-May-2025', status: 'Inactive' },
  { id: '4', networkName: 'Tier 1', lastUpdated: '12-May-2025', status: 'Active' },
  { id: '5', networkName: 'R-Tier 1', lastUpdated: '12-May-2025', status: 'Active' },
  { id: '6', networkName: 'Tier 1', lastUpdated: '12-May-2025', status: 'Active' },
  { id: '7', networkName: 'Tier 1', lastUpdated: '12-May-2025', status: 'Active' },
  { id: '8', networkName: 'Tier 1', lastUpdated: '12-May-2025', status: 'Active' },
  { id: '9', networkName: 'Tier 1', lastUpdated: '12-May-2025', status: 'Active' },
];

const NETWORK_PROVIDER_ADDRESS = '98, Ilupeju Araromi street, iyana-ipaja ilori, ogun state';

export const mockNetworkProviders: NetworkProvider[] = [
  {
    id: '1',
    providerName: 'R-Jolad',
    masterProviderCode: '090379',
    providerAddress: NETWORK_PROVIDER_ADDRESS,
    city: 'Ota',
    state: 'Ogun',
  },
  {
    id: '2',
    providerName: 'R-Jolad',
    masterProviderCode: '379386',
    providerAddress: NETWORK_PROVIDER_ADDRESS,
    city: 'Ikeja',
    state: 'Lagos',
  },
  {
    id: '3',
    providerName: 'R-Jolad',
    masterProviderCode: '379386',
    providerAddress: NETWORK_PROVIDER_ADDRESS,
    city: 'Mushin',
    state: 'Lagos',
  },
  {
    id: '4',
    providerName: 'R-Jolad',
    masterProviderCode: '379386',
    providerAddress: NETWORK_PROVIDER_ADDRESS,
    city: 'Island',
    state: 'Lagos',
  },
  {
    id: '5',
    providerName: 'R-Jolad',
    masterProviderCode: '379386',
    providerAddress: NETWORK_PROVIDER_ADDRESS,
    city: 'Island',
    state: 'Lagos',
  },
  {
    id: '6',
    providerName: 'R-Jolad',
    masterProviderCode: '379386',
    providerAddress: NETWORK_PROVIDER_ADDRESS,
    city: 'Ikeja',
    state: 'Lagos',
  },
  {
    id: '7',
    providerName: 'R-Jolad',
    masterProviderCode: '379386',
    providerAddress: NETWORK_PROVIDER_ADDRESS,
    city: 'Ikeja',
    state: 'Lagos',
  },
  {
    id: '8',
    providerName: 'R-Jolad',
    masterProviderCode: '379386',
    providerAddress: NETWORK_PROVIDER_ADDRESS,
    city: 'Ikeja',
    state: 'Lagos',
  },
  {
    id: '9',
    providerName: 'R-Jolad',
    masterProviderCode: '379386',
    providerAddress: NETWORK_PROVIDER_ADDRESS,
    city: 'Ikeja',
    state: 'Lagos',
  },
];

export function getNetworkById(id: string): Network | null {
  return mockNetworks.find((n) => n.id === id) ?? null;
}

export function getProvidersByNetworkId(_networkId: string): NetworkProvider[] {
  return mockNetworkProviders;
}

export function filterNetworksData(
  networks: Network[],
  filters: { search?: string; status?: string },
): Network[] {
  return networks.filter((n) => {
    if (filters.status && n.status !== filters.status) return false;
    if (filters.search) {
      const term = filters.search.toLowerCase();
      return n.networkName.toLowerCase().includes(term);
    }
    return true;
  });
}

// ─── Mock Tariffs ──────────────────────────────────────────────────────────
export const mockTariffs: Tariff[] = [
  {
    id: '1',
    providerName: 'R-Jolad',
    tariffName: 'Regular',
    effectiveDate: '12-May-2025',
    expiryDate: '12-May-2025',
    renewDate: 'N/A',
    discount: '10%',
    status: 'Expired',
  },
  {
    id: '2',
    providerName: 'R-Jolad',
    tariffName: 'Standard',
    effectiveDate: '12-May-2025',
    expiryDate: '12-May-2025',
    renewDate: 'N/A',
    discount: '5%',
    status: 'Expired',
  },
  {
    id: '3',
    providerName: 'R-Jolad',
    tariffName: 'Common',
    effectiveDate: '12-May-2025',
    expiryDate: '12-May-2025',
    renewDate: 'N/A',
    discount: '8%',
    status: 'Expired',
  },
  {
    id: '4',
    providerName: 'R-Jolad',
    tariffName: 'Regular',
    effectiveDate: '12-May-2025',
    expiryDate: '12-May-2025',
    renewDate: 'N/A',
    discount: '10%',
    status: 'Expired',
  },
  {
    id: '5',
    providerName: 'R-Jolad',
    tariffName: 'Standard',
    effectiveDate: '12-May-2025',
    expiryDate: 'N/A',
    renewDate: 'N/A',
    discount: '5%',
    status: 'Active',
  },
  {
    id: '6',
    providerName: 'R-Jolad',
    tariffName: 'Common',
    effectiveDate: '12-May-2025',
    expiryDate: 'N/A',
    renewDate: 'N/A',
    discount: '8%',
    status: 'Active',
  },
  {
    id: '7',
    providerName: 'R-Jolad',
    tariffName: 'Regular',
    effectiveDate: '12-May-2025',
    expiryDate: 'N/A',
    renewDate: 'N/A',
    discount: '10%',
    status: 'Active',
  },
  {
    id: '8',
    providerName: 'R-Jolad',
    tariffName: 'Standard',
    effectiveDate: '12-May-2025',
    expiryDate: 'N/A',
    renewDate: 'N/A',
    discount: '5%',
    status: 'Active',
  },
  {
    id: '9',
    providerName: 'R-Jolad',
    tariffName: 'Common',
    effectiveDate: '12-May-2025',
    expiryDate: 'N/A',
    renewDate: 'N/A',
    discount: '8%',
    status: 'Active',
  },
  {
    id: '10',
    providerName: 'Ever care',
    tariffName: 'Premium',
    effectiveDate: '12-May-2025',
    expiryDate: 'N/A',
    renewDate: 'N/A',
    discount: '15%',
    status: 'Active',
  },
  {
    id: '11',
    providerName: 'Best Care',
    tariffName: 'Standard',
    effectiveDate: '12-May-2025',
    expiryDate: 'N/A',
    renewDate: 'N/A',
    discount: '8%',
    status: 'Active',
  },
  {
    id: '12',
    providerName: 'Bee-hess',
    tariffName: 'Regular',
    effectiveDate: '12-May-2025',
    expiryDate: 'N/A',
    renewDate: 'N/A',
    discount: '12%',
    status: 'Active',
  },
  {
    id: '13',
    providerName: 'St Ives',
    tariffName: 'Premium',
    effectiveDate: '12-May-2025',
    expiryDate: 'N/A',
    renewDate: 'N/A',
    discount: '20%',
    status: 'Active',
  },
  {
    id: '14',
    providerName: 'Orchid',
    tariffName: 'Standard',
    effectiveDate: '12-May-2025',
    expiryDate: 'N/A',
    renewDate: 'N/A',
    discount: '7%',
    status: 'Active',
  },
];

export const mockTariffServices: TariffService[] = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  serviceName: 'Physiotherapy & Rehabilitation',
}));

export const mockTariffItems: TariffItem[] = [
  {
    id: '1',
    category: 'Out-Patient',
    itemCode: '090379',
    itemDescription: 'Physiotherapy & Rehabilitation',
    providerItemCode: '090379',
    providerItemDescription: 'Physiotherapy & Rehabilitation',
    claimType: 'OP',
    providerAmount: 'N0.00',
    effectiveDate: '19/Jan/2023',
    expiryDate: 'N/A',
  },
  {
    id: '2',
    category: 'Out-Patient',
    itemCode: '379386',
    itemDescription: 'Physiotherapy & Rehabilitation',
    providerItemCode: '379386',
    providerItemDescription: 'Physiotherapy & Rehabilitation',
    claimType: 'OP',
    providerAmount: 'N0.00',
    effectiveDate: '19/Jan/2023',
    expiryDate: 'N/A',
  },
  {
    id: '3',
    category: 'Out-Patient',
    itemCode: '379386',
    itemDescription: 'Physiotherapy & Rehabilitation',
    providerItemCode: '379386',
    providerItemDescription: 'Physiotherapy & Rehabilitation',
    claimType: 'OP',
    providerAmount: 'N0.00',
    effectiveDate: '19/Jan/2023',
    expiryDate: 'N/A',
  },
  {
    id: '4',
    category: 'Out-Patient',
    itemCode: '090379',
    itemDescription: 'Physiotherapy & Rehabilitation',
    providerItemCode: '090379',
    providerItemDescription: 'Physiotherapy & Rehabilitation',
    claimType: 'OP',
    providerAmount: 'N0.00',
    effectiveDate: '19/Jan/2023',
    expiryDate: 'N/A',
  },
  {
    id: '5',
    category: 'Out-Patient',
    itemCode: '379386',
    itemDescription: 'Physiotherapy & Rehabilitation',
    providerItemCode: '379386',
    providerItemDescription: 'Physiotherapy & Rehabilitation',
    claimType: 'OP',
    providerAmount: 'N0.00',
    effectiveDate: '19/Jan/2023',
    expiryDate: 'N/A',
  },
  {
    id: '6',
    category: 'Out-Patient',
    itemCode: '379386',
    itemDescription: 'Physiotherapy & Rehabilitation',
    providerItemCode: '379386',
    providerItemDescription: 'Physiotherapy & Rehabilitation',
    claimType: 'OP',
    providerAmount: 'N0.00',
    effectiveDate: '19/Jan/2023',
    expiryDate: 'N/A',
  },
  {
    id: '7',
    category: 'Out-Patient',
    itemCode: '379386',
    itemDescription: 'Physiotherapy & Rehabilitation',
    providerItemCode: '379386',
    providerItemDescription: 'Physiotherapy & Rehabilitation',
    claimType: 'OP',
    providerAmount: 'N0.00',
    effectiveDate: '19/Jan/2023',
    expiryDate: 'N/A',
  },
  {
    id: '8',
    category: 'Out-Patient',
    itemCode: '379386',
    itemDescription: 'Physiotherapy & Rehabilitation',
    providerItemCode: '379386',
    providerItemDescription: 'Physiotherapy & Rehabilitation',
    claimType: 'OP',
    providerAmount: 'N0.00',
    effectiveDate: '19/Jan/2023',
    expiryDate: 'N/A',
  },
  {
    id: '9',
    category: 'Out-Patient',
    itemCode: '379386',
    itemDescription: 'Physiotherapy & Rehabilitation',
    providerItemCode: '379386',
    providerItemDescription: 'Physiotherapy & Rehabilitation',
    claimType: 'OP',
    providerAmount: 'N0.00',
    effectiveDate: '19/Jan/2023',
    expiryDate: 'N/A',
  },
];

export function getTariffById(id: string): TariffDetails | null {
  const tariff = mockTariffs.find((t) => t.id === id);
  if (!tariff) return null;
  return {
    ...tariff,
    providers: ['R-Jolad', 'Victoria Island Hospital', 'Test Hospital'],
    network: 'ESSENTIAL',
    tariffType: 'Medicine',
  };
}

export function getTariffServicesByTariffId(_tariffId: string): TariffService[] {
  return mockTariffServices;
}

export function getTariffItemsByServiceId(_serviceId: string): TariffItem[] {
  return mockTariffItems;
}

export function groupTariffsByProvider(tariffs: Tariff[]): GroupedTariff[] {
  const map = new Map<string, Tariff[]>();
  for (const tariff of tariffs) {
    if (!map.has(tariff.providerName)) {
      map.set(tariff.providerName, []);
    }
    map.get(tariff.providerName)!.push(tariff);
  }
  return Array.from(map.entries()).map(([providerName, tariffs]) => ({ providerName, tariffs }));
}

export function filterTariffsData(
  tariffs: Tariff[],
  filters: { search?: string; providerName?: string; status?: string },
): Tariff[] {
  return tariffs.filter((t) => {
    if (filters.status && t.status !== filters.status) return false;
    if (filters.providerName && t.providerName !== filters.providerName) return false;
    if (filters.search) {
      const term = filters.search.toLowerCase();
      return (
        t.providerName.toLowerCase().includes(term) ||
        t.tariffName.toLowerCase().includes(term) ||
        t.discount.toLowerCase().includes(term)
      );
    }
    return true;
  });
}
