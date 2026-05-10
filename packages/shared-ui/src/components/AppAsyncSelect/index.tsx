import React, { useId, memo } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import type {
  StylesConfig,
  GroupBase,
  OptionsOrGroups,
  DropdownIndicatorProps,
  ClearIndicatorProps,
} from 'react-select';
import { ChevronDown, X } from 'lucide-react';
import { Box, Text } from '@chakra-ui/react';

export interface AsyncSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface LoadOptionsResult<Opt = AsyncSelectOption, Additional = unknown> {
  options: Opt[];
  hasMore?: boolean;
  additional?: Additional;
}

export interface AppAsyncSelectProps<
  Opt extends AsyncSelectOption = AsyncSelectOption,
  Additional = unknown,
  IsMulti extends boolean = false,
> {
  loadOptions: (
    inputValue: string,
    prevOptions: OptionsOrGroups<Opt, GroupBase<Opt>>,
    additional?: Additional,
  ) => Promise<LoadOptionsResult<Opt, Additional>>;

  value?: IsMulti extends true ? readonly Opt[] : Opt | null;
  onChange?: (val: IsMulti extends true ? readonly Opt[] : Opt | null) => void;

  defaultAdditional?: Additional;

  debounceTimeout?: number;

  cacheUniqs?: unknown[];

  label?: string;
  placeholder?: string;
  errorMessage?: string;
  required?: boolean;
  name?: string;

  isMulti?: IsMulti;
  isSearchable?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  closeMenuOnSelect?: boolean;
  menuPlacement?: 'auto' | 'top' | 'bottom';
  menuMaxHeight?: string;
  height?: string;
  width?: string;
}

const SpinKeyframe = () => (
  <style>{`@keyframes appasyncselect-spin{to{transform:rotate(360deg)}}`}</style>
);

function buildStyles<Opt extends AsyncSelectOption, IsMulti extends boolean>(
  height: string,
  menuMaxHeight: string,
): StylesConfig<Opt, IsMulti, GroupBase<Opt>> {
  return {
    container: (base) => ({ ...base, width: '100%' }),

    control: (base, state) => ({
      ...base,
      height,
      minHeight: height,
      paddingLeft: '0.4rem',
      paddingRight: '0.2rem',
      borderRadius: '8px',
      fontSize: '1.4rem',
      fontFamily: 'Montserrat, sans-serif',
      backgroundColor: state.isDisabled ? 'var(--hover-bg)' : 'var(--surface-card)',
      borderColor: state.isFocused ? 'var(--brand-primary)' : 'var(--surface-border)',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(12,101,37,0.08)' : 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      cursor: state.isDisabled ? 'not-allowed' : 'default',
      '&:hover': { borderColor: 'var(--brand-primary)' },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: '0 0.4rem',
      display: 'flex',
      alignItems: 'center',
    }),

    singleValue: (base) => ({
      ...base,
      color: 'var(--text-primary)',
      fontSize: '1.4rem',
      fontFamily: 'Montserrat, sans-serif',
    }),

    multiValue: (base) => ({
      ...base,
      backgroundColor: 'var(--brand-primary-light)',
      borderRadius: '4px',
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: 'var(--brand-primary)',
      fontSize: '1.2rem',
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 500,
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: 'var(--brand-primary)',
      ':hover': {
        backgroundColor: 'var(--brand-primary)',
        color: 'white',
      },
    }),

    placeholder: (base) => ({
      ...base,
      color: 'var(--text-placeholder)',
      fontSize: '1.4rem',
      fontFamily: 'Montserrat, sans-serif',
      margin: 0,
    }),

    input: (base) => ({
      ...base,
      color: 'var(--text-primary)',
      fontSize: '1.4rem',
      fontFamily: 'Montserrat, sans-serif',
      margin: 0,
      padding: 0,
    }),

    indicatorSeparator: () => ({ display: 'none' }),

    dropdownIndicator: (base, state) => ({
      ...base,
      padding: '0 0.8rem',
      color: state.isFocused ? 'var(--brand-primary)' : 'var(--text-muted)',
      transition: 'color 0.2s',
    }),

    clearIndicator: (base) => ({
      ...base,
      padding: '0 0.4rem',
      color: 'var(--text-muted)',
      ':hover': { color: 'var(--status-danger)' },
    }),

    loadingIndicator: (base) => ({ ...base, padding: '0 0.8rem' }),

    menu: (base) => ({
      ...base,
      backgroundColor: 'var(--surface-card)',
      border: '1px solid var(--surface-border)',
      borderRadius: '10px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
      marginTop: '0.4rem',
      overflow: 'hidden',
      zIndex: 9999,
    }),

    menuList: (base) => ({
      ...base,
      padding: '0.4rem',
      maxHeight: menuMaxHeight,
      fontSize: '1.4rem',
      overflowY: 'auto',
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor:
        state.isFocused || state.isSelected ? 'var(--brand-primary-light)' : 'transparent',
      color: state.isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
      fontWeight: state.isSelected ? 600 : 400,
      fontSize: '1.4rem',
      fontFamily: 'Montserrat, sans-serif',
      borderRadius: '6px',
      padding: '1rem 1.2rem',
      cursor: state.isDisabled ? 'not-allowed' : 'pointer',
      opacity: state.isDisabled ? 0.5 : 1,
      transition: 'background 0.15s',
      ':active': { backgroundColor: 'var(--brand-primary-light)' },
    }),

    noOptionsMessage: (base) => ({
      ...base,
      color: 'var(--text-muted)',
      fontSize: '1.4rem',
      fontFamily: 'Montserrat, sans-serif',
      padding: '1.2rem',
    }),

    loadingMessage: (base) => ({
      ...base,
      color: 'var(--text-muted)',
      fontSize: '1.4rem',
      fontFamily: 'Montserrat, sans-serif',
      padding: '1.2rem',
    }),

    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
  };
}

