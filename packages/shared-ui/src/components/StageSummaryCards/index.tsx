import React, { memo } from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';

export interface StageSummaryItem {
  id: string;
  name: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

interface Props {
  stages: StageSummaryItem[];
}

function StageSummaryCardsBase({ stages }: Props) {
  return (
    <Flex
      gap="1.6rem"
      wrap="wrap"
      justify={{ base: 'flex-start', md: 'space-between' }}
      w="100%"
      mb="1.6rem"
    >
      {stages.map((stage) => (
        <Box
          key={stage.id}
          bg="var(--surface-card)"
          borderRadius="12px"
          border="1px solid var(--surface-border)"
          p="1.6rem"
          minW="18rem"
          flex="1"
          boxShadow="0px 1px 3px rgba(16,24,40,0.1)"
        >
          <Flex align="center" gap="1.2rem">
            {}
            <Box
              p="0.8rem"
              borderRadius="8px"
              bg={`${stage.color}20`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              {stage.icon}
            </Box>

            {}
            <Box>
              <Text
                fontSize="1.4rem"
                fontWeight="500"
                color="var(--text-muted)"
                fontFamily="Montserrat, sans-serif"
              >
                {stage.name}
              </Text>
              <Text
                fontSize="2.4rem"
                fontWeight="700"
                color="var(--text-primary)"
                fontFamily="Montserrat, sans-serif"
                lineHeight="1.2"
              >
                {stage.count}
              </Text>
            </Box>
          </Flex>
        </Box>
      ))}
    </Flex>
  );
}

export const StageSummaryCards = memo(StageSummaryCardsBase);
export default StageSummaryCards;
