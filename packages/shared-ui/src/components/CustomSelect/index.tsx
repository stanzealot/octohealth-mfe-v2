import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export default function CustomSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  required,
  disabled,
  style,
}: CustomSelectProps) {
  return (
    <Box>
      {label && (
        <Text
          as="label"
          display="block"
          fontSize="1.4rem"
          fontWeight="500"
          color="#344054"
          fontFamily="Montserrat, sans-serif"
          mb="0.6rem"
        >
          {label}
          {required && <span style={{ color: '#D92D20', marginLeft: '2px' }}>*</span>}
        </Text>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          height: '4.4rem',
          padding: '0 1.4rem',
          border: '1px solid #D0D5DD',
          borderRadius: '8px',
          fontSize: '1.4rem',
          fontFamily: 'Montserrat, sans-serif',
          color: value ? '#101828' : '#667085',
          background: disabled ? '#F9FAFB' : '#fff',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23667085' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1.2rem center',
          paddingRight: '4rem',
          ...style,
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </Box>
  );
}