const DropdownIndicator = (
  props: DropdownIndicatorProps<AsyncSelectOption, boolean, GroupBase<AsyncSelectOption>>,
) => {
  const { innerRef, innerProps, selectProps } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 0.8rem',
        color: 'var(--text-muted)',
      }}
    >
      <ChevronDown
        size={16}
        style={{
          transform: selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }}
      />
    </div>
  );
};

const ClearIndicator = (
  props: ClearIndicatorProps<AsyncSelectOption, boolean, GroupBase<AsyncSelectOption>>,
) => {
  const { innerRef, innerProps } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 0.4rem',
        color: 'var(--text-muted)',
        cursor: 'pointer',
      }}
    >
      <X size={14} />
    </div>
  );
};

const LoadingIndicator = () => (
  <Box
    w="16px"
    h="16px"
    mr="0.8rem"
    borderRadius="50%"
    border="2px solid var(--surface-border)"
    borderTopColor="var(--brand-primary)"
    style={{ animation: 'appasyncselect-spin 0.8s linear infinite' }}
  />
);

function AppAsyncSelectBase<
  Opt extends AsyncSelectOption = AsyncSelectOption,
  Additional = unknown,
  IsMulti extends boolean = false,
>({
  loadOptions,
  value,
  onChange,
  defaultAdditional,
  debounceTimeout = 300,
  cacheUniqs = [],
  label,
  placeholder = 'Search...',
  errorMessage,
  required,
  name,
  isMulti = false as IsMulti,
  isSearchable = true,
  isDisabled,
  isLoading,
  closeMenuOnSelect,
  menuPlacement = 'auto',
  menuMaxHeight = '22rem',
  height = '4.4rem',
  width = '100%',
}: AppAsyncSelectProps<Opt, Additional, IsMulti>) {
  const uid = useId();
  const styles = buildStyles<Opt, IsMulti>(height, menuMaxHeight);

  return (
    <>
      <SpinKeyframe />
      <Box w={width} display="flex" flexDir="column" gap="0.5rem">
        {}
        {label && (
          <Text
            as="label"
            htmlFor={uid}
            fontSize="1.4rem"
            fontWeight="500"
            color="var(--text-secondary)"
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
        <AsyncPaginate<Opt, GroupBase<Opt>, Additional, IsMulti>
          inputId={uid}
          name={name}
          value={value as IsMulti extends true ? readonly Opt[] : Opt | null}
          onChange={
            onChange as
              | ((val: IsMulti extends true ? readonly Opt[] : Opt | null) => void)
              | undefined
          }
          loadOptions={loadOptions}
          defaultAdditional={defaultAdditional}
          debounceTimeout={debounceTimeout}
          cacheUniqs={cacheUniqs}
          isMulti={isMulti}
          isSearchable={isSearchable}
          isDisabled={isDisabled}
          isLoading={isLoading}
          placeholder={placeholder}
          menuPlacement={menuPlacement}
          closeMenuOnSelect={closeMenuOnSelect ?? !isMulti}
          isOptionDisabled={(opt) => !!(opt as Opt).disabled}
          loadingMessage={() => 'Loading...'}
          noOptionsMessage={() => 'No options found'}
          menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
          styles={styles}
          components={{
            DropdownIndicator,
            ClearIndicator,
            LoadingIndicator,
            IndicatorSeparator: () => null,
          }}
          isClearable
        />

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
    </>
  );
}

export const AppAsyncSelect = memo(AppAsyncSelectBase) as typeof AppAsyncSelectBase;
export default AppAsyncSelect;
