import React, { useState, useCallback, useRef, memo } from 'react';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { type UseFormReturn, Controller } from 'react-hook-form';
import { Upload, X, Check, FileText } from 'lucide-react';
import AppInput from 'sharedUi/AppInput';
import AppSelect from 'sharedUi/AppSelect';
import AppButton from 'sharedUi/AppButton';
import AppAccordionSection from 'sharedUi/AppAccordionSection';
import type { AddProviderPayload } from '../../../../types';
import { STATEMENT_GENERATION_OPTIONS } from '../../../../constants';

interface Props {
  handler: UseFormReturn<AddProviderPayload>;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

function ContractInfoSectionBase({ handler }: Props) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = handler;
  const professionalFee = watch('professionalFee');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.size <= 10 * 1024 * 1024);
    setUploadedFiles((prev) => [...prev, ...valid]);
  }, []);

  const removeFile = useCallback((file: File) => {
    setUploadedFiles((prev) => prev.filter((f) => f !== file));
  }, []);

  return (
    <AppAccordionSection title="Contract Info" defaultOpen>
      <Box w={{ base: '100%', md: '50%' }}>
        <AppInput
          label="Cut-off Days"
          placeholder="Enter cut-off days"
          errorMessage={errors.cutOffDays?.message}
          {...register('cutOffDays')}
        />
      </Box>

      {/* Upload Document */}
      <Stack gap="0.8rem">
        <Text
          fontFamily="Montserrat, sans-serif"
          fontSize="1.3rem"
          fontWeight="500"
          color="var(--text-secondary)"
        >
          Upload Document
        </Text>
        <Box
          border="2px dashed var(--surface-border)"
          borderRadius="8px"
          p="3.2rem"
          textAlign="center"
          bg="var(--surface-bg)"
          cursor="pointer"
          onClick={() => fileInputRef.current?.click()}
          _hover={{ borderColor: 'var(--brand-primary)', bg: 'var(--brand-primary-light)' }}
          transition="all 0.2s"
        >
          <Stack gap="1.6rem" align="center">
            <Flex
              bg="var(--surface-card)"
              borderRadius="8px"
              p="1.2rem"
              border="1px solid var(--surface-border)"
            >
              <Upload size={20} color="var(--text-muted)" />
            </Flex>
            <Stack gap="0.4rem" align="center">
              <Text
                fontFamily="Montserrat, sans-serif"
                fontSize="1.4rem"
                fontWeight="600"
                color="var(--text-secondary)"
              >
                Tap to Upload
              </Text>
              <Text fontFamily="Montserrat, sans-serif" fontSize="1.2rem" color="var(--text-muted)">
                PNG, JPG, PDF (10MB max.)
              </Text>
            </Stack>
          </Stack>
        </Box>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <Flex justify="flex-end">
          <AppButton
            variant="primary"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            enableRipple
          >
            Upload Document
          </AppButton>
        </Flex>
        {uploadedFiles.length > 0 && (
          <Stack gap="0.8rem" mt="1.6rem">
            {uploadedFiles.map((file, i) => (
              <Flex
                key={i}
                align="center"
                justify="space-between"
                p="1.2rem"
                bg="var(--surface-bg)"
                borderRadius="8px"
                border="1px solid var(--surface-border)"
              >
                <Flex align="center" gap="1.2rem">
                  <FileText size={20} color="var(--text-muted)" />
                  <Box>
                    <Text
                      fontFamily="Montserrat, sans-serif"
                      fontSize="1.3rem"
                      fontWeight="500"
                      color="var(--text-primary)"
                    >
                      {file.name}
                    </Text>
                    <Text
                      fontFamily="Montserrat, sans-serif"
                      fontSize="1.2rem"
                      color="var(--text-muted)"
                    >
                      {formatFileSize(file.size)} — Completed
                    </Text>
                  </Box>
                  <Check size={16} color="var(--status-success)" />
                </Flex>
                <Box
                  cursor="pointer"
                  onClick={() => removeFile(file)}
                  color="var(--text-muted)"
                  _hover={{ color: 'var(--status-danger)' }}
                >
                  <X size={16} />
                </Box>
              </Flex>
            ))}
          </Stack>
        )}
      </Stack>

      {/* Professional Fee Radio */}
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
        <Stack gap="0.8rem" w={professionalFee ? { base: '100%', md: '50%' } : '100%'}>
          <Text
            fontFamily="Montserrat, sans-serif"
            fontSize="1.3rem"
            fontWeight="500"
            color="var(--text-secondary)"
          >
            Professional fee
          </Text>
          <Flex gap="2rem">
            {[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
            ].map(({ label, value }) => (
              <Flex
                key={label}
                align="center"
                gap="0.8rem"
                cursor="pointer"
                onClick={() => setValue('professionalFee', value)}
              >
                <Box
                  w="1.8rem"
                  h="1.8rem"
                  borderRadius="50%"
                  border={`2px solid ${professionalFee === value ? 'var(--brand-primary)' : 'var(--surface-border)'}`}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  transition="border-color 0.15s"
                >
                  {professionalFee === value && (
                    <Box w="0.9rem" h="0.9rem" borderRadius="50%" bg="var(--brand-primary)" />
                  )}
                </Box>
                <Text
                  fontFamily="Montserrat, sans-serif"
                  fontSize="1.4rem"
                  color="var(--text-primary)"
                >
                  {label}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Stack>
        {professionalFee && (
          <Box w={{ base: '100%', md: '50%' }}>
            <AppInput
              label="Value"
              placeholder="0"
              errorMessage={errors.professionalFeeValue?.message}
              {...register('professionalFeeValue')}
            />
          </Box>
        )}
      </Flex>

      {/* Statement + Payment Days */}
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
        <Box w={{ base: '100%', md: '50%' }}>
          <Controller
            name="statementGeneration"
            control={control}
            render={({ field }) => (
              <AppSelect
                label="Statement generation *"
                placeholder="Select frequency"
                options={STATEMENT_GENERATION_OPTIONS}
                value={STATEMENT_GENERATION_OPTIONS.find((o) => o.value === field.value) ?? null}
                onChange={(opt) => field.onChange((opt as { value: string } | null)?.value ?? '')}
                height="4.4rem"
              />
            )}
          />
        </Box>
        <Box w={{ base: '100%', md: '50%' }}>
          <AppInput
            label="Provider payment days *"
            placeholder="Enter days"
            errorMessage={errors.providerPaymentDays?.message}
            {...register('providerPaymentDays')}
          />
        </Box>
      </Flex>
    </AppAccordionSection>
  );
}

export const ContractInfoSection = memo(ContractInfoSectionBase);
export default ContractInfoSection;
