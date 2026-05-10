import React, { memo, useCallback } from 'react';
import { Stack, Flex, Box, Text } from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import AppButton from 'sharedUi/AppButton';
import AppInput from 'sharedUi/AppInput';
import AppSelect from 'sharedUi/AppSelect';
import AppBreadcrumb from 'sharedUi/AppBreadcrumb';
import AppDatePicker from 'sharedUi/AppDatePicker';

import { getOpportunityById } from '../mock/opportunities';
import { OPPORTUNITY_STAGES, SOURCE_OPTIONS, PRIORITY_OPTIONS } from '../constants';
import type { NewOpportunityPayload } from '../types';

const Row = ({ children }: { children: React.ReactNode }) => (
  <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
    {children}
  </Flex>
);

function AddOpportunityPageBase() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const existing = id ? getOpportunityById(id) : null;

  const form = useForm<NewOpportunityPayload>({
    mode: 'onChange',
    defaultValues: existing
      ? {
          title: existing.title,
          description: existing.description,
          stage: existing.stage,
          value: existing.value,
          source: existing.source,
          priority: existing.priority,
          contactPerson: existing.contactPerson,
          company: existing.company,
          closeDate: existing.closeDate ?? '',
          probability: existing.probability,
        }
      : {
          title: '',
          description: '',
          stage: '',
          value: 0,
          source: '',
          priority: '',
          contactPerson: '',
          company: '',
          closeDate: '',
          probability: 0,
        },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = useCallback(
    (_data: NewOpportunityPayload) => {
      navigate('/sales/opportunities');
    },
    [navigate],
  );

  const handleCancel = useCallback(() => {
    navigate(id ? `/sales/opportunities/${id}` : '/sales/opportunities');
  }, [navigate, id]);

  const breadcrumbLink = id ? `/sales/opportunities/${id}` : '/sales/opportunities';

  return (
    <Stack gap="2.4rem">
      <AppBreadcrumb
        link={breadcrumbLink}
        beforeText={id ? 'View Opportunity' : 'Opportunities'}
        afterText={id ? 'Edit Opportunity' : 'Add Opportunity'}
        onBack={handleCancel}
      />

      <Stack
        bg="var(--surface-card)"
        borderRadius=".8rem"
        gap="3.2rem"
        px={{ base: '1.6rem', md: '4rem' }}
        py="2.4rem"
        border="1px solid var(--surface-border)"
      >
        {}
        <Box>
          <Text
            fontFamily="Montserrat, sans-serif"
            fontSize="2rem"
            fontWeight="600"
            color="var(--text-primary)"
          >
            {id ? 'Edit Opportunity' : 'Opportunity details'}
          </Text>
          <Text
            fontFamily="Montserrat, sans-serif"
            fontSize="1.4rem"
            color="var(--text-muted)"
            mt="0.4rem"
          >
            Please provide all information about the opportunity
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="2.4rem">
            {}
            <AppInput
              label="Opportunity title *"
              placeholder="Enter title"
              errorMessage={errors.title?.message}
              {...register('title', { required: 'Title is required' })}
            />

            {}
            <AppInput
              label="Description"
              placeholder="Enter description"
              errorMessage={errors.description?.message}
              {...register('description')}
            />

            {}
            <Row>
              <Controller
                name="stage"
                control={control}
                rules={{ required: 'Stage is required' }}
                render={({ field }) => (
                  <AppSelect
                    options={OPPORTUNITY_STAGES}
                    placeholder="Select stage"
                    label="Stage *"
                    value={OPPORTUNITY_STAGES.find((o) => o.value === field.value) ?? null}
                    onChange={(opt) =>
                      field.onChange((opt as { value: string } | null)?.value ?? '')
                    }
                    height="4.8rem"
                  />
                )}
              />
              <Controller
                name="source"
                control={control}
                rules={{ required: 'Source is required' }}
                render={({ field }) => (
                  <AppSelect
                    options={SOURCE_OPTIONS}
                    placeholder="Select source"
                    label="Source *"
                    value={SOURCE_OPTIONS.find((o) => o.value === field.value) ?? null}
                    onChange={(opt) =>
                      field.onChange((opt as { value: string } | null)?.value ?? '')
                    }
                    height="4.8rem"
                  />
                )}
              />
            </Row>

            {}
            <Row>
              <AppInput
                label="Value *"
                placeholder="Enter value"
                type="number"
                errorMessage={errors.value?.message}
                {...register('value', { min: { value: 0, message: 'Must be positive' } })}
              />
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <AppSelect
                    options={PRIORITY_OPTIONS}
                    placeholder="Select priority"
                    label="Priority"
                    value={PRIORITY_OPTIONS.find((o) => o.value === field.value) ?? null}
                    onChange={(opt) =>
                      field.onChange((opt as { value: string } | null)?.value ?? '')
                    }
                    height="4.8rem"
                  />
                )}
              />
            </Row>

            {}
            <Row>
              <AppInput
                label="Contact Person *"
                placeholder="Enter contact person"
                errorMessage={errors.contactPerson?.message}
                {...register('contactPerson', { required: 'Contact person is required' })}
              />
              <AppInput
                label="Company *"
                placeholder="Enter company"
                errorMessage={errors.company?.message}
                {...register('company', { required: 'Company is required' })}
              />
            </Row>

            {}
            <Row>
              <Controller
                name="closeDate"
                control={control}
                render={({ field }) => (
                  <AppDatePicker
                    label="Close Date"
                    placeholder="Select date"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) =>
                      field.onChange(date ? date.toISOString().split('T')[0] : '')
                    }
                  />
                )}
              />
              <AppInput
                label="Probability (%)"
                placeholder="Enter probability"
                type="number"
                errorMessage={errors.probability?.message}
                {...register('probability', {
                  min: { value: 0, message: 'Min 0' },
                  max: { value: 100, message: 'Max 100' },
                })}
              />
            </Row>

            {}
            <Flex gap="1.2rem" justify="flex-end" mt="1.6rem">
              <AppButton variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </AppButton>
              <AppButton variant="primary" type="submit">
                {id ? 'Update' : 'Add'} opportunity
              </AppButton>
            </Flex>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}

export const AddOpportunityPage = memo(AddOpportunityPageBase);
export default AddOpportunityPage;
