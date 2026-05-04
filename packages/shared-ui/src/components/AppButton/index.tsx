import React, { type ReactNode } from 'react';
import { Button, type ButtonProps, Spinner, Flex, Text } from '@chakra-ui/react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gray-outline';

const VARIANT_STYLES: Record<Variant, object> = {
  primary: {
    bg: 'var(--brand-primary)',
    color: 'white',
    border: '1px solid var(--brand-primary)',
    _hover: { bg: 'var(--brand-primary-dark)', borderColor: 'var(--brand-primary-dark)', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' },
    _active: { bg: 'var(--brand-primary-dark)', transform: 'translateY(0)' },
  },
  secondary: {
    bg: 'var(--brand-primary-light)',
    color: 'var(--brand-primary)',
    border: '1px solid var(--brand-primary-light)',
    _hover: { opacity: 0.85, transform: 'translateY(-1px)' },
  },
  outline: {
    bg: 'transparent',
    color: 'var(--brand-primary)',
    border: '1px solid var(--brand-primary)',
    _hover: { bg: 'var(--brand-primary-light)', transform: 'translateY(-1px)' },
  },
  'gray-outline': {
    bg: 'var(--surface-card)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--surface-border)',
    _hover: { bg: 'var(--hover-bg)', borderColor: 'var(--text-placeholder)', transform: 'translateY(-1px)' },
  },
  ghost: {
    bg: 'transparent',
    color: 'var(--text-secondary)',
    border: 'none',
    _hover: { bg: 'var(--hover-bg)', transform: 'translateY(-1px)' },
  },
  danger: {
    bg: '#FEF2F2',
    color: 'var(--status-danger)',
    border: '1px solid #FECACA',
    _hover: { bg: '#FEE2E2', borderColor: '#FCA5A5', transform: 'translateY(-1px)' },
  },
};

interface AppButtonProps extends Omit<ButtonProps, 'variant' | 'loading' | 'loadingText'> {
  variant?: Variant;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export function AdvancedButton({
  variant = 'primary',
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...rest
}: AppButtonProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <Button
      {...styles}
      h="4rem"
      px="1.6rem"
      fontSize="1.4rem"
      fontWeight="600"
      fontFamily="Montserrat, sans-serif"
      borderRadius="8px"
      transition="all 0.2s ease"
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Flex align="center" gap="0.8rem">
          <Spinner size="sm" />
          {loadingText && <Text>{loadingText}</Text>}
        </Flex>
      ) : (
        <Flex align="center" gap="0.6rem">
          {leftIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{rightIcon}</span>}
        </Flex>
      )}
    </Button>
  );
}

export default AdvancedButton;
