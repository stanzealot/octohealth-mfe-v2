import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Text } from '@chakra-ui/react';

interface PublicWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function PublicWrapper({ children, title, description }: PublicWrapperProps) {
  return (
    <Flex flexDir="column" bg="var(--surface-bg)" minH="100vh">
      {/* Header bar */}
      <Flex
        w="100%"
        h="86px"
        align="center"
        bg="var(--surface-card)"
        justify="center"
        borderBottom="1px solid var(--brand-primary)"
        flexShrink={0}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Flex align="center" gap="8px">
            <Box
              w="36px"
              h="36px"
              bg="var(--brand-primary)"
              borderRadius="8px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" fontWeight="800" fontSize="18px">B</Text>
            </Box>
            <Text fontWeight="700" fontSize="18px" color="var(--brand-primary)" fontFamily="Montserrat, sans-serif">
              Bastion
            </Text>
          </Flex>
        </Link>
      </Flex>

      {/* Content area */}
      <Flex justify="center" align="center" flex={1} pb="2rem" mt="20px" px="2rem">
        <Flex
          w="100%"
          maxW="1200px"
          h="calc(100vh - 146px)"
          bg="var(--surface-card)"
          align="center"
          rounded="24px"
          overflow="hidden"
          boxShadow="0 4px 24px rgba(0,0,0,0.06)"
        >
          {/* Left — form panel */}
          <Box
            flex="1"
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              w="100%"
              maxW={{ base: '400px', lg: '500px' }}
              mx={{ base: '24px', sm: '32px', md: '40px', lg: '60px' }}
            >
              <Box mb="32px" textAlign="center">
                <Box
                  w="48px"
                  h="48px"
                  bg="var(--brand-primary)"
                  borderRadius="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mx="auto"
                  mb="16px"
                >
                  <Text color="white" fontWeight="800" fontSize="22px">O</Text>
                </Box>
                {title && (
                  <Text fontSize="24px" fontWeight="600" color="var(--text-primary)" mb="8px" fontFamily="Montserrat, sans-serif">
                    {title}
                  </Text>
                )}
                {description && (
                  <Text fontSize="16px" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
                    {description}
                  </Text>
                )}
              </Box>
              {children}
            </Box>
          </Box>

          {/* Right — video panel (lg screens only) */}
          <Box
            flex="1"
            display={{ base: 'none', lg: 'block' }}
            position="relative"
            overflow="hidden"
            h="100%"
          >
            <video
              src="https://player.vimeo.com/progressive_redirect/playback/1087370844/rendition/240p/file.mp4?loc=external&signature=4ab5e0241a26eb81ced3eba71edb1013c62e356289547bb2b85426b87fc079cf"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
