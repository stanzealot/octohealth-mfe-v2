import React, { memo, useCallback, useId } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Plus, X } from 'lucide-react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';

const TextTag = memo(function TextTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
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
        transition="background 0.15s"
        _hover={{ bg: 'var(--status-danger)', color: 'white' }}
      >
        <X size={10} />
      </Box>
    </Flex>
  );
});

export interface AppTextTagInputProps {
  handler: UseFormReturn<FieldValues>;

  title?: string;

  listName?: string;

  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  id?: string;

  tagPlacement?: 'top' | 'bottom';
}

function AppTextTagInputBase({
  handler,
  title = 'input',
  listName = 'tagList',
  label,
  placeholder = 'Type and press Enter or ","…',
  required,
  disabled,
  errorMessage,
  id,
  tagPlacement = 'bottom',
}: AppTextTagInputProps) {
  const uid = useId();
  const htmlId = id ?? uid;

  const { register, watch, setValue } = handler;
  const tagList: string[] = watch(listName) || [];
  const currentInput = watch(title) || '';

  const addTag = useCallback(() => {
    const trimmed = currentInput?.toString().trim();
    if (!trimmed) return;
    if (!tagList.includes(trimmed)) {
      setValue(listName, [...tagList, trimmed]);
    }
    setValue(title, '');
  }, [currentInput, tagList, listName, title, setValue]);

  const removeTag = useCallback(
    (index: number) =>
      setValue(
        listName,
        tagList.filter((_, i) => i !== index),
      ),
    [tagList, listName, setValue],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag();
      }

      if (e.key === 'Backspace' && !currentInput && tagList.length > 0) {
        removeTag(tagList.length - 1);
      }
    },
    [addTag, currentInput, tagList, removeTag],
  );

  const tagNodes = tagList.length > 0 && (
    <Flex gap="0.6rem" flexWrap="wrap" w="100%">
      {tagList.map((tag, i) => (
        <TextTag key={`${tag}-${i}`} label={tag} onRemove={() => removeTag(i)} />
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
      {tagPlacement === 'top' && tagNodes}

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
      >
        <Box
          as="input"
          id={htmlId}
          flex={1}
          border="none"
          outline="none"
          bg="transparent"
          fontSize="1.4rem"
          fontFamily="Montserrat, sans-serif"
          color="var(--text-primary)"
          placeholder={placeholder}
          disabled={disabled}
          _placeholder={{ color: 'var(--text-placeholder)' }}
          h="4.0rem"
          {...register(title)}
          onKeyDown={handleKeyDown}
        />

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
            onClick={addTag}
            aria-label="Add item"
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
      {tagPlacement === 'bottom' && tagNodes}

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

export const AppTextTagInput = memo(AppTextTagInputBase);
export default AppTextTagInput;
