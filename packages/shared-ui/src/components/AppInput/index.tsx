import React, { useState, useRef, useCallback, useId, type CSSProperties } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Eye, EyeOff, X } from 'lucide-react';

export interface AppInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  errorMessage?: string;
  hint?: string;
  width?: string;

  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;

  showPasswordToggle?: boolean;

  clearable?: boolean;
  onClear?: () => void;

  containerStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  labelStyle?: CSSProperties;
}

export function AppInput({
  label,
  errorMessage,
  hint,
  width = '100%',

  leftIcon,
  rightElement,

  showPasswordToggle = false,
  clearable = false,
  onClear,

  containerStyle,
  inputStyle,
  labelStyle,

  type = 'text',
  required,
  disabled,
  value,
  onChange,
  ...rest
}: AppInputProps) {
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!errorMessage;
  const hasValue = value !== undefined ? String(value).length > 0 : false;
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  const borderColor = hasError
    ? 'var(--status-danger)'
    : isFocused
      ? 'var(--brand-primary)'
      : 'var(--surface-border)';

  const boxShadow = isFocused
    ? hasError
      ? '0 0 0 3px rgba(240,68,56,0.08)'
      : '0 0 0 3px rgba(12,101,37,0.08)'
    : 'none';

  const showClearBtn = clearable && hasValue && !disabled;
  const showPasswordBtn = showPasswordToggle && !rightElement;
  const hasRightSlot = !!(rightElement || showClearBtn || showPasswordBtn);

  const handleClear = useCallback(() => {
    onClear?.();
    inputRef.current?.focus();
  }, [onClear]);

  return (
    <Box display="flex" flexDir="column" gap="0.5rem" w={width} style={containerStyle}>
      {}
      {label && (
        <Text
          as="label"
          htmlFor={uid}
          fontSize="1.4rem"
          fontWeight="500"
          color="var(--text-secondary)"
          fontFamily="Montserrat, sans-serif"
          style={labelStyle}
        >
          {label}
          {required && (
            <Text as="span" color="var(--status-danger)" ml="2px" aria-hidden>
              *
            </Text>
          )}
        </Text>
      )}

      {}
      <Box
        position="relative"
        display="flex"
        alignItems="center"
        border={`1px solid ${borderColor}`}
        borderRadius="8px"
        bg={disabled ? 'var(--hover-bg)' : 'var(--surface-card)'}
        boxShadow={boxShadow}
        transition="border-color 0.2s, box-shadow 0.2s"
        overflow="hidden"
      >
        {}
        {leftIcon && (
          <Box
            position="absolute"
            left="1.2rem"
            display="flex"
            alignItems="center"
            color="var(--text-muted)"
            pointerEvents="none"
            zIndex={1}
          >
            {leftIcon}
          </Box>
        )}

        {}
        <input
          ref={inputRef}
          id={uid}
          type={inputType}
          disabled={disabled}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '100%',
            height: '4.4rem',
            paddingLeft: leftIcon ? '3.8rem' : '1.4rem',
            paddingRight: hasRightSlot ? '3.8rem' : '1.4rem',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '1.4rem',
            fontFamily: 'Montserrat, sans-serif',
            color: disabled ? 'var(--text-muted)' : 'var(--text-primary)',
            cursor: disabled ? 'not-allowed' : 'text',
            boxSizing: 'border-box',
            ...inputStyle,
          }}
          {...rest}
        />

        {}
        {rightElement ? (
          <Box position="absolute" right="1rem" display="flex" alignItems="center" gap="0.4rem">
            {rightElement}
          </Box>
        ) : (
          <Box position="absolute" right="1rem" display="flex" alignItems="center" gap="0.4rem">
            {}
            {showClearBtn && (
              <Box
                as="button"
                type="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="2rem"
                h="2rem"
                border="none"
                bg="transparent"
                borderRadius="50%"
                color="var(--text-muted)"
                cursor="pointer"
                onClick={handleClear}
                aria-label="Clear input"
                _hover={{ bg: 'var(--hover-bg)', color: 'var(--text-secondary)' }}
                transition="all 0.15s"
              >
                <X size={14} />
              </Box>
            )}

            {}
            {showPasswordBtn && (
              <Box
                as="button"
                type="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="2rem"
                h="2rem"
                border="none"
                bg="transparent"
                borderRadius="50%"
                color="var(--text-muted)"
                cursor="pointer"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                _hover={{ bg: 'var(--hover-bg)', color: 'var(--text-secondary)' }}
                transition="all 0.15s"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {}
      {errorMessage && (
        <Text fontSize="1.2rem" color="var(--status-danger)" fontFamily="Montserrat, sans-serif">
          {errorMessage}
        </Text>
      )}
      {!errorMessage && hint && (
        <Text fontSize="1.2rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
          {hint}
        </Text>
      )}
    </Box>
  );
}

export default AppInput;
