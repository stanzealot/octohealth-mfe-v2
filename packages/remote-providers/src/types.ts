// ─── Provider Types ────────────────────────────────────────────────────────
export type ProviderType = 'Hospital' | 'Pharmacy' | 'Diagnostic';
export type ServiceType = 'IP' | 'OP' | 'BOTH';
export type ProviderStatus = 'Active' | 'Inactive';

export interface Provider {
  id: string;
  providerName: string;
  providerType: ProviderType;
  serviceType: ServiceType;
  masterProviderCode: string;
  partOf: string;
  providerAddress: string;
  city: string;
  state: string;
  status: ProviderStatus;
}

export interface ProviderDetails extends Provider {
  cacNumber: string;
  effectiveDate: string;
  terminationDate: string;
  phoneNumber: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  email: string;
  email1?: string;
  address1: string;
  address2?: string;
  country: string;
  townCity: string;
  poBox?: string;
  providerOwnCode: string;
  professionalFees: boolean;
  longitude?: string;
  latitude?: string;
  feeValue: string;
  availableDays: string[];
}

export interface PrimaryContact {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export interface AddProviderPayload {
  providerName: string;
  providerCode: string;
  cacNumber: string;
  providerType: { value: string; label: string };
  network: string[];
  effectiveDate: string;
  terminationDate: string;
  longitude?: string;
  latitude?: string;
  partOf: { value: string; label: string };
  emailList: string[];
  phoneList: string[];
  address1: string;
  address2?: string;
  poBox?: string;
  country: string;
  state: string;
  townCity: string;
  providerOwnCode: boolean;
  professionalFee: boolean;
  professionalFeeValue?: string;
  cutOffDays?: string;
  statementGeneration?: string;
  providerPaymentDays?: string;
  accountNumber?: string;
  bankName?: string;
  accountName?: string;
  iban?: string;
  swiftCode?: string;
  bankAddress?: string;
}

// ─── Network Types ─────────────────────────────────────────────────────────
export type NetworkStatus = 'Active' | 'Inactive';

export interface Network {
  id: string;
  networkName: string;
  lastUpdated: string;
  status: NetworkStatus;
  description?: string;
}

export interface NetworkProvider {
  id: string;
  providerName: string;
  masterProviderCode: string;
  providerAddress: string;
  city: string;
  state: string;
}

export interface NetworkFormData {
  networkName: string;
  description?: string;
}

// ─── Tariff Types ──────────────────────────────────────────────────────────
export type TariffStatus = 'Active' | 'Expired';
export type TariffType = 'Medicine' | 'Service';
export type ClaimType = 'IP' | 'OP';

export interface Tariff {
  id: string;
  providerName: string;
  tariffName: string;
  effectiveDate: string;
  expiryDate: string;
  renewDate: string;
  discount: string;
  status: TariffStatus;
  network?: string;
  tariffType?: TariffType;
}

export interface TariffDetails extends Tariff {
  providers: string[];
  terminationDate?: string;
}

export interface TariffService {
  id: string;
  serviceName: string;
}

export interface TariffItem {
  id: string;
  category: string;
  itemCode: string;
  itemDescription: string;
  providerItemCode: string;
  providerItemDescription: string;
  claimType: ClaimType;
  providerAmount: string;
  effectiveDate: string;
  expiryDate: string;
}

export interface GroupedTariff {
  providerName: string;
  tariffs: Tariff[];
}

export interface AddTariffFormData {
  tariffType: 'Medicine' | 'Service';
  providers: string[];
  network: { value: string; label: string };
  tariffName: string;
  tariffDiscount: string;
  discountType: '₦' | '%';
  effectiveDate: string;
  terminationDate: string;
  uploadedFiles: File[];
}

export interface EditTariffItemFormData {
  itemCode: string;
  providerItemCode: string;
  itemDescription: string;
  providerItemDescription: string;
  providerAmount: string;
}
