import React, { memo, useState, useCallback } from 'react';
import { Stack, Flex, Box, Text } from '@chakra-ui/react';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import * as yup from 'yup';
import type { AddTariffFormData } from '../../../types';
import { TARIFF_PROVIDER_OPTIONS, TARIFF_NETWORK_OPTIONS } from '../../../constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppButton = React.lazy(() => import('sharedUi/AppButton')) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppInput = React.lazy(() => import('sharedUi/AppInput')) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppSelect = React.lazy(() => import('sharedUi/AppSelect')) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppDatePicker = React.lazy(() => import('sharedUi/AppDatePicker')) as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppBreadcrumb = React.lazy(() => import('sharedUi/AppBreadcrumb')) as any;

const addTariffSchema = yup.object({
  tariffType: yup
    .mixed<'Medicine' | 'Service'>()
    .oneOf(['Medicine', 'Service'])
    .required('Tariff type is required'),
  providers: yup.array().of(yup.string().required()).min(1, 'At least one provider is required'),
  network: yup.object({
    value: yup.string().required('Network is required'),
    label: yup.string().required(),
  }),
  tariffName: yup.string().required('Tariff name is required'),
  tariffDiscount: yup.string().required('Tariff discount is required'),
  discountType: yup.mixed<'₦' | '%'>().oneOf(['₦', '%']).required(),
  effectiveDate: yup.string().required('Effective date is required'),
  terminationDate: yup.string(),
  uploadedFiles: yup.array(),
});

