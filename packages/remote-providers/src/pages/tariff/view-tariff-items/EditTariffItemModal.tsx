import React, { memo, useEffect } from 'react';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { X } from 'lucide-react';
import * as yup from 'yup';
import type { EditTariffItemFormData, TariffItem } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppInput = React.lazy(() => import('sharedUi/AppInput')) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppButton = React.lazy(() => import('sharedUi/AppButton')) as any;

const editTariffItemSchema = yup.object({
  itemCode: yup.string().required('Item code is required'),
  providerItemCode: yup.string().required("Provider's item code is required"),
  itemDescription: yup.string().required('Item description is required'),
  providerItemDescription: yup.string().required("Provider's item description is required"),
  providerAmount: yup.string().required('Provider amount is required'),
});

interface EditTariffItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditTariffItemFormData) => void;
  item: TariffItem | null;
}

function EditTariffItemModalBase({ isOpen, onClose, onSave, item }: EditTariffItemModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTariffItemFormData>({
    resolver: yupResolver(editTariffItemSchema) as Resolver<EditTariffItemFormData>,
    defaultValues: {
      itemCode: '',
      providerItemCode: '',
      itemDescription: '',
      providerItemDescription: '',
      providerAmount: '',
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        itemCode: item.itemCode,
        providerItemCode: item.providerItemCode,
        itemDescription: item.itemDescription,
        providerItemDescription: item.providerItemDescription,
        providerAmount: item.providerAmount,
      });
    } else {
      reset({
        itemCode: '',
        providerItemCode: '',
        itemDescription: '',
        providerItemDescription: '',
        providerAmount: '',
      });
    }
  }, [item, reset, isOpen]);

  const onSubmit = (data: EditTariffItemFormData) => {
    onSave(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0,0,0,0.5)"
        zIndex={1400}
        onClick={handleClose}
      />

      {/* Modal */}
      <Flex
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        align="center"
        justify="center"
        zIndex={1500}
        pointerEvents="none"
      >
        <Box
          bg="var(--surface-card)"
          borderRadius="12px"
          width="500px"
          maxW="90vw"
          maxH="90vh"
          overflowY="auto"
          boxShadow="0px 20px 24px -4px rgba(16,24,40,0.08), 0px 8px 8px -4px rgba(16,24,40,0.03)"
          pointerEvents="auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <Flex
            p="2rem 2.4rem"
            borderBottom="1px solid var(--surface-border)"
            align="center"
            justify="space-between"
            position="sticky"
            top={0}
            bg="var(--surface-card)"
            zIndex={1}
          >
            <Text
              fontSize="1.8rem"
              fontWeight="600"
              color="var(--text-primary)"
              fontFamily="Montserrat, sans-serif"
            >
              Edit Tariff Item
            </Text>
            <Box
              cursor="pointer"
              onClick={handleClose}
              color="var(--text-muted)"
              _hover={{ color: 'var(--text-primary)' }}
            >
              <X size={20} />
            </Box>
          </Flex>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box p="2.4rem">
              <Stack gap={4}>
                <AppInput
                  label="Item Code"
                  placeholder="Enter item code"
                  {...register('itemCode')}
                  errorMessage={errors.itemCode?.message}
                  required
                />
                <AppInput
                  label="Provider's Item Code"
                  placeholder="Enter provider item code"
                  {...register('providerItemCode')}
                  errorMessage={errors.providerItemCode?.message}
                  required
                />
                <AppInput
                  label="Item Description"
                  placeholder="Enter description"
                  {...register('itemDescription')}
                  errorMessage={errors.itemDescription?.message}
                  required
                />
                <AppInput
                  label="Provider's Item Description"
                  placeholder="Enter description"
                  {...register('providerItemDescription')}
                  errorMessage={errors.providerItemDescription?.message}
                  required
                />
                <AppInput
                  label="Provider Amount"
                  placeholder="Enter amount"
                  {...register('providerAmount')}
                  errorMessage={errors.providerAmount?.message}
                  required
                />
              </Stack>
            </Box>

            {/* Footer */}
            <Flex
              p="2rem 2.4rem"
              borderTop="1px solid var(--surface-border)"
              gap="1.2rem"
              justify="flex-end"
              position="sticky"
              bottom={0}
              bg="var(--surface-card)"
            >
              <AppButton variant="secondary" onClick={handleClose}>
                Cancel
              </AppButton>
              <AppButton variant="primary" type="submit">
                Update changes
              </AppButton>
            </Flex>
          </form>
        </Box>
      </Flex>
    </>
  );
}

export const EditTariffItemModal = memo(EditTariffItemModalBase);
export default EditTariffItemModal;
