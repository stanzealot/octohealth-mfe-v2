import React, { useCallback, useId, memo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

/* ─── Size tokens ──────────────────────────────────────────────────── */
const SIZE = {
  sm: { track: ['3rem',   '1.6rem'], thumb: '1.2rem', offset: '0.2rem', font: '1.2rem' },
  md: { track: ['3.6rem', '2rem'],   thumb: '1.6rem', offset: '0.2rem', font: '1.4rem' },
  lg: { track: ['4.4rem', '2.4rem'], thumb: '2rem',   offset: '0.2rem', font: '1.4rem' },
} as const;

/* ─── Props ────────────────────────────────────────────────────────── */
export interface AppSwitchProps {
  /** Controlled on/off state */
  checked?: boolean;
  /** Alias (Chakra-style) */
  isChecked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Label rendered to the right of the track */
  label?: string;
  /** Helper text below the label */
  description?: string;
  /** Show the label on the LEFT instead of the right */
  labelPosition?: 'left' | 'right';
  name?: string;
  id?: string;
  onChange?: (checked: boolean) => void;
  /** Alias (Chakra-style) */
  onCheckedChange?: (checked: boolean) => void;
}

/* ─── Component ────────────────────────────────────────────────────── */
function AppSwitchBase({
  checked,
  isChecked,
  size = 'md',
  disabled = false,
  label,
  description,
  labelPosition = 'right',
  name,
  id,
  onChange,
  onCheckedChange,
}: AppSwitchProps) {
  const uid    = useId();
  const htmlId = id ?? uid;
  const isOn   = checked ?? isChecked ?? false;

  const { track, thumb, offset, font } = SIZE[size];
  const [trackW, trackH] = track;

  const handleToggle = useCallback(() => {
    if (disabled) return;
    const next = !isOn;
    onChange?.(next);
    onCheckedChange?.(next);
  }, [disabled, isOn, onChange, onCheckedChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleToggle();
      }
    },
    [handleToggle],
  );

  /* Thumb translate: moves from left-offset to right-offset */
  const thumbTranslate = isOn
    ? `calc(${trackW} - ${thumb} - ${offset})`
    : offset;

  const labelNode = (label || description) && (
    <Flex direction="column" gap="0.1rem">
      {label && (
        <Text
          as="label"
          htmlFor={htmlId}
          fontSize={font}
          fontWeight="500"
          fontFamily="Montserrat, sans-serif"
          color={disabled ? 'var(--text-muted)' : 'var(--text-secondary)'}
          cursor={disabled ? 'not-allowed' : 'pointer'}
          userSelect="none"
          lineHeight="1.4"
        >
          {label}
        </Text>
      )}
      {description && (
        <Text
          fontSize="1.2rem"
          color="var(--text-muted)"
          fontFamily="Montserrat, sans-serif"
          userSelect="none"
          lineHeight="1.4"
        >
          {description}
        </Text>
      )}
    </Flex>
  );

  return (
    <Flex
      align="center"
      gap="0.8rem"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.55 : 1}
      onClick={handleToggle}
    >
      {/* Hidden native checkbox for form / a11y */}
      <input
        type="checkbox"
        id={htmlId}
        name={name}
        checked={isOn}
        disabled={disabled}
        onChange={() => {}}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        aria-label={label}
      />

      {labelPosition === 'left' && labelNode}

      {/* Track */}
      <Box
        role="switch"
        aria-checked={isOn}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        position="relative"
        w={trackW}
        h={trackH}
        borderRadius="full"
        flexShrink={0}
        bg={isOn ? 'var(--brand-primary)' : 'var(--surface-border)'}
        transition="background 0.2s ease"
        _hover={
          !disabled
            ? { bg: isOn ? 'var(--brand-primary-dark)' : 'var(--text-placeholder)' }
            : undefined
        }
        _focusVisible={{
          outline: 'none',
          boxShadow: isOn
            ? '0 0 0 3px rgba(12,101,37,0.20)'
            : '0 0 0 3px rgba(0,0,0,0.10)',
        }}
      >
        {/* Thumb */}
        <Box
          position="absolute"
          top={offset}
          left={thumbTranslate}
          w={thumb}
          h={thumb}
          borderRadius="full"
          bg="white"
          boxShadow="0 1px 4px rgba(0,0,0,0.18)"
          transition="left 0.2s cubic-bezier(0.4,0,0.2,1)"
          pointerEvents="none"
        />
      </Box>

      {labelPosition === 'right' && labelNode}
    </Flex>
  );
}

export const AppSwitch = memo(AppSwitchBase);
export default AppSwitch;
