import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

interface BrandingPreviewProps {
  primaryColor:      string;
  primaryLightColor: string;
  companyName:       string;
  logoUrl:           string | null;
}

const MOCK_NAV = ['Dashboard', 'Contacts', 'Reports', 'Settings'];

export default function BrandingPreview({
  primaryColor,
  primaryLightColor,
  companyName,
  logoUrl,
}: BrandingPreviewProps) {
  return (
    <Box
      borderRadius="12px"
      overflow="hidden"
      border="1px solid var(--surface-border)"
      boxShadow="0 4px 20px rgba(0,0,0,0.08)"
    >
      {/* Mini sidebar header */}
      <Flex
        bg={primaryColor}
        h="5rem"
        align="center"
        px="1.4rem"
        gap="0.8rem"
        flexShrink={0}
      >
        {logoUrl ? (
          <Box
            as="img"
            src={logoUrl}
            alt={companyName}
            h="2.8rem"
            maxW="9rem"
            objectFit="contain"
          />
        ) : (
          <>
            <Flex
              align="center"
              justify="center"
              w="26px"
              h="26px"
              bg="rgba(255,255,255,0.2)"
              borderRadius="6px"
              flexShrink={0}
            >
              <Text color="white" fontWeight="800" fontSize="1.3rem">
                {companyName[0]?.toUpperCase() ?? 'B'}
              </Text>
            </Flex>
            <Text color="white" fontWeight="700" fontSize="1.3rem" fontFamily="Montserrat, sans-serif">
              {companyName}
            </Text>
          </>
        )}
      </Flex>

      {/* Mini nav items */}
      <Box p="0.8rem" bg="white" minH="14rem">
        {MOCK_NAV.map((label, i) => {
          const isActive = i === 0;
          return (
            <Flex
              key={label}
              align="center"
              gap="0.8rem"
              px="1rem"
              py="0.7rem"
              borderRadius="5px"
              mb="0.2rem"
              bg={isActive ? primaryLightColor : 'transparent'}
              borderLeft={isActive ? `3px solid ${primaryColor}` : '3px solid transparent'}
              transition="all 0.15s"
            >
              <Box
                w="6px"
                h="6px"
                borderRadius="50%"
                bg={isActive ? primaryColor : '#D0D5DD'}
                flexShrink={0}
              />
              <Text
                fontSize="1.2rem"
                fontFamily="Montserrat, sans-serif"
                color={isActive ? primaryColor : '#344054'}
                fontWeight={isActive ? 600 : 400}
              >
                {label}
              </Text>
            </Flex>
          );
        })}
      </Box>

      {/* Footer */}
      <Flex
        h="4rem"
        align="center"
        px="1.4rem"
        bg="white"
        borderTop="1px solid #E2E8F0"
        gap="0.6rem"
      >
        <Flex
          align="center"
          justify="center"
          w="22px"
          h="22px"
          bg={primaryColor}
          borderRadius="5px"
          flexShrink={0}
        >
          <Text color="white" fontWeight="800" fontSize="1.1rem">O</Text>
        </Flex>
        <Text fontWeight="700" fontSize="1.2rem" color={primaryColor} fontFamily="Montserrat, sans-serif">
          OctoHealth
        </Text>
      </Flex>
    </Box>
  );
}
