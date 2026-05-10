import React, { useRef, useState, useCallback, memo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Upload, RefreshCw, X } from 'lucide-react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';

export interface AppImageInputProps {
  handler: UseFormReturn<FieldValues>;

  title: string;
  label?: string;
  required?: boolean;

  maxSizeMB?: number;

  accept?: string;
}

function AppImageInputBase({
  handler,
  title,
  label,
  required,
  maxSizeMB = 2,
  accept = 'image/jpg,image/jpeg,image/png,image/gif',
}: AppImageInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = handler;
  const savedUrl = watch(title) as string | undefined;
  const errorMessage = errors[title]?.message?.toString();

  const displaySrc = previewUrl ?? savedUrl ?? null;

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        setError(title, { message: `Image must be smaller than ${maxSizeMB} MB` });
        setValue(title, undefined);
        setPreviewUrl(null);
        return;
      }

      clearErrors(title);
      setValue(title, file as unknown as string);
      setPreviewUrl(URL.createObjectURL(file));
    },
    [maxSizeMB, title, setError, clearErrors, setValue],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setValue(title, undefined);
      setPreviewUrl(null);
      clearErrors(title);
      if (fileRef.current) fileRef.current.value = '';
    },
    [title, setValue, clearErrors],
  );

  return (
    <Box display="flex" flexDir="column" gap="0.5rem" w="100%">
      {}
      {label && (
        <Text
          fontSize="1.4rem"
          fontWeight="500"
          color="var(--text-secondary)"
          fontFamily="Montserrat, sans-serif"
        >
          {label}
          {required && (
            <Text as="span" color="var(--status-danger)" ml="2px" aria-hidden>
              *
            </Text>
          )}
        </Text>
      )}

      {}
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {displaySrc ? (
        <Flex
          direction="column"
          align="center"
          gap="1.2rem"
          p="1.6rem"
          border="1px dashed var(--surface-border)"
          borderRadius="8px"
          bg="var(--surface-card)"
        >
          <Box position="relative" display="inline-block">
            <Box
              as="img"
              src={displaySrc}
              alt="preview"
              style={{
                width: '9.6rem',
                height: '9.6rem',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '2px solid var(--surface-border)',
              }}
            />
            {}
            <Box
              as="button"
              type="button"
              position="absolute"
              top="-6px"
              right="-6px"
              w="22px"
              h="22px"
              borderRadius="50%"
              bg="var(--status-danger)"
              border="none"
              cursor="pointer"
              display="flex"
              alignItems="center"
              justifyContent="center"
              onClick={handleClear}
              aria-label="Remove image"
            >
              <X size={12} color="white" />
            </Box>
          </Box>

          <Box
            as="button"
            type="button"
            display="flex"
            alignItems="center"
            gap="0.5rem"
            px="1.6rem"
            h="3.6rem"
            borderRadius="6px"
            bg="var(--brand-primary-light)"
            border="1px solid var(--brand-primary)"
            color="var(--brand-primary)"
            fontSize="1.3rem"
            fontFamily="Montserrat, sans-serif"
            fontWeight="500"
            cursor="pointer"
            onClick={() => fileRef.current?.click()}
            transition="background 0.15s"
            _hover={{ bg: 'var(--brand-primary)', color: 'white' }}
          >
            <RefreshCw size={14} />
            Change Image
          </Box>
        </Flex>
      ) : (
        <Flex
          align="center"
          justify="space-between"
          gap="1.5rem"
          p="1.6rem"
          border="1px dashed var(--surface-border)"
          borderRadius="8px"
          bg="var(--surface-card)"
          cursor="pointer"
          onClick={() => fileRef.current?.click()}
          transition="border-color 0.2s, background 0.2s"
          _hover={{ borderColor: 'var(--brand-primary)', bg: 'var(--brand-primary-light)' }}
        >
          <Flex gap="1rem" align="center">
            <Flex
              w="4rem"
              h="4rem"
              borderRadius="8px"
              bg="var(--brand-primary-light)"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <Upload size={18} color="var(--brand-primary)" />
            </Flex>
            <Box>
              <Text
                fontSize="1.4rem"
                fontWeight="600"
                color="var(--text-secondary)"
                fontFamily="Montserrat, sans-serif"
              >
                Tap to Upload
              </Text>
              <Text fontSize="1.2rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
                JPG, PNG, GIF — max {maxSizeMB} MB
              </Text>
            </Box>
          </Flex>

          <Box
            as="span"
            px="1.6rem"
            h="3.6rem"
            borderRadius="6px"
            bg="var(--brand-primary)"
            color="white"
            fontSize="1.3rem"
            fontFamily="Montserrat, sans-serif"
            fontWeight="500"
            display="flex"
            alignItems="center"
          >
            Upload
          </Box>
        </Flex>
      )}

      {}
      {errorMessage && (
        <Text fontSize="1.2rem" color="var(--status-danger)" fontFamily="Montserrat, sans-serif">
          {errorMessage}
        </Text>
      )}
    </Box>
  );
}

export const AppImageInput = memo(AppImageInputBase);
export default AppImageInput;
