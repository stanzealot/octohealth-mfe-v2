/**
 * BasicSection.tsx
 *
 * Accordion section for personal information:
 *   NIN · Prefix · First/Last · Maiden/Former · DOB · Gender
 *   Email tags · Phone tags · Religion · Contact modes
 *   Photo · Handle with Care
 */
import React, { useMemo, useCallback } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import type { UseFormReturn } from 'react-hook-form';
import AppAccordionSection from 'sharedUi/AppAccordionSection';
import { AdvancedButton } from 'sharedUi/AppButton';
import AppInput from 'sharedUi/AppInput';
import AppSelect from 'sharedUi/AppSelect';
import AppDatePicker from 'sharedUi/AppDatePicker';
import AppCheckbox from 'sharedUi/AppCheckbox';
import AppImageInput from 'sharedUi/AppImageInput';
import AppTextTagInput from 'sharedUi/AppTextTagInput';
import AppMultiPhoneInput from 'sharedUi/AppMultiPhoneInput';
import type { ContactFormPayload } from '../schema';
import { ContactMode } from '../../../../types/contact';

/* ─── Static option lists ─────────────────────────────────────────── */
const GENDER_OPTIONS = [
  { label: 'Male',   value: 'Male'   },
  { label: 'Female', value: 'Female' },
];

const TITLE_OPTIONS = [
  { label: 'Mr.',    value: 'Mr.'    },
  { label: 'Mrs.',   value: 'Mrs.'   },
  { label: 'Ms.',    value: 'Ms.'    },
  { label: 'Dr.',    value: 'Dr.'    },
  { label: 'Prof.',  value: 'Prof.'  },
  { label: 'Rev.',   value: 'Rev.'   },
  { label: 'Chief',  value: 'Chief'  },
  { label: 'Alhaji', value: 'Alhaji' },
];

const RELIGION_OPTIONS = [
  { label: 'Christianity',                  value: '61744660-18b9-4090-ab86-a840d7f812b6' },
  { label: 'Muslim',                        value: '84d453f3-5ea9-4b53-a447-68ad52016df0' },
  { label: 'Atheist',                       value: 'd679ab54-d7d2-4718-aad3-35f218bb177c' },
  { label: 'Christianity – Jehovah Witness',value: 'b20a0ea6-1a57-463e-b87d-e4e36f75331e' },
  { label: 'Other',                         value: '76dd9369-2b0c-4230-9c61-f2461e3d7b3d' },
];

/* ─── Props ───────────────────────────────────────────────────────── */
interface BasicSectionProps {
  handler: UseFormReturn<ContactFormPayload>;
}

