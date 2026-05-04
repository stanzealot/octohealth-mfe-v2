import React, { useState, type CSSProperties } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Eye, EyeOff } from 'lucide-react';

interface AppInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  toggleVisibility?: boolean;
  style?: CSSProperties;
  containerStyle?: CSSProperties;
  labelStyle?: CSSProperties;
}

export function AppInput({
  label,
  errorMessage,
  toggleVisibility,
  style,
  containerStyle,
  labelStyle,
  type = 'text',
  required,
  disabled,
  ...rest
}: AppInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = toggleVisibility ? (showPassword ? 'text' : 'password') : type;

  return (
    <Box style={containerStyle}>
      {label && (
        <Text
          as="label"
          display="block"
          fontSize="1.4rem"
          fontWeight="500"
          color="#344054"
          fontFamily="Montserrat, sans-serif"
          mb="0.6rem"
          style={labelStyle}
        >
          {label}
          {required && <span style={{ color: '#D92D20', marginLeft: '2px' }}>*</span>}
        </Text>
      )}
      <Box position="relative">
        <input
          type={inputType}
          disabled={disabled}
          style={{
            width: '100%',
            height: '4.4rem',
            padding: '0 1.4rem',
            paddingRight: toggleVisibility ? '4.4rem' : '1.4rem',
            border: `1px solid ${errorMessage ? '#FDA29B' : '#D0D5DD'}`,
            borderRadius: '8px',
            fontSize: '1.4rem',
            fontFamily: 'Montserrat, sans-serif',
            color: '#101828',
            background: disabled ? '#F9FAFB' : '#fff',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box',
            ...style,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#0C6525';
            e.target.style.boxShadow = '0 0 0 4px rgba(12,101,37,0.06)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errorMessage ? '#FDA29B' : '#D0D5DD';
            e.target.style.boxShadow = 'none';
          }}
          {...rest}
        />
        {toggleVisibility && (
          <Box
            position="absolute"
            right="1.4rem"
            top="50%"
            transform="translateY(-50%)"
            cursor="pointer"
            display="flex"
            alignItems="center"
            color="#667085"
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Box>
        )}
      </Box>
      {errorMessage && (
        <Text fontSize="1.2rem" color="#D92D20" mt="0.4rem" fontFamily="Montserrat, sans-serif">
          {errorMessage}
        </Text>
      )}
    </Box>
  );
}

export default AppInput;
