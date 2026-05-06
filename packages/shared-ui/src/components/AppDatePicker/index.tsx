import React, { memo, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, type UseFormReturn, type FieldValues, type Path } from 'react-hook-form';
import { Box, Text } from '@chakra-ui/react';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './styles.module.css';

/* ─── Helpers ───────────────────────────────────────────────────────── */

/** Parse a stored "YYYY-MM-DD" string → native Date (or null) */
function parseISODate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/** Format a Date → "YYYY-MM-DD" (ISO, no timezone shift) */
function toISODate(date: Date | null): string | null {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* ─── CalendarSVG icon ──────────────────────────────────────────────── */
const CalendarSvgIcon = () => (
  <Calendar
    size={18}
    style={{ color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0 }}
  />
);

/* ─── Props ─────────────────────────────────────────────────────────── */
export interface AppDatePickerProps<T extends FieldValues = FieldValues> {
  /** react-hook-form field path */
  title: Path<T>;
  /** react-hook-form return value */
  handler: UseFormReturn<T>;

  label?: string;
  required?: boolean;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;

  /** Earliest selectable date */
  minDate?: Date;
  /** Latest selectable date */
  maxDate?: Date;

  /**
   * Display format for the input.
   * Uses react-datepicker's dateFormat tokens (e.g. "dd/MM/yyyy", "MM/yyyy").
   * Defaults to "dd/MM/yyyy".
   */
  dateFormat?: string;

  /** Show month+year picker only (no day grid) */
  showMonthYearPicker?: boolean;
  /** Show year-only picker */
  showYearPicker?: boolean;
}

/* ─── Component ─────────────────────────────────────────────────────── */
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

  /* Derive a sensible default display format */
  const resolvedFormat = dateFormat
    ?? (showYearPicker ? 'yyyy' : showMonthYearPicker ? 'MM/yyyy' : 'dd/MM/yyyy');

  return (
    <Box display="flex" flexDir="column" gap="0.5rem" w="100%">
      {/* Label */}
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

      {/* Picker */}
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
              placeholderText={placeholder ?? 'Select date…'}
              minDate={minDate}
              maxDate={maxDate}
              /* Show inline calendar icon that opens picker on click */
              showIcon
              icon={<CalendarSvgIcon />}
              toggleCalendarOnIconClick
              /* Always show month + year dropdowns in the header */
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              /* Peek adjacent months for context */
              peekNextMonth
              /* CSS classes */
              className={styles.app_date_picker}
              calendarClassName={styles.app_calender}
              wrapperClassName={styles.app_wrapper}
              popperClassName={styles.app_popper}
              /* Keep popper above modals */
              popperProps={{ strategy: 'fixed' }}
            />
          );
        }}
      />

      {/* Error */}
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