/* ─── Component ───────────────────────────────────────────────────── */
export function BasicSection({ handler }: BasicSectionProps) {
  const { register, watch, setValue, formState: { errors } } = handler;

  const handleWithCare = watch('handleWithCare') ?? false;
  const contactModes   = watch('contactModes') ?? [];
  const religion       = watch('religion');
  const gender         = watch('gender');
  const prefix         = watch('prefix');

  /* Memoised default values for controlled selects */
  const defaultReligion = useMemo(
    () => religion?.value ? { label: religion.label ?? '', value: religion.value } : undefined,
    [religion],
  );

  const defaultGender = useMemo(
    () => gender ? GENDER_OPTIONS.find((o) => o.value === gender) : undefined,
    [gender],
  );

  const defaultPrefix = useMemo(
    () => prefix ? TITLE_OPTIONS.find((o) => o.value === prefix) : undefined,
    [prefix],
  );

  const toggleMode = useCallback(
    (mode: ContactMode) => {
      const current = contactModes as string[];
      setValue(
        'contactModes',
        current.includes(mode)
          ? current.filter((m) => m !== mode)
          : [...current, mode],
      );
    },
    [contactModes, setValue],
  );

  return (
    <AppAccordionSection title="Basic Information" defaultOpen>
      {/* Row 1 — NIN + Prefix */}
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-end">
        <Flex gap="1.2rem" align="flex-end" flex={1}>
          <Box flex={1}>
            <AppInput
              label="NIN"
              placeholder="12345678901"
              type="text"
              {...register('nin')}
              errorMessage={errors.nin?.message}
            />
          </Box>
          <AdvancedButton variant="outline" h="4.4rem" style={{ flexShrink: 0 }}>
            Get Details
          </AdvancedButton>
        </Flex>

        <Box flex={1}>
          <AppSelect
            label="Prefix / Title"
            placeholder="Select title"
            options={TITLE_OPTIONS}
            value={defaultPrefix}
            onChange={(opt) => setValue('prefix', opt?.value ?? '')}
          />
        </Box>
      </Flex>

      {/* Row 2 — First + Last */}
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }}>
        <Box flex={1}>
          <AppInput
            label="First Name"
            placeholder="Enter first name"
            required
            {...register('firstName')}
            errorMessage={errors.firstName?.message}
          />
        </Box>
        <Box flex={1}>
          <AppInput
            label="Last Name"
            placeholder="Enter last name"
            required
            {...register('lastName')}
            errorMessage={errors.lastName?.message}
          />
        </Box>
      </Flex>

      {/* Row 3 — Maiden + Former */}
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }}>
        <Box flex={1}>
          <AppInput
            label="Maiden Name"
            placeholder="Enter maiden name"
            {...register('maidenName')}
            errorMessage={errors.maidenName?.message}
          />
        </Box>
        <Box flex={1}>
          <AppInput
            label="Former Names"
            placeholder="Enter former names"
            {...register('formerNames')}
            errorMessage={errors.formerNames?.message}
          />
        </Box>
      </Flex>

      {/* Row 4 — DOB + Gender */}
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }}>
        <Box flex={1}>
          <AppDatePicker
            handler={handler}
            title="dateOfBirth"
            label="Date of Birth"
            placeholder="DD/MM/YYYY"
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            required
            errorMessage={errors.dateOfBirth?.message}
          />
        </Box>
        <Box flex={1}>
          <AppSelect
            label="Gender"
            placeholder="Select gender"
            options={GENDER_OPTIONS}
            value={defaultGender}
            onChange={(opt) => setValue('gender', opt?.value as 'Male' | 'Female')}
            errorMessage={errors.gender?.message}
          />
        </Box>
      </Flex>

      {/* Row 5 — Email tags + Phone tags */}
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }}>
        <Box flex={1}>
          <AppTextTagInput
            handler={handler}
            title="email"
            listName="tagList"
            label="Email Addresses"
            placeholder="Enter email and press Enter or ','"
            tagPlacement="bottom"
          />
        </Box>
        <Box flex={1}>
          <AppMultiPhoneInput
            handler={handler}
            title="phone"
            listName="phoneList"
            label="Mobile Numbers"
            placeholder="+234 800 000 0000"
            tagPlacement="bottom"
          />
        </Box>
      </Flex>

      {/* Row 6 — Religion + Contact modes */}
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
        <Box flex={1}>
          <AppSelect
            label="Religion"
            placeholder="Select religion"
            options={RELIGION_OPTIONS}
            value={defaultReligion}
            onChange={(opt) =>
              setValue('religion', opt ? { value: opt.value, label: opt.label } : undefined)
            }
          />
        </Box>

        <Flex direction="column" gap="0.8rem" flex={1} minH="7.5rem" justify="space-between">
          <Text
            fontSize="1.4rem"
            fontWeight="500"
            fontFamily="Montserrat, sans-serif"
            color="var(--text-secondary)"
          >
            Communication Preference
          </Text>
          <Flex gap="2rem" flexWrap="wrap">
            {[ContactMode.Sms, ContactMode.Email, ContactMode.WhatsApp, ContactMode.Telephone].map((mode) => (
              <AppCheckbox
                key={mode}
                size="sm"
                label={mode === ContactMode.Sms ? 'SMS' : mode}
                checked={(contactModes as string[]).includes(mode)}
                onChange={() => toggleMode(mode)}
              />
            ))}
          </Flex>
        </Flex>
      </Flex>

      {/* Row 7 — Photo + Handle with Care */}
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
        <Box flex={1}>
          <AppImageInput handler={handler} title="photo" label="Photo" />
        </Box>

        <Flex direction="column" gap="0.8rem" flex={1} minH="7.5rem" justify="space-between">
          <Text
            fontSize="1.4rem"
            fontWeight="500"
            fontFamily="Montserrat, sans-serif"
            color="var(--text-secondary)"
          >
            Handle with Care
          </Text>
          <Flex gap="2rem">
            <AppCheckbox
              size="sm"
              label="Yes"
              checked={handleWithCare === true}
              onChange={() => setValue('handleWithCare', true)}
            />
            <AppCheckbox
              size="sm"
              label="No"
              checked={handleWithCare === false}
              onChange={() => setValue('handleWithCare', false)}
            />
          </Flex>
        </Flex>
      </Flex>
    </AppAccordionSection>
  );
}
