import React, { type ReactNode, memo } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Search, SlidersHorizontal } from 'lucide-react';
import BaseDataTable, { type BaseDataTableProps } from '../BaseDataTable';

export interface ReusableDataTableProps<T> extends BaseDataTableProps<T> {
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showFilter?: boolean;
  onFilterClick?: () => void;
  showActions?: boolean;

  actionButtons?: ReactNode;
}

function ReusableDataTable<T>({
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Search here...',
  showSearch = true,
  showFilter = true,
  onFilterClick,
  showActions = true,
  actionButtons,

  ...baseProps
}: ReusableDataTableProps<T>) {
  const hasToolbar =
    (showSearch && !!onSearchChange) || showFilter || (showActions && !!actionButtons);

  return (
    <Box w="100%">
      {}
      {hasToolbar && (
        <Flex
          flexDir={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          gap="1.2rem"
          py="1.6rem"
          flexWrap="wrap"
        >
          {}
          <Flex align="center" gap="1rem" flex={1} flexWrap="wrap">
            {showSearch && onSearchChange && (
              <Box
                position="relative"
                flex={{ base: 1, md: 'none' }}
                w={{ base: '100%', md: '32rem' }}
                minW={0}
              >
                <Box
                  position="absolute"
                  left="1.2rem"
                  top="50%"
                  transform="translateY(-50%)"
                  color="var(--text-placeholder)"
                  pointerEvents="none"
                  display="flex"
                >
                  <Search size={16} />
                </Box>
                <input
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  style={{
                    width: '100%',
                    height: '4rem',
                    paddingLeft: '3.6rem',
                    paddingRight: '1.2rem',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '8px',
                    fontSize: '1.4rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'Montserrat, sans-serif',
                    outline: 'none',
                    background: 'var(--surface-card)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--brand-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(12,101,37,0.10)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--surface-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </Box>
            )}

            {showFilter && (
              <Box
                as="button"
                display="flex"
                alignItems="center"
                gap="0.6rem"
                h="4rem"
                px="1.4rem"
                border="1px solid var(--surface-border)"
                borderRadius="8px"
                bg="var(--surface-card)"
                cursor="pointer"
                fontSize="1.4rem"
                color="var(--text-secondary)"
                fontFamily="Montserrat, sans-serif"
                whiteSpace="nowrap"
                transition="all 0.2s ease"
                _hover={{
                  borderColor: 'var(--brand-primary)',
                  color: 'var(--brand-primary)',
                  bg: 'var(--brand-primary-light)',
                }}
                onClick={onFilterClick}
              >
                <SlidersHorizontal size={15} />
                Filter
              </Box>
            )}
          </Flex>

          {}
          {showActions && actionButtons && (
            <Flex
              align="center"
              gap="1rem"
              flexWrap="wrap"
              justify={{ base: 'flex-end', md: 'flex-start' }}
            >
              {actionButtons}
            </Flex>
          )}
        </Flex>
      )}

      {}
      <BaseDataTable<T> {...baseProps} />
    </Box>
  );
}

export default memo(ReusableDataTable) as typeof ReusableDataTable;
