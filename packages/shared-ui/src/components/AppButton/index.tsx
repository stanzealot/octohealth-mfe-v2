import React, { type ReactNode } from 'react';
import { Button, type ButtonProps, Spinner, Flex, Text } from '@chakra-ui/react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gray-outline';

const VARIANT_STYLES: Record<Variant, object> = {
  primary: {
    bg: '#0C6525',
    color: 'white',
    border: '1px solid #0C6525',
    _hover: { bg: '#0A5522', borderColor: '#0A5522', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(12,101,37,0.3)' },
    _active: { bg: '#084420', transform: 'translateY(0)' },
  },
  secondary: {
    bg: '#F0F9F5',
    color: '#0C6525',
    border: '1px solid #E8F5E8',
    _hover: { bg: '#E8F5E8', borderColor: '#D1E7D1', transform: 'translateY(-1px)' },
  },
  outline: {
    bg: 'transparent',
    color: '#0C6525',
    border: '1px solid #0C6525',
    _hover: { bg: '#F0F9F5', borderColor: '#0C6525', transform: 'translateY(-1px)' },
  },
  'gray-outline': {
    bg: 'white',
    color: '#344054',
    border: '1px solid #D0D5DD',
    _hover: { bg: '#F9FAFB', borderColor: '#98A2B3', transform: 'translateY(-1px)' },
  },
  ghost: {
    bg: 'transparent',
    color: '#344054',
    border: 'none',
    _hover: { bg: '#F9FAFB', transform: 'translateY(-1px)' },
  },
  danger: {
    bg: '#FEF2F2',
    color: '#DC2626',
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
