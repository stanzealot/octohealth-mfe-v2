import React, { useRef, useCallback, useId, memo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Check } from 'lucide-react';

const SIZE = {
  sm: { box: '1.6rem', gap: '0.6rem', font: '1.2rem', icon: 10 },
  md: { box: '1.8rem', gap: '0.7rem', font: '1.4rem', icon: 12 },
  lg: { box: '2rem', gap: '0.8rem', font: '1.4rem', icon: 13 },
} as const;

export interface AppCheckboxProps {
  checked?: boolean;

  isChecked?: boolean;

  isIndeterminate?: boolean;
  label?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;

  description?: string;
  id?: string;
  name?: string;
  value?: string;
  onChange?: (checked: boolean) => void;

  onClick?: () => void;
}

function AppCheckboxBase({
  checked,
  isChecked,
  isIndeterminate = false,
  label,
  children,
  size = 'md',
  disabled = false,
  description,
  id,
  name,
  value,
  onChange,
  onClick,
}: AppCheckboxProps) {
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const htmlId = id ?? uid;

  const isOn = checked ?? isChecked ?? false;

  const { box, gap, font, icon } = SIZE[size];

  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick?.();
    onChange?.(!isOn);
  }, [disabled, isOn, onChange, onClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  return (
    <Flex
      align="flex-start"
      gap={gap}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.55 : 1}
      onClick={handleClick}
      role="group"
    >
      {}
      <input
        ref={inputRef}
        type="checkbox"
        id={htmlId}
        name={name}
        value={value}
        checked={isOn}
        disabled={disabled}
        onChange={() => {}}
        aria-checked={isIndeterminate ? 'mixed' : isOn}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />

      {}
      <Box
        as="span"
        role="checkbox"
        aria-checked={isIndeterminate ? 'mixed' : isOn}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        flexShrink={0}
        mt="0.1rem"
        w={box}
        h={box}
        borderRadius="4px"
        border="1.5px solid"
        borderColor={isOn || isIndeterminate ? 'var(--brand-primary)' : 'var(--surface-border)'}
        bg={isOn || isIndeterminate ? 'var(--brand-primary)' : 'var(--surface-card)'}
        display="flex"
        alignItems="center"
        justifyContent="center"
        transition="background 0.15s, border-color 0.15s, box-shadow 0.15s"
        _groupHover={{
          borderColor: disabled ? undefined : 'var(--brand-primary)',
        }}
        _focusVisible={{
          outline: 'none',
          boxShadow: '0 0 0 3px rgba(12,101,37,0.18)',
        }}
      >
        {isIndeterminate ? (
          <Box w={`${icon - 2}px`} h="2px" bg="white" borderRadius="1px" />
        ) : isOn ? (
          <Check size={icon} color="white" strokeWidth={2.5} />
        ) : null}
      </Box>

      {}
      {(label || children || description) && (
        <Flex direction="column" gap="0.1rem">
          {(label || children) && (
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
              {children ?? label}
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
      )}
    </Flex>
  );
}

export const AppCheckbox = memo(AppCheckboxBase);
export default AppCheckbox;
