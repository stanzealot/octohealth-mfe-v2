import React from 'react';
import { Accordion, Flex, Stack, Text } from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';

/* ─── Props ──────────────────────────────────────────────────────────── */
export interface AppAccordionSectionProps {
  /** Section heading text */
  title: string;
  /** Section body — rendered inside the collapsible area */
  children: React.ReactNode;
  /** Expanded by default when true (default: true) */
  defaultOpen?: boolean;
  /**
   * Padding applied to the content area.
   * Pass "0" or "" to let children manage their own padding.
   * @default "2.4rem"
   */
  contentPadding?: string | number;
  /** Right-side slot in the header (e.g. a badge or count) */
  headerExtra?: React.ReactNode;
}

/* ─── Component ──────────────────────────────────────────────────────── */
export function AppAccordionSection({
  title,
  children,
  defaultOpen = true,
  contentPadding = '2.4rem',
  headerExtra,
}: AppAccordionSectionProps) {
  return (
    <Accordion.Root
      collapsible
      defaultValue={defaultOpen ? ['section'] : []}
    >
      <Accordion.Item value="section" borderWidth={0}>
        {/* ── Trigger (header bar) ─────────────────────────────────── */}
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

        {/* ── Content (body) ───────────────────────────────────────── */}
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
