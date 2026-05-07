/**
 * add-lead/index.tsx — Create / Edit Lead form
 *
 * Matches the monolith's add-lead/index.tsx exactly:
 *  - react-hook-form with mode:'onChange' (no yup)
 *  - AppSelect Controller fields: needType, source, needMaturity, leadStage, contact
 *  - AppInput for title (required) and entity (optional)
 *  - Green need-type chips shown below needType + contact fields
 *  - Breadcrumb: ← Leads | Add Lead  or  ← View Lead | Edit Lead
 *  - Cancel and Submit buttons flush right
 *  - Responsive 2-column layout on desktop
 */

import React, { useMemo, useCallback, memo } from 'react';
import { Stack, Flex, Box, Text } from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import AppBreadcrumb from 'sharedUi/AppBreadcrumb';
import AppButton    from 'sharedUi/AppButton';
import AppInput     from 'sharedUi/AppInput';
import AppSelect    from 'sharedUi/AppSelect';
import { getLeadById } from '../mock/leads';
import {
  SOURCE_OPTIONS,
  NEED_MATURITY_OPTIONS,
  LEAD_STAGE_OPTIONS,
  NEED_TYPE_OPTIONS,
  CONTACT_OPTIONS,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
} from '../constants';
import type { NewLeadPayload } from '../types';

/* ─── Component ──────────────────────────────────────────────────── */

