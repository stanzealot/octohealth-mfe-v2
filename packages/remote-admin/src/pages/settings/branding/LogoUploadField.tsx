import React, { useRef } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Upload, X, Image } from 'lucide-react';

interface LogoUploadFieldProps {
  logoUrl: string | null;
  onChange: (url: string | null) => void;
  onFile: (file: File) => void;
}

export default function LogoUploadField({ logoUrl, onChange, onFile }: LogoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFile(file);

      e.target.value = '';
    }
  };

  return (
    <Box>
      <Text
        fontSize="1.3rem"
        fontWeight="500"
        color="var(--text-secondary)"
        fontFamily="Montserrat, sans-serif"
        mb="1rem"
      >
        Company Logo
      </Text>

      <Flex align="center" gap="1.6rem" flexWrap="wrap">
        {logoUrl ? (
          <Box position="relative" display="inline-flex">
            <Box
              as="img"
              src={logoUrl}
              alt="Company logo"
              h="7.2rem"
              maxW="22rem"
              objectFit="contain"
              borderRadius="10px"
              border="1px solid var(--surface-border)"
              p="0.6rem"
              bg="var(--surface-card)"
            />
            <Box
              as="button"
              position="absolute"
              top="-8px"
              right="-8px"
              w="22px"
              h="22px"
              borderRadius="50%"
              bg="var(--status-danger)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px solid var(--surface-card)"
              cursor="pointer"
              title="Remove logo"
              onClick={() => onChange(null)}
            >
              <X size={11} color="white" />
            </Box>
          </Box>
        ) : (
          <Flex
            direction="column"
            align="center"
            justify="center"
            gap="0.6rem"
            w="18rem"
            h="8rem"
            borderRadius="10px"
            cursor="pointer"
            border="2px dashed var(--surface-border)"
            bg="var(--surface-bg)"
            transition="all 0.2s"
            _hover={{
              borderColor: 'var(--brand-primary)',
              bg: 'var(--brand-primary-light)',
            }}
            onClick={() => inputRef.current?.click()}
          >
            <Image size={22} color="var(--text-muted)" />
            <Text fontSize="1.2rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
              Click to upload
            </Text>
            <Text
              fontSize="1.1rem"
              color="var(--text-placeholder)"
              fontFamily="Montserrat, sans-serif"
            >
              PNG, JPG, SVG
            </Text>
          </Flex>
        )}

        {}
        {logoUrl && (
          <Flex
            as="button"
            align="center"
            gap="0.6rem"
            px="1.4rem"
            h="3.8rem"
            borderRadius="8px"
            border="1px solid var(--surface-border)"
            bg="var(--surface-card)"
            color="var(--text-secondary)"
            fontSize="1.3rem"
            fontFamily="Montserrat, sans-serif"
            fontWeight="500"
            cursor="pointer"
            _hover={{ bg: 'var(--hover-bg)' }}
            transition="background 0.2s"
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={14} />
            Change logo
          </Flex>
        )}
      </Flex>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </Box>
  );
}
