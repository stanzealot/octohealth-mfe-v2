import React, { memo } from 'react';
import { Flex } from '@chakra-ui/react';
import { UseFormReturn, Controller } from 'react-hook-form';
import AppAccordionSection from 'sharedUi/AppAccordionSection';
import AppInput from 'sharedUi/AppInput';
import AppSelect from 'sharedUi/AppSelect';
import {
  industryOptions,
  categoryOptions,
  legalEntityOptions,
  countryOptions,
  stateOptions,
  cityOptions,
} from '../constants';
import type { NewEntityPayload } from '../types';

interface Props {
  form: UseFormReturn<NewEntityPayload>;
}

const Row = ({ children }: { children: React.ReactNode }) => (
  <Flex gap="2rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
    {children}
  </Flex>
);

export const EntityDetailsSection = memo(function EntityDetailsSection({ form }: Props) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;

  return (
    <AppAccordionSection title="Entity details">
      <Flex direction="column" gap="2rem">
        {}
        <Row>
          <AppInput
            label="Name"
            placeholder="Enter company name"
            errorMessage={errors.name?.message}
            {...register('name')}
          />
          <Controller
            name="providerType"
            control={control}
            render={({ field }) => (
              <AppSelect
                options={industryOptions}
                placeholder="Select Industry"
                label="Industry"
                value={industryOptions.find((o) => o.value === field.value) ?? null}
                onChange={(opt) => field.onChange((opt as { value: string } | null)?.value ?? '')}
                height="4.8rem"
              />
            )}
          />
          <Controller
            name="claimType"
            control={control}
            render={({ field }) => (
              <AppSelect
                options={categoryOptions}
                placeholder="Select category"
                label="Category"
                value={categoryOptions.find((o) => o.value === field.value) ?? null}
                onChange={(opt) => field.onChange((opt as { value: string } | null)?.value ?? '')}
                height="4.8rem"
              />
            )}
          />
        </Row>

        {}
        <Row>
          <AppInput
            label="No of employees"
            placeholder="Enter number"
            type="number"
            errorMessage={errors.phone?.message}
            {...register('phone')}
          />
          <Controller
            name="network"
            control={control}
            render={({ field }) => (
              <AppSelect
                options={legalEntityOptions}
                placeholder="Select"
                label="Legal entity type"
                value={legalEntityOptions.find((o) => field.value?.includes(o.value)) ?? null}
                onChange={(opt) =>
                  setValue(
                    'network',
                    (opt as { value: string } | null)?.value
                      ? [(opt as { value: string }).value]
                      : [],
                  )
                }
                height="4.8rem"
              />
            )}
          />
          <AppInput
            label="Annual revenue"
            placeholder="Enter amount"
            type="number"
            errorMessage={errors.feeValue?.message}
            {...register('feeValue')}
          />
        </Row>

        {}
        <Row>
          <AppInput
            label="CAC Number"
            placeholder="Enter CAC No"
            errorMessage={errors.cac?.message}
            {...register('cac')}
          />
          <AppInput
            label="Entity ID"
            placeholder="Enter ID"
            errorMessage={errors.providerCode?.message}
            {...register('providerCode')}
          />
        </Row>

        {}
        <Row>
          <AppInput
            label="Phone numbers"
            placeholder="Enter phone number"
            errorMessage={errors.phone?.message}
            {...register('phone')}
          />
          <AppInput
            label="Email"
            placeholder="Enter email"
            type="email"
            errorMessage={errors.email?.message}
            {...register('email')}
          />
        </Row>

        {}
        <Row>
          <AppInput
            label="Lead ID"
            placeholder="Enter ID"
            errorMessage={errors.longitude?.message}
            {...register('longitude')}
          />
          <AppInput
            label="Owner ID"
            placeholder="Enter ID"
            errorMessage={errors.latitude?.message}
            {...register('latitude')}
          />
        </Row>

        {}
        <AppInput
          label="Address"
          placeholder="Add Address"
          errorMessage={errors.address?.message}
          {...register('address')}
        />

        {}
        <Row>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <AppSelect
                options={countryOptions}
                placeholder="Select"
                label="Country *"
                value={countryOptions.find((o) => o.value === field.value) ?? null}
                onChange={(opt) => field.onChange((opt as { value: string } | null)?.value ?? '')}
                height="4.8rem"
              />
            )}
          />
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <AppSelect
                options={stateOptions}
                placeholder="Select"
                label="State *"
                value={stateOptions.find((o) => o.value === field.value) ?? null}
                onChange={(opt) => field.onChange((opt as { value: string } | null)?.value ?? '')}
                height="4.8rem"
              />
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <AppSelect
                options={cityOptions}
                placeholder="Select"
                label="City *"
                value={cityOptions.find((o) => o.value === field.value) ?? null}
                onChange={(opt) => field.onChange((opt as { value: string } | null)?.value ?? '')}
                height="4.8rem"
              />
            )}
          />
        </Row>

        {}
        <Row>
          <AppInput
            label="Website"
            placeholder="Enter website"
            errorMessage={errors.website?.message}
            {...register('website')}
          />
          <AppInput
            label="Social media"
            placeholder="Enter social handle"
            errorMessage={errors.socialMedia?.message}
            {...register('socialMedia')}
          />
        </Row>
      </Flex>
    </AppAccordionSection>
  );
});

export default EntityDetailsSection;
