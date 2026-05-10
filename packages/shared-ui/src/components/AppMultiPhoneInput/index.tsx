import React, { memo, useCallback, useId } from 'react';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import 'react-phone-number-input/style.css';
import { Controller, type UseFormReturn, type Control, type FieldValues } from 'react-hook-form';
import { Box, Flex, Text } from '@chakra-ui/react';
import type { Country } from 'react-phone-number-input';
import { Plus, X } from 'lucide-react';

interface TagProps {
  label: string;
  onRemove: () => void;
}
const PhoneTag = memo(function PhoneTag({ label, onRemove }: TagProps) {
  return (
    <Flex
      align="center"
      gap="0.5rem"
      h="2.8rem"
      px="1rem"
      borderRadius="0.8rem"
      border="1px solid var(--surface-border)"
      bg="var(--surface-card)"
      color="var(--text-secondary)"
      fontSize="1.2rem"
      fontFamily="Montserrat, sans-serif"
      flexShrink={0}
    >
      <Text as="span" fontFamily="Montserrat, sans-serif" fontSize="1.2rem">
        {label}
      </Text>
      <Box
        as="button"
        type="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="16px"
        h="16px"
        borderRadius="50%"
        bg="var(--surface-border)"
        border="none"
        cursor="pointer"
        p={0}
        flexShrink={0}
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        _hover={{ bg: 'var(--status-danger)', color: 'white' }}
        transition="background 0.15s"
      >
        <X size={10} />
      </Box>
    </Flex>
  );
});

export interface AppMultiPhoneInputProps {
  handler: UseFormReturn<FieldValues>;

  title?: string;

  listName?: string;

  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  id?: string;

  defaultCountry?: string;

  tagPlacement?: 'top' | 'bottom';
}

function AppMultiPhoneInputBase({
  handler,
  title = 'phone',
  listName = 'phoneList',
  label,
  placeholder = 'Enter phone number…',
  required,
  disabled,
  errorMessage,
  id,
  defaultCountry = 'NG',
  tagPlacement = 'bottom',
}: AppMultiPhoneInputProps) {
  const uid = useId();
  const htmlId = id ?? uid;

  const { control, watch, setValue } = handler;
  const phoneList: string[] = watch(listName) || [];
  const currentInput: string = watch(title) || '';

  const handleAdd = useCallback(() => {
    const trimmed = currentInput?.toString().trim();
    if (!trimmed) return;
    if (!phoneList.includes(trimmed)) {
      setValue(listName, [...phoneList, trimmed]);
    }
    setValue(title, '');
  }, [currentInput, phoneList, listName, title, setValue]);

  const handleDelete = useCallback(
    (index: number) => {
      setValue(
        listName,
        phoneList.filter((_, i) => i !== index),
      );
    },
    [phoneList, listName, setValue],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAdd();
      }
    },
    [handleAdd],
  );

  const tagList = (
    <Flex gap="0.6rem" flexWrap="wrap" w="100%">
      {phoneList.map((tag, i) => (
        <PhoneTag key={`${tag}-${i}`} label={tag} onRemove={() => handleDelete(i)} />
      ))}
    </Flex>
  );

  return (
    <Box display="flex" flexDir="column" gap="0.5rem" w="100%">
      {}
      {label && (
        <Text
          as="label"
          htmlFor={htmlId}
          fontSize="1.4rem"
          fontWeight="500"
          color={disabled ? 'var(--text-muted)' : 'var(--text-secondary)'}
          fontFamily="Montserrat, sans-serif"
          display="flex"
          alignItems="center"
          gap="2px"
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
      {tagPlacement === 'top' && phoneList.length > 0 && tagList}

      {}
      <Flex
        align="center"
        w="100%"
        gap="0.8rem"
        px="1rem"
        minH="4.4rem"
        borderRadius="8px"
        border="1px solid var(--surface-border)"
        bg={disabled ? 'var(--hover-bg)' : 'var(--surface-card)'}
        opacity={disabled ? 0.6 : 1}
        transition="border-color 0.2s, box-shadow 0.2s"
        _focusWithin={{
          borderColor: 'var(--brand-primary)',
          boxShadow: '0 0 0 3px rgba(12,101,37,0.08)',
        }}
        onKeyDown={handleKeyDown}
      >
        {}
        <Box flex={1}>
          <Controller
            control={control as Control}
            name={title}
            render={({ field: { onChange: fieldOnChange, value } }) => (
              <PhoneInputWithCountry
                control={control as Control}
                name={title}
                defaultCountry={defaultCountry as Country}
                international
                withCountryCallingCode
                disabled={disabled}
                placeholder={placeholder}
                value={value || ''}
                onChange={(val) => fieldOnChange(val ?? '')}
                style={{
                  height: '4.0rem',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '1.4rem',
                  fontFamily: 'Montserrat, sans-serif',
                  color: 'var(--text-primary)',
                }}
              />
            )}
          />
        </Box>

        {}
        {!disabled && (
          <Box
            as="button"
            type="button"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="3.2rem"
            h="3.2rem"
            borderRadius="6px"
            flexShrink={0}
            bg="var(--brand-primary-light)"
            border="1px solid var(--brand-primary)"
            cursor="pointer"
            onClick={handleAdd}
            aria-label="Add phone number"
            transition="background 0.15s, transform 0.1s"
            _hover={{ bg: 'var(--brand-primary)', color: 'white' }}
            _active={{ transform: 'scale(0.94)' }}
            color="var(--brand-primary)"
          >
            <Plus size={16} />
          </Box>
        )}
      </Flex>

      {}
      {tagPlacement === 'bottom' && phoneList.length > 0 && tagList}

      {}
      {errorMessage && (
        <Text
          fontSize="1.2rem"
          color="var(--status-danger)"
          fontFamily="Montserrat, sans-serif"
          mt="0.2rem"
        >
          {errorMessage}
        </Text>
      )}
    </Box>
  );
}

export const AppMultiPhoneInput = memo(AppMultiPhoneInputBase);
export default AppMultiPhoneInput;
