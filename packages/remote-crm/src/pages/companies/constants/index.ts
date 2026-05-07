/**
 * constants/index.ts — Companies sub-module constants
 */

export const industryOptions = [
  { label: 'Health',      value: 'Health'      },
  { label: 'Technology',  value: 'Technology'  },
  { label: 'Finance',     value: 'Finance'     },
];

export const categoryOptions = [
  { label: 'Pharmacy',  value: 'Pharmacy'  },
  { label: 'Hospital',  value: 'Hospital'  },
  { label: 'Clinic',    value: 'Clinic'    },
];

export const legalEntityOptions = [
  { label: 'Limited Liability', value: 'Limited Liability' },
  { label: 'N/A',               value: 'N/A'               },
];

export const countryOptions = [
  { label: 'Nigeria', value: 'Nigeria' },
  { label: 'Ghana',   value: 'Ghana'   },
  { label: 'Kenya',   value: 'Kenya'   },
];

export const stateOptions = [
  { label: 'Lagos', value: 'Lagos' },
  { label: 'Abuja', value: 'Abuja' },
  { label: 'Kano',  value: 'Kano'  },
];

export const cityOptions = [
  { label: 'Ikeja',            value: 'Ikeja'            },
  { label: 'Victoria Island',  value: 'Victoria Island'  },
  { label: 'Lekki',            value: 'Lekki'            },
];

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Active':   return 'green';
    case 'Inactive': return 'gray';
    case 'Pending':  return 'orange';
    default:         return 'red';
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
