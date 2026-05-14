import React, { memo, useEffect } from 'react';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { X } from 'lucide-react';
import * as yup from 'yup';
import type { Network, NetworkFormData } from '../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppInput = React.lazy(() => import('sharedUi/AppInput')) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppButton = React.lazy(() => import('sharedUi/AppButton')) as any;

const networkSchema = yup.object({
  networkName: yup.string().required('Network name is required'),
  description: yup.string().max(200, 'Max 200 characters'),
});

interface AddNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NetworkFormData) => void;
  network: Network | null;
}

function AddNetworkModalBase({ isOpen, onClose, onSave, network }: AddNetworkModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<NetworkFormData>({
    resolver: yupResolver(networkSchema) as Resolver<NetworkFormData>,
    defaultValues: { networkName: '', description: '' },
  });

  const description = watch('description');
  const descriptionLength = description?.length ?? 0;

  useEffect(() => {
    if (network) {
      reset({ networkName: network.networkName, description: network.description ?? '' });
    } else {
      reset({ networkName: '', description: '' });
    }
  }, [network, reset, isOpen]);

  const onSubmit = (data: NetworkFormData) => {
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

      {/* Modal container */}
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
          overflow="hidden"
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
          >
            <Text
              fontSize="1.8rem"
              fontWeight="600"
              color="var(--text-primary)"
              fontFamily="Montserrat, sans-serif"
            >
              {network ? 'Edit network' : 'Add network'}
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
                  label="Network Name"
                  placeholder="Enter network name"
                  {...register('networkName')}
                  errorMessage={errors.networkName?.message}
                  required
                />

                <Box position="relative">
                  <AppInput
                    label="Description"
                    placeholder="Enter description"
                    {...register('description')}
                    errorMessage={errors.description?.message}
                    isTextArea
                    rows={4}
                  />
                  <Text
                    position="absolute"
                    bottom={errors.description?.message ? '3.2rem' : '1.2rem'}
                    right="1.6rem"
                    fontSize="1.2rem"
                    color="var(--text-muted)"
                    pointerEvents="none"
                    bg="var(--surface-card)"
                    px="0.4rem"
                    fontFamily="Montserrat, sans-serif"
                  >
                    {descriptionLength}/200
                  </Text>
                </Box>
              </Stack>
            </Box>

            {/* Footer */}
            <Flex
              p="2rem 2.4rem"
              borderTop="1px solid var(--surface-border)"
              gap="1.2rem"
              justify="flex-end"
            >
              <AppButton variant="secondary" onClick={handleClose}>
                Cancel
              </AppButton>
              <AppButton variant="primary" type="submit">
                Save
              </AppButton>
            </Flex>
          </form>
        </Box>
      </Flex>
    </>
  );
}

export const AddNetworkModal = memo(AddNetworkModalBase);
export default AddNetworkModal;
