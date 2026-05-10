import React, { memo, useCallback } from 'react';
import { Stack, Flex, Box, Text } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import AppBreadcrumb from 'sharedUi/AppBreadcrumb';
import AppButton from 'sharedUi/AppButton';
import EntityDetailsSection from './EntityDetailsSection';
import AddressTabs from './AddressTabs';
import type { NewEntityPayload } from '../types';

function AddCompanyPageBase() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const form = useForm<NewEntityPayload>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
      country: 'Nigeria',
      state: '',
      city: '',
      zipCode: '',
      cac: '',
      providerCode: '',
      longitude: '',
      latitude: '',
      providerType: '',
      claimType: '',
      network: [],
      feeValue: 0,
      website: '',
      socialMedia: '',
    },
  });

  const onSubmit = useCallback(
    (_data: NewEntityPayload) => {
      navigate('/crm/companies');
    },
    [navigate],
  );

  const handleCancel = useCallback(() => {
    navigate(id ? `/crm/companies/${id}` : '/crm/companies');
  }, [navigate, id]);

  const breadcrumbLink = id ? `/crm/companies/${id}` : '/crm/companies';

  return (
    <Stack gap="2.4rem">
      <AppBreadcrumb
        link={breadcrumbLink}
        beforeText={id ? 'View Entity' : 'Entities'}
        afterText={id ? 'Edit Entity' : 'Add Entity'}
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
            {id ? 'Edit Entity' : 'Add an Entity'}
          </Text>
          <Text
            fontFamily="Montserrat, sans-serif"
            fontSize="1.4rem"
            color="var(--text-muted)"
            mt="0.4rem"
          >
            Please provide all information about the company
          </Text>
        </Box>

        <Box as="form" onSubmit={form.handleSubmit(onSubmit)}>
          <Stack gap="3.2rem">
            <EntityDetailsSection form={form} />
            <AddressTabs />

            <Flex gap="1.2rem" justify="flex-end" mt="1.6rem">
              <AppButton variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </AppButton>
              <AppButton variant="primary" type="submit">
                {id ? 'Update' : 'Add'} Entity
              </AppButton>
            </Flex>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}

export const AddCompanyPage = memo(AddCompanyPageBase);
export default AddCompanyPage;
