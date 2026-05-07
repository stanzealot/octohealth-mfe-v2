/**
 * types.ts — Companies/Entities sub-module type definitions
 */

export type ProviderType = 'Hospital' | 'Clinic' | 'Pharmacy' | 'Lab';
export type EntityStatus  = 'Active' | 'Inactive' | 'Pending' | 'Suspended';

export interface ContactPerson {
  name:  string;
  phone: string;
  email: string;
}

export interface FinancialDetails {
  accountName:          string;
  accountNumber:        string;
  bankName:             string;
  iban:                 string;
  swiftCode:            string;
  statementGeneration:  string;
  providerPaymentDays:  number;
}

export interface Entity {
  id:               string;
  name:             string;
  website:          string;
  email:            string;
  phone:            string;
  address:          string;
  city:             string;
  state:            string;
  country:          string;
  zipCode:          string;
  cac:              string;
  providerCode:     string;
  effectiveDate:    string;
  terminationDate:  string;
  providerType:     ProviderType;
  claimType:        string;
  network:          string[];
  longitude:        string;
  latitude:         string;
  feeValue:         number;
  availableDays:    string[];
  professionalFees: boolean;
  providerOwnCode:  boolean;
  status:           EntityStatus;
  logo?:            string;
  createdAt:        string;
  updatedAt:        string;
  contactPerson:    ContactPerson;
  financialDetails: FinancialDetails;
}

export interface NewEntityPayload {
  name:         string;
  phone:        string;
  email:        string;
  address:      string;
  country:      string;
  state:        string;
  city:         string;
  zipCode:      string;
  cac:          string;
  providerCode: string;
  longitude:    string;
  latitude:     string;
  providerType: string;
  claimType:    string;
  network:      string[];
  feeValue:     number;
  website?:     string;
  socialMedia?: string;
}
