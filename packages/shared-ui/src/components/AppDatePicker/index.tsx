import React, { memo, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, type UseFormReturn, type FieldValues, type Path } from 'react-hook-form';
import { Box, Text } from '@chakra-ui/react';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './styles.module.css';

function parseISODate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function toISODate(date: Date | null): string | null {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

interface DateCustomInputProps {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const DateCustomInput = forwardRef<HTMLInputElement, DateCustomInputProps>(
  ({ value, onClick, placeholder, disabled }, ref) => (
    <div
      className={styles.app_wrapper}
      onClick={!disabled ? onClick : undefined}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <input
        ref={ref}
        value={value ?? ''}
        readOnly
        placeholder={placeholder}
        disabled={disabled}
        className={styles.app_date_picker}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        onChange={() => {}}
      />
      <span
        style={{
          paddingRight: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <Calendar size={18} style={{ color: 'var(--text-muted)', display: 'block' }} />
      </span>
    </div>
  ),
);
DateCustomInput.displayName = 'DateCustomInput';

export interface AppDatePickerProps<T extends FieldValues = FieldValues> {
  title: Path<T>;

  handler: UseFormReturn<T>;

  label?: string;
  required?: boolean;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;

  minDate?: Date;

  maxDate?: Date;

  dateFormat?: string;

  showMonthYearPicker?: boolean;

  showYearPicker?: boolean;
}

function AppDatePickerBase<T extends FieldValues = FieldValues>({
  title,
  handler,
  label,
  required,
  placeholder,
  errorMessage,
  disabled,
  minDate,
  maxDate,
  dateFormat,
  showMonthYearPicker,
  showYearPicker,
}: AppDatePickerProps<T>) {
  const { control } = handler;

  const resolvedFormat =
    dateFormat ?? (showYearPicker ? 'yyyy' : showMonthYearPicker ? 'MM/yyyy' : 'dd/MM/yyyy');

  return (
    <Box display="flex" flexDir="column" gap="0.5rem" w="100%">
      {}
      {label && (
        <Text
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
      <Controller
        control={control}
        name={title}
        render={({ field: { onChange, onBlur, value } }) => {
          const selectedDate = parseISODate(value);

          return (
            <DatePicker
              selected={selectedDate}
              onChange={(date) => onChange(toISODate(date as Date | null))}
              onBlur={onBlur}
              dateFormat={resolvedFormat}
              showMonthYearPicker={showMonthYearPicker}
              showYearPicker={showYearPicker}
              disabled={disabled}
              minDate={minDate}
              maxDate={maxDate}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              peekNextMonth
              calendarClassName={styles.app_calender}
              popperClassName={styles.app_popper}
              popperProps={{ strategy: 'fixed' }}
              customInput={
                <DateCustomInput placeholder={placeholder ?? 'Select date…'} disabled={disabled} />
              }
            />
          );
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
  );
}

export const AppDatePicker = memo(AppDatePickerBase) as typeof AppDatePickerBase;
export default AppDatePicker;