// ─── Inline radio button ────────────────────────────────────────────────────
function RadioOption({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <Flex
      as="label"
      align="center"
      gap="0.8rem"
      cursor="pointer"
      fontFamily="Montserrat, sans-serif"
      fontSize="1.4rem"
      color="var(--text-secondary)"
    >
      <Box
        w="1.8rem"
        h="1.8rem"
        borderRadius="50%"
        border={`2px solid ${checked ? 'var(--brand-primary)' : 'var(--surface-border)'}`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg={checked ? 'var(--brand-primary-light)' : 'var(--surface-card)'}
        transition="all 0.2s"
        onClick={onChange}
        flexShrink={0}
      >
        {checked && <Box w="0.8rem" h="0.8rem" borderRadius="50%" bg="var(--brand-primary)" />}
      </Box>
      {label}
    </Flex>
  );
}

function AddTariffPageBase() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const formHook = useForm<AddTariffFormData>({
    resolver: yupResolver(addTariffSchema) as Resolver<AddTariffFormData>,
    defaultValues: {
      tariffType: 'Medicine',
      providers: [],
      network: { value: '', label: '' },
      tariffName: '',
      tariffDiscount: '',
      discountType: '₦',
      effectiveDate: '',
      terminationDate: '',
      uploadedFiles: [],
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors },
  } = formHook;

  const tariffType = watch('tariffType');
  const network = watch('network');

  const handleProviderChange = useCallback(
    (option: { value: string; label: string } | null) => {
      if (!option) return;
      const updated = [...selectedProviders, option.value].filter(
        (v, i, arr) => arr.indexOf(v) === i,
      );
      setSelectedProviders(updated);
      setValue('providers', updated);
    },
    [selectedProviders, setValue],
  );

  const removeProvider = useCallback(
    (provider: string) => {
      const updated = selectedProviders.filter((p) => p !== provider);
      setSelectedProviders(updated);
      setValue('providers', updated);
    },
    [selectedProviders, setValue],
  );

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const valid = Array.from(files).filter((f) => f.size <= 5 * 1024 * 1024);
      const updated = [...uploadedFiles, ...valid];
      setUploadedFiles(updated);
      setValue('uploadedFiles', updated);
    },
    [uploadedFiles, setValue],
  );

  const removeFile = useCallback(
    (file: File) => {
      const updated = uploadedFiles.filter((f) => f !== file);
      setUploadedFiles(updated);
      setValue('uploadedFiles', updated);
    },
    [uploadedFiles, setValue],
  );

  const onSubmit = (_data: AddTariffFormData) => {
    navigate('/providers/tariff');
  };

  return (
    <Stack gap={6}>
      <AppBreadcrumb
        beforeText="Tariff list"
        afterText={id ? 'Edit Tariff' : 'Add Tariff'}
        link="/providers/tariff"
      />

      <Stack
        bg="var(--surface-card)"
        borderRadius=".8rem"
        gap={6}
        p="2.4rem"
        border="1px solid var(--surface-border)"
      >
        {/* Page title */}
        <Stack gap={1}>
          <Text
            fontSize="1.8rem"
            fontWeight="600"
            color="var(--text-primary)"
            fontFamily="Montserrat, sans-serif"
          >
            {id ? 'Edit' : 'Add'} Tariff
          </Text>
          <Text fontSize="1.4rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
            Please provide all information about the tariff
          </Text>
        </Stack>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={6}>
            {/* Tariff Type Radio */}
            <Flex gap="2.4rem">
              <RadioOption
                checked={tariffType === 'Medicine'}
                label="Medicine"
                onChange={() => setValue('tariffType', 'Medicine')}
              />
              <RadioOption
                checked={tariffType === 'Service'}
                label="Service"
                onChange={() => setValue('tariffType', 'Service')}
              />
            </Flex>

            {/* Providers + Network */}
            <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }}>
              <Box flex="1">
                <Stack gap={2}>
                  <Text
                    fontSize="1.3rem"
                    fontWeight="500"
                    color="var(--text-secondary)"
                    fontFamily="Montserrat, sans-serif"
                  >
                    Provider(s){' '}
                    <Text as="span" color="var(--status-danger)">
                      *
                    </Text>
                  </Text>
                  <AppSelect
                    options={TARIFF_PROVIDER_OPTIONS}
                    placeholder="Select Provider(s)"
                    onChange={handleProviderChange}
                    errorMessage={(errors.providers as { message?: string } | undefined)?.message}
                  />
                  {selectedProviders.length > 0 && (
                    <Flex gap="0.8rem" flexWrap="wrap" mt={1}>
                      {selectedProviders.map((provider) => (
                        <Flex
                          key={provider}
                          align="center"
                          gap="0.8rem"
                          bg="var(--hover-bg)"
                          borderRadius="6px"
                          px="1.2rem"
                          py="0.6rem"
                          fontSize="1.4rem"
                          color="var(--text-secondary)"
                          fontFamily="Montserrat, sans-serif"
                        >
                          <Text>{provider}</Text>
                          <Box
                            as="button"
                            type="button"
                            cursor="pointer"
                            onClick={() => removeProvider(provider)}
                            color="var(--text-muted)"
                            bg="transparent"
                            border="none"
                            display="flex"
                            alignItems="center"
                            _hover={{ color: 'var(--status-danger)' }}
                          >
                            <X size={14} />
                          </Box>
                        </Flex>
                      ))}
                    </Flex>
                  )}
                </Stack>
              </Box>

              <Box flex="1">
                <AppSelect
                  options={TARIFF_NETWORK_OPTIONS}
                  placeholder="Select Network type"
                  label="Network"
                  required
                  value={network?.value ? network : null}
                  onChange={(opt: { value: string; label: string } | null) =>
                    setValue('network', opt ?? { value: '', label: '' })
                  }
                  errorMessage={errors.network?.value?.message}
                />
              </Box>
            </Flex>

            {/* Tariff Name + Discount */}
            <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }}>
              <Box flex="1">
                <AppInput
                  label="Tariff Name"
                  placeholder="Enter name"
                  {...register('tariffName')}
                  errorMessage={errors.tariffName?.message}
                  required
                />
              </Box>
              <Box flex="1">
                <AppInput
                  label="Tariff Discount"
                  placeholder="0"
                  {...register('tariffDiscount')}
                  errorMessage={errors.tariffDiscount?.message}
                  required
                />
              </Box>
            </Flex>

            {/* Dates */}
            <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }}>
              <Box flex="1">
                <AppDatePicker
                  handler={formHook}
                  title="effectiveDate"
                  label="Effective Date"
                  placeholder="Select Date"
                  required
                  errorMessage={errors.effectiveDate?.message}
                />
              </Box>
              <Box flex="1">
                <AppDatePicker
                  handler={formHook}
                  title="terminationDate"
                  label="Termination Date"
                  placeholder="Select Date"
                  errorMessage={errors.terminationDate?.message}
                />
              </Box>
            </Flex>

            {/* File Upload */}
            <Stack gap={2}>
              <Text
                fontSize="1.3rem"
                fontWeight="500"
                color="var(--text-secondary)"
                fontFamily="Montserrat, sans-serif"
              >
                Upload file(s)
              </Text>
              <Box
                border="2px dashed var(--surface-border)"
                borderRadius="8px"
                p="3.2rem"
                textAlign="center"
                bg="var(--surface-bg)"
                _hover={{ borderColor: 'var(--brand-primary)', bg: 'var(--brand-primary-light)' }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Stack gap={3} align="center">
                  <Flex
                    bg="var(--surface-card)"
                    borderRadius="8px"
                    p="1.2rem"
                    border="1px solid var(--surface-border)"
                  >
                    <Upload size={20} color="var(--text-muted)" />
                  </Flex>
                  <Stack gap={1} align="center">
                    <Text
                      fontSize="1.4rem"
                      fontWeight="600"
                      color="var(--text-secondary)"
                      fontFamily="Montserrat, sans-serif"
                    >
                      Drag CSV here to import tariff information
                    </Text>
                    <Text
                      fontSize="1.2rem"
                      color="var(--text-muted)"
                      fontFamily="Montserrat, sans-serif"
                    >
                      or click to browse, up to (5 MB max)
                    </Text>
                  </Stack>
                </Stack>
              </Box>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e.target.files)}
              />

              {/* Uploaded file list */}
              {uploadedFiles.length > 0 && (
                <Stack gap={2} mt={2}>
                  {uploadedFiles.map((file, i) => (
                    <Flex
                      key={i}
                      align="center"
                      justify="space-between"
                      bg="var(--hover-bg)"
                      borderRadius="6px"
                      px="1.2rem"
                      py="0.8rem"
                    >
                      <Text
                        fontSize="1.4rem"
                        color="var(--text-secondary)"
                        fontFamily="Montserrat, sans-serif"
                      >
                        {file.name}
                      </Text>
                      <Box
                        as="button"
                        type="button"
                        cursor="pointer"
                        onClick={() => removeFile(file)}
                        color="var(--text-muted)"
                        bg="transparent"
                        border="none"
                        display="flex"
                        alignItems="center"
                        _hover={{ color: 'var(--status-danger)' }}
                      >
                        <X size={16} />
                      </Box>
                    </Flex>
                  ))}
                </Stack>
              )}
            </Stack>

            {/* Action buttons */}
            <Flex gap="1.2rem" justify="flex-end" mt="1rem">
              <AppButton variant="secondary" onClick={() => navigate('/providers/tariff')}>
                Cancel
              </AppButton>
              <AppButton variant="primary" type="submit">
                {id ? 'Update' : 'Add'} Tariff
              </AppButton>
            </Flex>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
}

export const AddTariffPage = memo(AddTariffPageBase);
export default AddTariffPage;
