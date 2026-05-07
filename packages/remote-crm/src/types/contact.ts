/* ─── Enums ──────────────────────────────────────────────────────────── */
export type ContactGender = 'Male' | 'Female';

export enum ContactMode {
  Sms       = 'Sms',
  Email     = 'Email',
  RichSMS   = 'RichSMS',
  WhatsApp  = 'WhatsApp',
  Telephone = 'Telephone',
}

/* ─── Reusable option shape (used in Select fields) ─────────────────── */
export interface SelectOption {
  label: string;
  value: string;
}

/* ─── A single relation row (inside the Relations section) ───────────── */
export interface RelationRow {
  contact2Id:     SelectOption;
  relationshipId: SelectOption;
}

/* ─── Communication settings (external state, NOT in RHF) ───────────── */
export interface CommunicationSetting {
  communicationId: string;
  isEnabled:       boolean;
  preferredFormats: ContactMode[];
}

/** Shape returned by the /crm-settings/communications API */
export interface CommunicationChannel {
  id:          string;
  title:       string;
  description: string;
  formats:     ContactMode[];
}

/* ─── API shape of a saved contact (for pre-filling edit form) ───────── */
export interface ContactDetail {
  /** Membership / policy data (from /crm/contacts/:id or a separate policy API) */
  membership?: {
    regNumber?: string;
    policyNo?: string;
    policyStartDate?: string;
    policyValidUpTo?: string;
    groupName?: string;
    planType?: string;
    planName?: string;
  } | null;
  id:            string;
  firstName:     string;
  lastName:      string;
  maidenName?:   string | null;
  formerNames?:  string | null;
  prefix?:       string;
  gender?:       ContactGender;
  dateOfBirth?:  string;
  nin?:          string | null;
  photo?:        { url: string } | null;
  handleWithCare?: boolean;
  religion?:     { id: string; name: string } | null;
  contactModes?: string[];
  contactEmails?:  Array<{ email: string }>;
  contactPhones?:  Array<{ phone: string }>;
  contactAddresses?: Array<{
    apartmentBuilding?: string;
    address1?:          string;
    address2?:          string;
    townCity?:          string;
    countryId?:         string;
    stateId?:           string;
    type?:              string;
    country?:           { id: string; name: string };
    state?:             { id: string; name: string };
  }>;
  relatedContacts?: Array<{
    relationshipId: string;
    relationship:   { relationship: string };
    relatedContact: {
      id:        string;
      firstName: string;
      lastName:  string;
      gender:    string;
    };
  }>;
}
