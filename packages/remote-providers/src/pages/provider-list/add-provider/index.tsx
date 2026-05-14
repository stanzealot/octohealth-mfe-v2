import React, { useMemo, useCallback, memo } from 'react';
import { Stack, Flex } from '@chakra-ui/react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import AppBreadcrumb from 'sharedUi/AppBreadcrumb';
import AppButton from 'sharedUi/AppButton';
import { Text, Box } from '@chakra-ui/react';
import type { AddProviderPayload } from '../../../types';
import { getProviderById } from '../../../mock';
import { AddProviderSchema } from '../schemas';
import ProviderInfoSection from './sections/ProviderInfoSection';
import ContactInfoSection from './sections/ContactInfoSection';
import ContractInfoSection from './sections/ContractInfoSection';
import FinancialDetailsSection from './sections/FinancialDetailsSection';

function AddProviderPageBase() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const provider = useMemo(() => (id ? getProviderById(id) : null), [id]);

  const defaultValues = useMemo<AddProviderPayload>(
    () => ({
      providerName: provider?.providerName ?? '',
      providerCode: provider?.masterProviderCode ?? '',
      cacNumber: provider?.cacNumber ?? '',
      providerType: provider
        ? { value: provider.providerType, label: provider.providerType }
        : { value: '', label: '' },
      network: [],
      effectiveDate: provider?.effectiveDate ?? '',
      terminationDate: provider?.terminationDate ?? '',
      longitude: provider?.longitude ?? '',
      latitude: provider?.latitude ?? '',
      partOf: provider
        ? { value: provider.partOf, label: provider.partOf }
        : { value: '', label: '' },
      emailList: provider?.email ? [provider.email] : [],
      phoneList: provider?.phoneNumber ? [provider.phoneNumber] : [],
      address1: provider?.address1 ?? '',
      address2: provider?.address2 ?? '',
      poBox: provider?.poBox ?? '',
      country: provider?.country ?? '',
      state: provider?.state ?? '',
      townCity: provider?.townCity ?? '',
      providerOwnCode: provider?.providerOwnCode === 'YES',
      professionalFee: provider?.professionalFees ?? false,
      professionalFeeValue: provider?.feeValue ?? '',
      cutOffDays: '',
      statementGeneration: '',
      providerPaymentDays: '',
      accountNumber: '',
      bankName: '',
      accountName: '',
      iban: '',
      swiftCode: '',
      bankAddress: '',
    }),
    [provider],
  );

  const formHook = useForm<AddProviderPayload>({
    mode: 'onChange',
    resolver: yupResolver(AddProviderSchema) as Resolver<AddProviderPayload>,
    defaultValues,
  });

  const { handleSubmit } = formHook;

  const onSubmit = useCallback(
    (_data: AddProviderPayload) => {
      navigate(id ? `/providers/provider-list/${id}` : '/providers/provider-list');
    },
    [navigate, id],
  );

  const handleCancel = useCallback(() => {
    navigate(id ? `/providers/provider-list/${id}` : '/providers/provider-list');
  }, [navigate, id]);

  return (
    <Stack gap="2.4rem">
      <AppBreadcrumb
        link={id ? `/providers/provider-list/${id}` : '/providers/provider-list'}
        beforeText={id ? 'View Provider' : 'Providers List'}
        afterText={id ? 'Edit Provider' : 'Add New Provider'}
        onBack={handleCancel}
      />

      <Stack
        bg="var(--surface-card)"
        borderRadius=".8rem"
        gap="4rem"
        px={{ base: '1.6rem', md: '4rem' }}
        py="2.4rem"
        border="1px solid var(--surface-border)"
      >
        <Box>
          <Text
            fontFamily="Montserrat, sans-serif"
            fontSize="1.8rem"
            fontWeight="600"
            color="var(--text-primary)"
          >
            {id ? 'Edit' : 'Add'} provider
          </Text>
          <Text
            fontFamily="Montserrat, sans-serif"
            fontSize="1.4rem"
            color="var(--text-muted)"
            mt="0.4rem"
          >
            Please provide all information about the provider
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="2.4rem">
            <ProviderInfoSection handler={formHook} />
            <ContactInfoSection handler={formHook} />
            <ContractInfoSection handler={formHook} />
            <FinancialDetailsSection handler={formHook} />

            <Flex gap="1.2rem" justify="flex-end" mt="1.6rem">
              <AppButton variant="outline" type="button" onClick={handleCancel} enableRipple>
                Cancel
              </AppButton>
              <AppButton variant="primary" type="submit" enableRipple>
                {id ? 'Update' : 'Save'}
              </AppButton>
            </Flex>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}

export const AddProviderPage = memo(AddProviderPageBase);
export default AddProviderPage;
