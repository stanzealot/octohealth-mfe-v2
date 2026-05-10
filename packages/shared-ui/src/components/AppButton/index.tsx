import React, { useState, useCallback, type ReactNode } from 'react';
import { Button, type ButtonProps, Spinner, Flex, Text, Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const rippleAnim = keyframes`
  0%   { transform: scale(0); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
`;

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gray-outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

function cssVarToRgba(varName: string, alpha: number): string {
  try {
    const hex = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    if (!hex || hex[0] !== '#') return `rgba(0,0,0,${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  } catch {
    return `rgba(0,0,0,${alpha})`;
  }
}

const SIZE_MAP: Record<ButtonSize, { h: string; fontSize: string; px: string }> = {
  sm: { h: '3.2rem', fontSize: '1.2rem', px: '1.2rem' },
  md: { h: '4rem', fontSize: '1.4rem', px: '1.6rem' },
  lg: { h: '4.8rem', fontSize: '1.6rem', px: '2rem' },
};

interface VariantConfig {
  base: object;
  hover: (primaryGlow: string) => object;
  active: object;
  shineColor: string;
  shineOpacity: number;
  rippleBg: (primaryGlow: string) => string;
}

function buildVariants(
  primaryGlow25: string,
  primaryGlow35: string,
  primaryGlow10: string,
): Record<Variant, VariantConfig> {
  return {
    primary: {
      base: {
        bg: 'var(--brand-primary)',
        color: 'white',
        border: '1px solid var(--brand-primary)',
      },
      hover: () => ({
        bg: 'var(--brand-primary)',
        borderColor: 'var(--brand-primary)',
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${primaryGlow35}`,
      }),
      active: { transform: 'translateY(-1px)', boxShadow: `0 4px 15px ${primaryGlow25}` },
      shineColor: 'var(--brand-primary-light)',
      shineOpacity: 0.35,
      rippleBg: () => 'rgba(255,255,255,0.25)',
    },

    secondary: {
      base: {
        bg: 'var(--brand-primary-light)',
        color: 'var(--brand-primary)',
        border: '1px solid var(--brand-primary-light)',
      },
      hover: () => ({
        bg: 'var(--brand-primary-light)',
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 16px ${primaryGlow25}`,
      }),
      active: { transform: 'translateY(-1px)' },
      shineColor: 'var(--brand-primary-light)',
      shineOpacity: 0.45,
      rippleBg: (g) => g,
    },

    outline: {
      base: {
        bg: 'var(--surface-card)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--surface-border)',
      },
      hover: (g) => ({
        bg: 'var(--brand-primary-light)',
        color: 'var(--brand-primary)',
        borderColor: 'var(--brand-primary)',
        transform: 'translateY(-2px)',
        boxShadow: `0 4px 12px ${g}`,
      }),
      active: {
        transform: 'translateY(-1px)',
        bg: 'var(--brand-primary-light)',
        borderColor: 'var(--brand-primary)',
      },
      shineColor: primaryGlow10,
      shineOpacity: 1,
      rippleBg: (g) => g,
    },

    'gray-outline': {
      base: {
        bg: 'var(--surface-card)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--surface-border)',
      },
      hover: () => ({
        bg: 'var(--hover-bg)',
        borderColor: 'var(--text-placeholder)',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      }),
      active: { transform: 'translateY(0)' },
      shineColor: 'var(--hover-bg)',
      shineOpacity: 0.6,
      rippleBg: () => 'rgba(0,0,0,0.05)',
    },

    ghost: {
      base: {
        bg: 'transparent',
        color: 'var(--text-secondary)',
        border: 'none',
      },
      hover: () => ({
        bg: 'var(--brand-primary-light)',
        color: 'var(--brand-primary)',
        transform: 'translateY(-1px)',
      }),
      active: { transform: 'translateY(0)' },
      shineColor: 'rgba(255,255,255,0.5)',
      shineOpacity: 1,
      rippleBg: (g) => g,
    },

    danger: {
      base: {
        bg: '#FEF2F2',
        color: 'var(--status-danger)',
        border: '1px solid #FECACA',
      },
      hover: () => ({
        bg: '#FEE2E2',
        borderColor: '#FCA5A5',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(240,68,56,0.25)',
      }),
      active: { transform: 'translateY(0)' },
      shineColor: 'rgba(240,68,56,0.1)',
      shineOpacity: 1,
      rippleBg: () => 'rgba(240,68,56,0.15)',
    },
  };
}

interface AppButtonProps extends Omit<ButtonProps, 'variant' | 'loading' | 'loadingText' | 'size'> {
  variant?: Variant;
  buttonSize?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  enableRipple?: boolean;
  fullWidth?: boolean;
}

export function AdvancedButton({
  variant = 'primary',
  buttonSize = 'md',
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  children,
  disabled,
  enableRipple = true,
  fullWidth = false,
  onClick,
  ...rest
}: AppButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const primaryGlow10 = cssVarToRgba('--brand-primary', 0.1);
  const primaryGlow25 = cssVarToRgba('--brand-primary', 0.25);
  const primaryGlow35 = cssVarToRgba('--brand-primary', 0.35);

  const variants = buildVariants(primaryGlow25, primaryGlow35, primaryGlow10);
  const cfg = variants[variant];
  const sizes = SIZE_MAP[buttonSize];

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableRipple && !disabled && !loading) {
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const id = Date.now();
        setRipples((prev) => [...prev, { id, x, y }]);
        setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
      }
      onClick?.(e);
    },
    [enableRipple, disabled, loading, onClick],
  );

  return (
    <Button
      {...cfg.base}
      h={sizes.h}
      px={sizes.px}
      fontSize={sizes.fontSize}
      position="relative"
      overflow="hidden"
      width={fullWidth ? '100%' : 'auto'}
      fontWeight="600"
      fontFamily="Montserrat, sans-serif"
      borderRadius="8px"
      transition="all 0.25s ease-in-out"
      _hover={cfg.hover(primaryGlow25) as object}
      _active={cfg.active as object}
      disabled={disabled || loading}
      onClick={handleClick}
      css={{
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: cfg.shineColor,
          transform: 'translate(-50%, -50%) scale(0)',
          transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: cfg.shineOpacity,
        },
        '&:hover::after': {
          transform: 'translate(-50%, -50%) scale(1)',
        },

        '& > *': { position: 'relative', zIndex: 1 },
      }}
      {...rest}
    >
      {}
      {loading ? (
        <Flex align="center" gap="0.8rem" position="relative" zIndex={1}>
          <Spinner size="sm" />
          {loadingText && <Text fontFamily="Montserrat, sans-serif">{loadingText}</Text>}
        </Flex>
      ) : (
        <Flex align="center" gap="0.6rem" position="relative" zIndex={1}>
          {leftIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{rightIcon}</span>}
        </Flex>
      )}

      {}
      {ripples.map((r) => (
        <Box
          key={r.id}
          position="absolute"
          w="300px"
          h="300px"
          borderRadius="50%"
          bg={cfg.rippleBg(primaryGlow25)}
          left={`${r.x}px`}
          top={`${r.y}px`}
          zIndex={0}
          pointerEvents="none"
          css={{
            animation: `${rippleAnim} 0.6s ease-out forwards`,
          }}
        />
      ))}
    </Button>
  );
}

export default AdvancedButton;
