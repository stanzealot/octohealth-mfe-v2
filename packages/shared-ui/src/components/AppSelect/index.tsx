import React, { useId } from 'react';
import {
  Select,
  type ChakraStylesConfig,
  type SelectComponentsConfig,
  chakraComponents,
  type OptionBase,
  type GroupBase,
} from 'chakra-react-select';
import type { SingleValue, MultiValue, ActionMeta } from 'react-select';
import { ChevronDown, X } from 'lucide-react';
import { Box, Text } from '@chakra-ui/react';

export interface SelectOption extends OptionBase {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface AppSelectProps<
  IsMulti extends boolean = false,
  Opt extends SelectOption = SelectOption,
> {
  options?: Opt[];
  value?: IsMulti extends true ? MultiValue<Opt> : SingleValue<Opt>;
  defaultValue?: IsMulti extends true ? MultiValue<Opt> : SingleValue<Opt>;

  onChange?: (
    value: IsMulti extends true ? MultiValue<Opt> : SingleValue<Opt>,
    action: ActionMeta<Opt>,
  ) => void;

  label?: string;
  placeholder?: string;
  errorMessage?: string;
  required?: boolean;

  name?: string;
  isMulti?: IsMulti;
  isSearchable?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  loadingMessage?: string;
  noOptionsMessage?: string;
  closeMenuOnSelect?: boolean;
  menuPlacement?: 'auto' | 'top' | 'bottom';
  menuMaxHeight?: string;

  height?: string;
  width?: string;
}

function buildChakraStyles<Opt extends SelectOption, IsMulti extends boolean>(
  height: string,
  menuMaxHeight: string,
): ChakraStylesConfig<Opt, IsMulti, GroupBase<Opt>> {
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
      '&:hover': {
        borderColor: 'var(--brand-primary)',
      },
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
      _hover: {
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
      bg: 'transparent',
      px: '0.8rem',
      color: state.isFocused ? 'var(--brand-primary)' : 'var(--text-muted)',
      transition: 'color 0.2s',
    }),

    clearIndicator: (base) => ({
      ...base,
      bg: 'transparent',
      px: '0.4rem',
      color: 'var(--text-muted)',
      _hover: { color: 'var(--status-danger)' },
    }),

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
      '&:active': {
        backgroundColor: 'var(--brand-primary-light)',
      },
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
  };
}

function buildComponents<
  Opt extends SelectOption,
  IsMulti extends boolean,
>(): SelectComponentsConfig<Opt, IsMulti, GroupBase<Opt>> {
  return {
    DropdownIndicator: (props) => (
      <chakraComponents.DropdownIndicator {...props}>
        <ChevronDown
          size={16}
          style={{
            transform: props.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </chakraComponents.DropdownIndicator>
    ),

    ClearIndicator: (props) => (
      <chakraComponents.ClearIndicator {...props}>
        <X size={14} />
      </chakraComponents.ClearIndicator>
    ),

    LoadingIndicator: () => (
      <Box
        w="16px"
        h="16px"
        mr="0.8rem"
        borderRadius="50%"
        border="2px solid var(--surface-border)"
        borderTopColor="var(--brand-primary)"
        css={{ animation: 'appselect-spin 0.8s linear infinite' }}
      />
    ),
  };
}

const SpinKeyframe = () => (
  <style>{`@keyframes appselect-spin{to{transform:rotate(360deg)}}`}</style>
);

export function AppSelect<
  IsMulti extends boolean = false,
  Opt extends SelectOption = SelectOption,
>({
  options = [],
  value,
  defaultValue,
  onChange,
  label,
  placeholder = 'Select an option...',
  errorMessage,
  required,
  name,
  isMulti = false as IsMulti,
  isSearchable = true,
  isDisabled,
  isLoading,
  loadingMessage = 'Loading...',
  noOptionsMessage = 'No options available',
  closeMenuOnSelect,
  menuPlacement = 'auto',
  menuMaxHeight = '22rem',
  height = '4.4rem',
  width = '100%',
}: AppSelectProps<IsMulti, Opt>) {
  const uid = useId();

  const chakraStyles = buildChakraStyles<Opt, IsMulti>(height, menuMaxHeight);
  const components = buildComponents<Opt, IsMulti>();

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
        <Select<Opt, IsMulti, GroupBase<Opt>>
          inputId={uid}
          name={name}
          options={options}
          value={value as IsMulti extends true ? MultiValue<Opt> : SingleValue<Opt>}
          defaultValue={defaultValue as IsMulti extends true ? MultiValue<Opt> : SingleValue<Opt>}
          placeholder={placeholder}
          isMulti={isMulti}
          isSearchable={isSearchable}
          isDisabled={isDisabled}
          isLoading={isLoading}
          loadingMessage={() => loadingMessage}
          noOptionsMessage={() => noOptionsMessage}
          menuPlacement={menuPlacement}
          closeMenuOnSelect={closeMenuOnSelect ?? !isMulti}
          menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
          isOptionDisabled={(opt) => !!(opt as Opt).disabled}
          chakraStyles={chakraStyles}
          components={components}
          onChange={onChange}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 99999 }),
          }}
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

export default AppSelect;
