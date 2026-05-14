import React, { memo } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { type UseFormReturn, Controller } from 'react-hook-form';
import AppInput from 'sharedUi/AppInput';
import AppSelect from 'sharedUi/AppSelect';
import AppAccordionSection from 'sharedUi/AppAccordionSection';
import type { AddProviderPayload } from '../../../../types';
import { BANK_OPTIONS } from '../../../../constants';

interface Props {
  handler: UseFormReturn<AddProviderPayload>;
}

function FinancialDetailsSectionBase({ handler }: Props) {
  const {
    register,
    control,
    formState: { errors },
  } = handler;

  return (
    <AppAccordionSection title="Financial details" defaultOpen>
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
        <Box w={{ base: '100%', md: '50%' }}>
          <AppInput
            label="Account number *"
            placeholder="Enter account number"
            errorMessage={errors.accountNumber?.message}
            {...register('accountNumber')}
          />
        </Box>
        <Box w={{ base: '100%', md: '50%' }}>
          <Controller
            name="bankName"
            control={control}
            render={({ field }) => (
              <AppSelect
                label="Bank Name *"
                placeholder="Select bank"
                options={BANK_OPTIONS}
                value={BANK_OPTIONS.find((o) => o.value === field.value) ?? null}
                onChange={(opt) => field.onChange((opt as { value: string } | null)?.value ?? '')}
                height="4.4rem"
              />
            )}
          />
        </Box>
      </Flex>

      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
        <Box w={{ base: '100%', md: '50%' }}>
          <AppInput
            label="Account name"
            placeholder="Taiwo Aina"
            errorMessage={errors.accountName?.message}
            {...register('accountName')}
          />
        </Box>
        <Box w={{ base: '100%', md: '50%' }}>
          <AppInput
            label="IBAN"
            placeholder="Enter IBAN"
            errorMessage={errors.iban?.message}
            {...register('iban')}
          />
        </Box>
      </Flex>

      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
        <Box w={{ base: '100%', md: '50%' }}>
          <AppInput
            label="SWIFT Code"
            placeholder="Enter SWIFT code"
            errorMessage={errors.swiftCode?.message}
            {...register('swiftCode')}
          />
        </Box>
        <Box w={{ base: '100%', md: '50%' }}>
          <AppInput
            label="Bank address"
            placeholder="Bank address"
            errorMessage={errors.bankAddress?.message}
            {...register('bankAddress')}
          />
        </Box>
      </Flex>
    </AppAccordionSection>
  );
}

export const FinancialDetailsSection = memo(FinancialDetailsSectionBase);
export default FinancialDetailsSection;
