import { object, string, boolean, array } from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';
import * as yup from 'yup';

/* ─── Re-usable option schema ─────────────────────────────────────── */
const optionSchema = object({
  label: string().optional(),
  value: string().optional(),
}).optional();

/* ─── Relation row schema ─────────────────────────────────────────── */
const relationSchema = object({
  contact2Id:     optionSchema,
  relationshipId: optionSchema,
});

/* ─── Main schema ─────────────────────────────────────────────────── */
export const contactFormSchema = object({
  /* ── Basic ─────────────────────────────────────────────────────── */
  firstName: string()
    .trim()
    .required('First name is required')
    .matches(/^[^0-9]*$/, 'First name must not include numbers'),

  lastName: string()
    .trim()
    .required('Last name is required')
    .matches(/^[^0-9]*$/, 'Last name must not include numbers'),

  maidenName: string()
    .trim()
    .nullable()
    .optional()
    .matches(/^[^0-9]*$/, 'Maiden name must not include numbers'),

  formerNames: string()
    .trim()
    .nullable()
    .optional()
    .matches(/^[^0-9]*$/, 'Former names must not include numbers'),

  prefix:  string().trim().optional(),
  gender:  string().oneOf(['Male', 'Female']).optional(),
  nin:     string().trim().nullable().optional(),
  photo:   string().trim().optional(),

  dateOfBirth: string()
    .trim()
    .required('Date of birth is required')
    .test('is-valid-date', 'Invalid date (use DD/MM/YYYY)', (value) => {
      if (!value) return false;
      const d = new Date(value);
      return !isNaN(d.getTime());
    }),

  handleWithCare: boolean().optional(),
  religion:       optionSchema,

  contactModes: array().of(string().trim().optional()).optional(),

  /* ── Tag lists ─────────────────────────────────────────────────── */
  /** Current typing state of the email input (transient) */
  email: string()
    .trim()
    .email('Must be a valid email')
    .nullable()
    .optional(),

  /** Confirmed email list */
  tagList: array().of(string().trim().optional()).optional(),

  /** Current typing state of the phone input (transient) */
  phone: string()
    .trim()
    .nullable()
    .optional()
    .test('valid-phone', 'Enter a valid phone number', (value) => {
      if (!value) return true;
      return isValidPhoneNumber(value);
    }),

  /** Confirmed phone list */
  phoneList: array().of(string().trim().optional()).optional(),

  /* ── Address ────────────────────────────────────────────────────── */
  apartmentBuilding: string().trim().optional(),

  address1: string()
    .trim()
    .when('stateId', {
      is: (v: string) => !!v,
      then:      (s) => s.required('Address line 1 is required'),
      otherwise: (s) => s.notRequired(),
    }),

  address2:   string().trim().optional(),
  townCity:   string().trim().optional(),

  countryId: string()
    .trim()
    .when('address1', {
      is: (v: string) => !!v,
      then:      (s) => s.required('Country is required'),
      otherwise: (s) => s.notRequired(),
    }),

  stateId:     string().trim().optional(),
  addressType: optionSchema,

  /* ── Relations ─────────────────────────────────────────────────── */
  relations: array().of(relationSchema).optional(),
});

/* ─── Inferred TypeScript type ────────────────────────────────────── */
export type ContactFormPayload = yup.InferType<typeof contactFormSchema>;