function AddLeadPageBase() {
  const { id }   = useParams<{ id?: string }>();
  const navigate = useNavigate();

  /* Load existing lead for edit mode */
  const existingLead = useMemo(() => (id ? getLeadById(id) : null), [id]);

  const defaultValues = useMemo<NewLeadPayload>(
    () =>
      existingLead
        ? {
            title:        existingLead.title,
            needType:     existingLead.needType,
            source:       existingLead.source,
            needMaturity: existingLead.needMaturity,
            leadStage:    existingLead.leadStage,
            contact:      existingLead.contact,
            entity:       existingLead.entity,
          }
        : {
            title:        '',
            needType:     [],
            source:       '',
            needMaturity: '',
            leadStage:    '',
            contact:      '',
            entity:       '',
          },
    [existingLead],
  );

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm<NewLeadPayload>({ mode: 'onChange', defaultValues });

  const watchedNeedType = watch('needType');

  const onSubmit = useCallback(
    (_data: NewLeadPayload) => {
      // TODO: replace with API call
      navigate('/crm/leads');
    },
    [navigate],
  );

  const handleCancel = useCallback(() => {
    navigate(id ? `/crm/leads/${id}` : '/crm/leads');
  }, [navigate, id]);

  const breadcrumbLink = id ? `/crm/leads/${id}` : '/crm/leads';

  return (
    <Stack gap="2.4rem">
      {/* Breadcrumb */}
      <AppBreadcrumb
        link={breadcrumbLink}
        beforeText={id ? 'View Lead' : 'Leads'}
        afterText={id ? 'Edit Lead' : 'Add Lead'}
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
        {/* Section heading */}
        <Box>
          <Text
            fontFamily="Montserrat, sans-serif"
            fontSize="1.8rem"
            fontWeight="600"
            color="var(--text-primary)"
          >
            Lead details
          </Text>
          <Text
            fontFamily="Montserrat, sans-serif"
            fontSize="1.4rem"
            color="var(--text-muted)"
            mt="0.4rem"
          >
            Please provide all information about the lead
          </Text>
        </Box>

        {/* Form */}
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="2.4rem" w="100%">

            {/* Lead Title — full width */}
            <AppInput
              label={FORM_LABELS.LEAD_TITLE}
              placeholder={FORM_PLACEHOLDERS.TITLE}
              errorMessage={errors.title?.message}
              required
              {...register('title', { required: 'Lead title is required' })}
            />

            {/* Row 1: Need Type + Source */}
            <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
              <Box w={{ base: '100%', md: '50%' }}>
                <Controller
                  name="needType"
                  control={control}
                  rules={{ required: 'Need type is required' }}
                  render={({ field }) => (
                    <AppSelect
                      options={NEED_TYPE_OPTIONS}
                      placeholder={FORM_PLACEHOLDERS.NEED_TYPE}
                      label={FORM_LABELS.NEED_TYPE}
                      errorMessage={errors.needType?.message}
                      value={NEED_TYPE_OPTIONS.find((opt) =>
                        (field.value as string[])?.includes(opt.value),
                      ) ?? null}
                      onChange={(opt) => {
                        const v = opt as { value: string } | null;
                        field.onChange(v ? [v.value] : []);
                      }}
                      height="4.8rem"
                    />
                  )}
                />
                {/* Need-type chips */}
                {watchedNeedType && watchedNeedType.length > 0 && (
                  <Flex gap="0.8rem" mt="0.8rem" wrap="wrap">
                    {watchedNeedType.map((type, i) => (
                      <Box
                        key={i}
                        bg="rgba(18,183,106,0.12)"
                        color="var(--status-success)"
                        px="0.8rem"
                        py="0.4rem"
                        borderRadius="4px"
                        fontSize="1.2rem"
                        fontFamily="Montserrat, sans-serif"
                        fontWeight="500"
                      >
                        {type}
                      </Box>
                    ))}
                  </Flex>
                )}
              </Box>

              <Box w={{ base: '100%', md: '50%' }}>
                <Controller
                  name="source"
                  control={control}
                  rules={{ required: 'Source is required' }}
                  render={({ field }) => (
                    <AppSelect
                      options={SOURCE_OPTIONS}
                      placeholder={FORM_PLACEHOLDERS.SOURCE}
                      label={FORM_LABELS.SOURCE}
                      errorMessage={errors.source?.message}
                      value={SOURCE_OPTIONS.find((opt) => opt.value === field.value) ?? null}
                      onChange={(opt) => {
                        const v = opt as { value: string } | null;
                        field.onChange(v?.value ?? '');
                      }}
                      height="4.8rem"
                    />
                  )}
                />
              </Box>
            </Flex>

            {/* Row 2: Need Maturity + Lead Stage */}
            <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
              <Box w={{ base: '100%', md: '50%' }}>
                <Controller
                  name="needMaturity"
                  control={control}
                  rules={{ required: 'Need maturity is required' }}
                  render={({ field }) => (
                    <AppSelect
                      options={NEED_MATURITY_OPTIONS}
                      placeholder={FORM_PLACEHOLDERS.NEED_MATURITY}
                      label={FORM_LABELS.NEED_MATURITY}
                      errorMessage={errors.needMaturity?.message}
                      value={NEED_MATURITY_OPTIONS.find((opt) => opt.value === field.value) ?? null}
                      onChange={(opt) => {
                        const v = opt as { value: string } | null;
                        field.onChange(v?.value ?? '');
                      }}
                      height="4.8rem"
                    />
                  )}
                />
              </Box>

              <Box w={{ base: '100%', md: '50%' }}>
                <Controller
                  name="leadStage"
                  control={control}
                  rules={{ required: 'Lead stage is required' }}
                  render={({ field }) => (
                    <AppSelect
                      options={LEAD_STAGE_OPTIONS}
                      placeholder={FORM_PLACEHOLDERS.LEAD_STAGE}
                      label={FORM_LABELS.LEAD_STAGE}
                      errorMessage={errors.leadStage?.message}
                      value={LEAD_STAGE_OPTIONS.find((opt) => opt.value === field.value) ?? null}
                      onChange={(opt) => {
                        const v = opt as { value: string } | null;
                        field.onChange(v?.value ?? '');
                      }}
                      height="4.8rem"
                    />
                  )}
                />
              </Box>
            </Flex>

            {/* Row 3: Contact + Entity */}
            <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
              <Box w={{ base: '100%', md: '50%' }}>
                <Controller
                  name="contact"
                  control={control}
                  rules={{ required: 'Contact is required' }}
                  render={({ field }) => (
                    <AppSelect
                      options={CONTACT_OPTIONS}
                      placeholder={FORM_PLACEHOLDERS.CONTACT}
                      label={FORM_LABELS.CONTACT}
                      errorMessage={errors.contact?.message}
                      value={CONTACT_OPTIONS.find((opt) => opt.value === field.value) ?? null}
                      onChange={(opt) => {
                        const v = opt as { value: string } | null;
                        field.onChange(v?.value ?? '');
                      }}
                      height="4.8rem"
                    />
                  )}
                />
                {/* Contact chip (matches monolith) */}
                {watchedNeedType && watchedNeedType.length > 0 && (
                  <Flex gap="0.8rem" mt="0.8rem" wrap="wrap">
                    <Box
                      bg="rgba(18,183,106,0.12)"
                      color="var(--status-success)"
                      px="0.8rem"
                      py="0.4rem"
                      borderRadius="4px"
                      fontSize="1.2rem"
                      fontFamily="Montserrat, sans-serif"
                      fontWeight="500"
                    >
                      Jade Jackson - 090873645
                    </Box>
                  </Flex>
                )}
              </Box>

              <Box w={{ base: '100%', md: '50%' }}>
                <AppInput
                  label={FORM_LABELS.ENTITY}
                  placeholder={FORM_PLACEHOLDERS.ENTITY}
                  errorMessage={errors.entity?.message}
                  {...register('entity')}
                />
              </Box>
            </Flex>

            {/* Form actions */}
            <Flex gap="1.2rem" justify="flex-end" mt="1.6rem">
              <AppButton variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </AppButton>
              <AppButton variant="primary" type="submit">
                {id ? 'Update' : 'Add'} lead
              </AppButton>
            </Flex>

          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}

export const AddLeadPage = memo(AddLeadPageBase);
export default AddLeadPage;
