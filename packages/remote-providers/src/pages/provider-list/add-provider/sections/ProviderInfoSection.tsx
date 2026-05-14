import React, { useMemo, memo } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { type UseFormReturn, Controller } from 'react-hook-form';
import AppInput from 'sharedUi/AppInput';
import AppSelect from 'sharedUi/AppSelect';
import AppDatePicker from 'sharedUi/AppDatePicker';
import AppAccordionSection from 'sharedUi/AppAccordionSection';
import type { AddProviderPayload } from '../../../../types';
import { PROVIDER_TYPE_OPTIONS, PART_OF_OPTIONS, NETWORK_OPTIONS } from '../../../../constants';

interface Props {
  handler: UseFormReturn<AddProviderPayload>;
}

function ProviderInfoSectionBase({ handler }: Props) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = handler;

  const networkVal = watch('network');

  const networkValue = useMemo(
    () => NETWORK_OPTIONS.filter((opt) => networkVal?.includes(opt.value)),
    [networkVal],
  );

  return (
    <AppAccordionSection title="Provider Info" defaultOpen>
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
        <Box w={{ base: '100%', md: '50%' }}>
          <AppInput
            label="Provider name *"
            placeholder="Enter name"
            errorMessage={errors.providerName?.message}
            {...register('providerName')}
          />
        </Box>
        <Box w={{ base: '100%', md: '50%' }}>
          <Controller
            name="partOf"
            control={control}
            render={({ field }) => (
              <AppSelect
                label="Part of *"
                placeholder="Select type"
                options={PART_OF_OPTIONS}
                value={PART_OF_OPTIONS.find((o) => o.value === field.value?.value) ?? null}
                onChange={(opt) => {
                  const v = opt as { value: string; label: string } | null;
                  field.onChange(v ?? { value: '', label: '' });
                }}
                errorMessage={errors.partOf?.value?.message}
                height="4.4rem"
              />
            )}
          />
        </Box>
      </Flex>

      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
        <Box w={{ base: '100%', md: '50%' }}>
          <AppInput
            label="Provider code *"
            placeholder="5478645"
            errorMessage={errors.providerCode?.message}
            {...register('providerCode')}
          />
        </Box>
        <Box w={{ base: '100%', md: '50%' }}>
          <Controller
            name="providerType"
            control={control}
            render={({ field }) => (
              <AppSelect
                label="Provider Type *"
                placeholder="Select provider type"
                options={PROVIDER_TYPE_OPTIONS}
                value={PROVIDER_TYPE_OPTIONS.find((o) => o.value === field.value?.value) ?? null}
                onChange={(opt) => {
                  const v = opt as { value: string; label: string } | null;
                  field.onChange(v ?? { value: '', label: '' });
                }}
                errorMessage={errors.providerType?.value?.message}
                height="4.4rem"
              />
            )}
          />
        </Box>
      </Flex>

      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
        <Box w={{ base: '100%', md: '50%' }}>
          <AppInput
            label="CAC Number *"
            placeholder="Enter CAC No"
            errorMessage={errors.cacNumber?.message}
            {...register('cacNumber')}
          />
        </Box>
        <Box w={{ base: '100%', md: '50%' }}>
          <Controller
            name="network"
            control={control}
            render={({ field }) => (
              <AppSelect
                label="Network *"
                placeholder="Select Network"
                options={NETWORK_OPTIONS}
                isMulti
                value={networkValue}
                onChange={(opts) => {
                  const selected = (opts as { value: string; label: string }[]) ?? [];
                  field.onChange(selected.map((o) => o.value));
                }}
                errorMessage={errors.network?.message}
                height="4.4rem"
              />
            )}
          />
        </Box>
      </Flex>

      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
        <Box w={{ base: '100%', md: '50%' }}>
          <AppDatePicker
            handler={handler}
            title="effectiveDate"
            label="Effective Date *"
            placeholder="DD/MM/YYYY"
            errorMessage={errors.effectiveDate?.message}
          />
        </Box>
        <Box w={{ base: '100%', md: '50%' }}>
          <AppDatePicker
            handler={handler}
            title="terminationDate"
            label="Termination Date *"
            placeholder="DD/MM/YYYY"
            errorMessage={errors.terminationDate?.message}
          />
        </Box>
      </Flex>

      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
        <Box w={{ base: '100%', md: '50%' }}>
          <AppInput
            label="Longitude"
            placeholder="Enter longitude"
            errorMessage={errors.longitude?.message}
            {...register('longitude')}
          />
        </Box>
        <Box w={{ base: '100%', md: '50%' }}>
          <AppInput
            label="Latitude"
            placeholder="Enter latitude"
            errorMessage={errors.latitude?.message}
            {...register('latitude')}
          />
        </Box>
      </Flex>
    </AppAccordionSection>
  );
}

export const ProviderInfoSection = memo(ProviderInfoSectionBase);
export default ProviderInfoSection;
