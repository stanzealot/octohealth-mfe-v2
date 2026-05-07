/**
 * mock/entities.ts — Mock entity data + helpers
 */

import type { Entity } from '../types';

const base: Entity = {
  id:               '1',
  name:             'R-Jolad Hospital',
  website:          'www.rjoladhospital.com',
  email:            'emailaddress@gmail.com',
  phone:            '090737846',
  address:          '98, Ilupeju Araromi street, Iyana-Ipaja Ilori, Ogun state',
  city:             'Alimosho',
  state:            'Lagos',
  country:          'Nigeria',
  zipCode:          '547857',
  cac:              '789009',
  providerCode:     'BOTH',
  effectiveDate:    '09/Jun/2024',
  terminationDate:  '10/Oct/2025',
  providerType:     'Hospital',
  claimType:        'Both',
  network:          ['Regular', 'HIS NETWORK', 'LAT NETWORK', 'ALL MNET'],
  longitude:        'N/A',
  latitude:         'N/A',
  feeValue:         30,
  availableDays:    ['MON', 'TUES', 'WED', 'THURS', 'FRI'],
  professionalFees: true,
  providerOwnCode:  true,
  status:           'Active',
  createdAt:        '2024-06-09T00:00:00Z',
  updatedAt:        '2024-06-09T00:00:00Z',
  contactPerson: {
    name:  'John Doe',
    phone: '090737846',
    email: 'emailaddress@gmail.com',
  },
  financialDetails: {
    accountName:         'R-Jolad Hospital',
    accountNumber:       '1234567890',
    bankName:            'First Bank',
    iban:                'NG21FBNG0000001234567890',
    swiftCode:           'FBNGNGLA',
    statementGeneration: 'Monthly',
    providerPaymentDays: 30,
  },
};

const statuses: Entity['status'][] = ['Active', 'Active', 'Active', 'Inactive', 'Pending'];
const names = [
  'Lagos Island General Hospital',
  'Zenith Medical Centre',
  'Reddington Hospital',
  'Eko Hospital',
  'Lekki Specialist Hospital',
  'BetaCare Hospital',
  'St. Nicholas Hospital',
  'Prime Care Clinic',
  'HealthPlus Pharmacy',
  'Medilag Consulting',
];

export const mockEntities: Entity[] = [
  base,
  ...Array.from({ length: 20 }, (_, i) => ({
    ...base,
    id:     `${i + 2}`,
    name:   names[i % names.length],
    status: statuses[i % statuses.length],
  })),
];

export function getEntityById(id: string): Entity | undefined {
  return mockEntities.find((e) => e.id === id);
}

export function filterEntities(entities: Entity[], search: string): Entity[] {
  if (!search) return entities;
  const q = search.toLowerCase();
  return entities.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.website.toLowerCase().includes(q) ||
      e.phone.includes(q),
  );
}
