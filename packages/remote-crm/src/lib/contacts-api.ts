import axios from 'axios';
import type { OptionsOrGroups, GroupBase } from 'react-select';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export interface StrOption {
  label: string;
  value: string;
}

export interface LoadResult<Opt = StrOption, Additional = unknown> {
  options: Opt[];
  hasMore?: boolean;
  additional?: Additional;
}

function toOptions(
  items: Array<Record<string, unknown>>,
  labelKey: string,
  valueKey: string,
): StrOption[] {
  return items.map((item) => ({
    label: String(item[labelKey] ?? ''),
    value: String(item[valueKey] ?? ''),
  }));
}

export async function loadContactOptions(
  inputValue: string,
  prevOptions: OptionsOrGroups<StrOption, GroupBase<StrOption>>,
  additional?: { cursor?: string },
): Promise<LoadResult<StrOption, { cursor?: string }>> {
  try {
    const { data } = await api.get('/crm/contacts', {
      params: {
        direction: 'asc',
        ...(inputValue ? { term: inputValue } : {}),
        ...(additional?.cursor && !inputValue ? { cursor: additional.cursor } : {}),
      },
    });

    const items: Array<Record<string, unknown>> = data?.data?.data ?? [];
    const next = data?.data?.pageCursors?.next;
    const prev = prevOptions as StrOption[];

    const options = items.flatMap((c) => {
      const { id, firstName, lastName, gender } = c as {
        id: string;
        firstName: string;
        lastName: string;
        gender: string;
      };
      if (prev.find((o) => o.value === id)) return [];
      return [
        {
          label: `${firstName} ${lastName} – ${gender.charAt(0)}`,
          value: id,
        },
      ];
    });

    return { options, hasMore: !!next, additional: { cursor: next?.cursor } };
  } catch {
    return { options: [], hasMore: false };
  }
}

export async function loadCountryOptions(
  inputValue: string,
  _prevOptions: OptionsOrGroups<StrOption, GroupBase<StrOption>>,
  additional?: { page: number },
): Promise<LoadResult<StrOption, { page: number }>> {
  try {
    const page = additional?.page ?? 1;
    const { data } = await api.get('/countries', {
      params: {
        direction: 'asc',
        paginationType: 'page',
        page,
        ...(inputValue ? { term: inputValue } : {}),
      },
    });
    const items = data?.data?.data ?? [];
    const hasMore = !!data?.data?.meta?.nextPage;
    return {
      options: toOptions(items, 'name', 'id'),
      hasMore,
      additional: { page: page + 1 },
    };
  } catch {
    return { options: [], hasMore: false };
  }
}

export function makeLoadStateOptions(countryId?: string) {
  return async function loadStateOptions(
    inputValue: string,
    _prevOptions: OptionsOrGroups<StrOption, GroupBase<StrOption>>,
    additional?: { page: number },
  ): Promise<LoadResult<StrOption, { page: number }>> {
    if (!countryId) return { options: [], hasMore: false };
    try {
      const page = additional?.page ?? 1;
      const { data } = await api.get(`/countries/${countryId}/states`, {
        params: {
          direction: 'asc',
          paginationType: 'page',
          page,
          ...(inputValue ? { term: inputValue } : {}),
        },
      });
      const items = data?.data?.data ?? [];
      const hasMore = !!data?.data?.meta?.nextPage;
      return {
        options: toOptions(items, 'name', 'id'),
        hasMore,
        additional: { page: page + 1 },
      };
    } catch {
      return { options: [], hasMore: false };
    }
  };
}

export async function fetchRelationships(): Promise<StrOption[]> {
  try {
    const { data } = await api.get('/crm/relationships');
    const items: Array<{ id: string; relationship: string }> = data?.data ?? [];
    return items.map((r) => ({ label: r.relationship, value: r.id }));
  } catch {
    return [
      { label: 'Spouse', value: 'spouse' },
      { label: 'Parent', value: 'parent' },
      { label: 'Child', value: 'child' },
      { label: 'Sibling', value: 'sibling' },
      { label: 'Guardian', value: 'guardian' },
      { label: 'Next of Kin', value: 'nok' },
    ];
  }
}

import type { CommunicationChannel } from '../types/contact';

export async function fetchCommunicationChannels(): Promise<CommunicationChannel[]> {
  try {
    const { data } = await api.get('/crm-settings/communications');
    return data?.data ?? [];
  } catch {
    return [];
  }
}

import type { ContactDetail } from '../types/contact';

export async function fetchContactById(id: string): Promise<ContactDetail> {
  const { data } = await api.get(`/crm/contacts/${id}`);
  const contact = data?.data;

  if (!contact) throw new Error(`Contact ${id} not found`);
  return contact;
}

import type { ContactFormPayload } from '../pages/contacts/add-contact/schema';
import type { CommunicationSetting } from '../types/contact';

export async function saveContact(
  payload: ContactFormPayload,
  communicationSettings: CommunicationSetting[],
  id?: string,
): Promise<{ id: string }> {
  const body = buildContactBody(payload, communicationSettings);
  const { data } = id
    ? await api.put(`/crm/contacts/${id}`, body)
    : await api.post('/crm/contacts', body);
  return data?.data;
}

function buildContactBody(form: ContactFormPayload, commSettings: CommunicationSetting[]) {
  return {
    firstName: form.firstName,
    lastName: form.lastName,
    maidenName: form.maidenName || null,
    formerNames: form.formerNames || null,
    prefix: form.prefix || null,
    gender: form.gender,
    dateOfBirth: form.dateOfBirth,
    nin: form.nin || null,
    handleWithCare: form.handleWithCare ?? false,
    religionId: form.religion?.value || null,
    contactModes: form.contactModes ?? [],

    emails: (form.tagList ?? []).map((email) => ({ email })),
    phones: (form.phoneList ?? []).map((phone) => ({ phone })),
    address: form.address1
      ? {
          apartmentBuilding: form.apartmentBuilding,
          address1: form.address1,
          address2: form.address2,
          townCity: form.townCity,
          countryId: form.countryId,
          stateId: form.stateId,
          type: form.addressType?.value,
        }
      : undefined,
    relations: (form.relations ?? [])
      .filter((r) => r.contact2Id?.value && r.relationshipId?.value)
      .map((r) => ({
        contact2Id: r.contact2Id?.value,
        relationshipId: r.relationshipId?.value,
      })),
    communicationSettings: commSettings,
  };
}
