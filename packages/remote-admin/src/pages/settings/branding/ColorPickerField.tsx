import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { HexColorPicker, HexColorInput } from 'react-colorful';

interface ColorPickerFieldProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPickerField({ label, value, onChange }: ColorPickerFieldProps) {
  return (
    <Box>
      <Text
        fontSize="1.3rem"
        fontWeight="500"
        color="var(--text-secondary)"
        fontFamily="Montserrat, sans-serif"
        mb="1rem"
      >
        {label}
      </Text>
      <Flex gap="1.6rem" align="flex-start" flexWrap="wrap">
        <HexColorPicker
          color={value}
          onChange={onChange}
          style={{ width: '200px', height: '160px', borderRadius: '8px' }}
        />
        <Flex direction="column" gap="0.8rem" justify="flex-end" pt="0.4rem">
          {}
          <Box
            w="5.6rem"
            h="5.6rem"
            borderRadius="10px"
            bg={value}
            border="2px solid var(--surface-border)"
            boxShadow="0 2px 8px rgba(0,0,0,0.12)"
          />
          {}
          <Box position="relative">
            <Text
              position="absolute"
              left="1.2rem"
              top="50%"
              style={{ transform: 'translateY(-50%)' }}
              fontSize="1.3rem"
              color="var(--text-muted)"
              fontFamily="monospace"
              pointerEvents="none"
            >
              #
            </Text>
            <HexColorInput
              color={value}
              onChange={onChange}
              prefixed={false}
              style={{
                width: '120px',
                height: '3.8rem',
                paddingLeft: '2.4rem',
                paddingRight: '1rem',
                border: '1px solid var(--surface-border)',
                borderRadius: '8px',
                fontSize: '1.4rem',
                fontFamily: 'monospace',
                color: 'var(--text-primary)',
                background: 'var(--surface-card)',
                outline: 'none',
              }}
            />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
