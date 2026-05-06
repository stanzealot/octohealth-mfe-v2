/**
 * AddressSection.tsx
 *
 * Accordion section for contact address.
 *
 * Country and State use AppAsyncSelect (server-side search + pagination).
 * State select is disabled until a country is chosen and resets its cache
 * whenever the country changes.
 */
import React, { useCallback, useMemo } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import type { UseFormReturn } from 'react-hook-form';
import AppAccordionSection from 'sharedUi/AppAccordionSection';
import AppInput from 'sharedUi/AppInput';
import AppSelect from 'sharedUi/AppSelect';
import AppAsyncSelect from 'sharedUi/AppAsyncSelect';
import type { ContactFormPayload } from '../schema';
import { loadCountryOptions, makeLoadStateOptions } from '../../../../lib/contacts-api';
import type { StrOption } from '../../../../lib/contacts-api';

/* ─── Address type options ────────────────────────────────────────── */
const ADDRESS_TYPE_OPTIONS = [
  { label: 'Extension', value: 'Extension' },
  { label: 'General',   value: 'General'   },
  { label: 'Home',      value: 'Home'      },
  { label: 'Office',    value: 'Office'    },
  { label: 'Private',   value: 'Private'   },
  { label: 'Public',    value: 'Public'    },
];

/* ─── Props ───────────────────────────────────────────────────────── */
interface AddressSectionProps {
  handler: UseFormReturn<ContactFormPayload>;
  /** Pre-populated country for edit mode */
  defaultCountry?: StrOption;
  /** Pre-populated state for edit mode */
  defaultState?: StrOption;
}

/* ─── Component ───────────────────────────────────────────────────── */
export function AddressSection({
  handler,
  defaultCountry,
  defaultState,
}: AddressSectionProps) {
  const { register, watch, setValue, formState: { errors } } = handler;

  const countryId  = watch('countryId');
  const stateId    = watch('stateId');
  const address1   = watch('address1');
  const addressType = watch('addressType');

  /* Make the state loader re-fetch whenever countryId changes */
  const loadStateOptions = useCallback(
    makeLoadStateOptions(countryId),
    [countryId],
  );

  const defaultAddressType = useMemo(
    () => addressType?.value ? ADDRESS_TYPE_OPTIONS.find((o) => o.value === addressType.value) : undefined,
    [addressType],
  );

  /* Open accordion by default only when the contact already has an address */
  const defaultOpen = !!(address1 ?? defaultCountry);

  return (
    <AppAccordionSection title="Address" defaultOpen={defaultOpen}>
      {/* Apartment / Building */}
      <AppInput
        label="Apartment / Building"
        placeholder="Enter apartment or building name"
        {...register('apartmentBuilding')}
        errorMessage={errors.apartmentBuilding?.message}
      />

      {/* Address lines */}
      <AppInput
        label="Address Line 1"
        placeholder="Enter street address"
        {...register('address1')}
        errorMessage={errors.address1?.message}
      />
      <AppInput
        label="Address Line 2"
        placeholder="Apartment, suite, unit, etc. (optional)"
        {...register('address2')}
        errorMessage={errors.address2?.message}
      />

      {/* Country + State */}
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }}>
        <Box flex={1}>
          <AppAsyncSelect
            label="Country"
            placeholder="Search country…"
            required={!!address1}
            loadOptions={loadCountryOptions}
            defaultAdditional={{ page: 1 }}
            value={countryId ? { label: defaultCountry?.label ?? countryId, value: countryId } : null}
            onChange={(opt) => {
              setValue('countryId', (opt as StrOption | null)?.value ?? '');
              /* Reset state when country changes */
              setValue('stateId', '');
            }}
            errorMessage={errors.countryId?.message}
          />
        </Box>
        <Box flex={1}>
          <AppAsyncSelect
            label="State / Province"
            placeholder={countryId ? 'Search state…' : 'Select country first'}
            required={!!address1 || !!countryId}
            isDisabled={!countryId}
            loadOptions={loadStateOptions}
            defaultAdditional={{ page: 1 }}
            /* Reset the option cache whenever country changes */
            cacheUniqs={[countryId]}
            value={stateId ? { label: defaultState?.label ?? stateId, value: stateId } : null}
            onChange={(opt) =>
              setValue('stateId', (opt as StrOption | null)?.value ?? '')
            }
            errorMessage={errors.stateId?.message}
          />
        </Box>
      </Flex>

      {/* Town / City + Address Type */}
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }}>
        <Box flex={1}>
          <AppInput
            label="Town / City"
            placeholder="Enter town or city"
            {...register('townCity')}
            errorMessage={errors.townCity?.message}
          />
        </Box>
        <Box flex={1}>
          <AppSelect
            label="Address Type"
            placeholder="Select type"
            options={ADDRESS_TYPE_OPTIONS}
            value={defaultAddressType}
            onChange={(opt) =>
              setValue('addressType', opt ? { value: opt.value, label: opt.label } : undefined)
            }
          />
        </Box>
      </Flex>
    </AppAccordionSection>
  );
}
