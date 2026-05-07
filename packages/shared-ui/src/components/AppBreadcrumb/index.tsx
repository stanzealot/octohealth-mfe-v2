import React, { memo } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { ChevronLeft } from 'lucide-react';

export interface AppBreadcrumbProps {
  /** href for the back link */
  link: string;
  /** Label for the parent page (left side) */
  beforeText: string;
  /** Label for the current page (right side, bold) */
  afterText: string;
  /** Called on back click — if provided, prevents default navigation */
  onBack?: () => void;
}

function AppBreadcrumbBase({ link, beforeText, afterText, onBack }: AppBreadcrumbProps) {
  return (
    <Flex align="center" gap="0.6rem" fontFamily="Montserrat, sans-serif">
      {/* Back link */}
      <Flex
        as={onBack ? 'button' : 'a'}
        {...(onBack ? { onClick: onBack } : { href: link })}
        align="center"
        gap="0.4rem"
        color="var(--text-muted)"
        fontSize="1.4rem"
        fontWeight="400"
        cursor="pointer"
        bg="transparent"
        border="none"
        p="0"
        _hover={{ color: 'var(--brand-primary)', textDecoration: 'none' }}
        transition="color 0.15s"
        style={{ textDecoration: 'none' }}
      >
        <ChevronLeft size={18} />
        <Text as="span" fontSize="1.4rem" color="inherit">
          {beforeText}
        </Text>
      </Flex>

      {/* Separator */}
      <Text
        color="var(--surface-border)"
        fontSize="1.4rem"
        fontWeight="300"
        userSelect="none"
        aria-hidden
      >
        |
      </Text>

      {/* Current page */}
      <Text
        fontSize="1.4rem"
        fontWeight="600"
        color="var(--text-primary)"
      >
        {afterText}
      </Text>
    </Flex>
  );
}

export const AppBreadcrumb = memo(AppBreadcrumbBase);
export default AppBreadcrumb;
