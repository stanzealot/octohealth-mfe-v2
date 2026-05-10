import React from 'react';
import { Accordion, Flex, Stack, Text } from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';

export interface AppAccordionSectionProps {
  title: string;

  children: React.ReactNode;

  defaultOpen?: boolean;

  contentPadding?: string | number;

  headerExtra?: React.ReactNode;
}

export function AppAccordionSection({
  title,
  children,
  defaultOpen = true,
  contentPadding = '2.4rem',
  headerExtra,
}: AppAccordionSectionProps) {
  return (
    <Accordion.Root collapsible defaultValue={defaultOpen ? ['section'] : []}>
      <Accordion.Item value="section" borderWidth={0}>
        {}
        <Accordion.ItemTrigger
          border="1px solid var(--surface-border)"
          bg="var(--table-header-bg)"
          borderRadius="16px 16px 0 0"
          py={4}
          px={6}
          cursor="pointer"
          _hover={{ bg: 'var(--hover-bg)' }}
          transition="background 0.15s"
        >
          <Flex justify="space-between" w="100%" align="center">
            <Flex align="center" gap="1rem">
              <Text
                fontWeight="700"
                fontSize="1.6rem"
                fontFamily="Montserrat, sans-serif"
                color="var(--text-primary)"
              >
                {title}
              </Text>
              {headerExtra}
            </Flex>
            <Accordion.ItemIndicator>
              <ChevronDown size={20} color="var(--text-muted)" />
            </Accordion.ItemIndicator>
          </Flex>
        </Accordion.ItemTrigger>

        {}
        <Accordion.ItemContent
          bg="var(--surface-card)"
          border="1px solid var(--surface-border)"
          borderTop="none"
          borderRadius="0 0 16px 16px"
          p={0}
        >
          {contentPadding ? (
            <Stack p={contentPadding} gap={5}>
              {children}
            </Stack>
          ) : (
            children
          )}
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
}

export default AppAccordionSection;
