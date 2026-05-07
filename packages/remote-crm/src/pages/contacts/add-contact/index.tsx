/**
 * ContactFormPage.tsx
 *
 * Add / Edit contact page.
 *
 * Structure
 * ─────────
 *   <form>
 *     <BasicSection />           ← personal info (always open)
 *     <CommunicationsSection />  ← comm channels  (always open if channels exist)
 *     <AddressSection />         ← address        (open when editing with address)
 *     <RelationsSection />       ← relations      (open when editing with relations)
 *     <action buttons>
 *   </form>
 *
 * Communication channel settings live as local state here (not in RHF)
 * because they are submitted alongside — but not part of — the form schema.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Flex, Stack, Text } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { AdvancedButton } from 'sharedUi/AppButton';

import { contactFormSchema, type ContactFormPayload } from './schema';
import { BasicSection }          from './sections/BasicSection';
import { CommunicationsSection } from './sections/CommunicationsSection';
import { AddressSection }        from './sections/AddressSection';
import { RelationsSection }      from './sections/RelationsSection';

import {
  fetchCommunicationChannels,
  saveContact,
} from '../../../lib/contacts-api';
import type {
  CommunicationChannel,
  CommunicationSetting,
  ContactDetail,
  ContactMode,
} from '../../../types/contact';

/* ─── Helpers ─────────────────────────────────────────────────────── */

/** Build default communication settings from the loaded channel list */
function buildDefaultSettings(channels: CommunicationChannel[]): CommunicationSetting[] {
  return channels.map((c) => ({
    communicationId:  c.id,
    isEnabled:        false,
    preferredFormats: [],
  }));
}

/** Map an existing ContactDetail API response → RHF default values */
function toDefaultValues(contact?: ContactDetail): Partial<ContactFormPayload> {
  if (!contact) return { handleWithCare: false, contactModes: [] };

  const addr = contact.contactAddresses?.[0];

  return {
    firstName:      contact.firstName?.trim()  ?? '',
    lastName:       contact.lastName?.trim()   ?? '',
    maidenName:     contact.maidenName !== 'null'  ? contact.maidenName?.trim()  : '',
    formerNames:    contact.formerNames !== 'null' ? contact.formerNames?.trim() : '',
    prefix:         contact.prefix?.trim()     ?? '',
    gender:         contact.gender,
    dateOfBirth:    contact.dateOfBirth        ?? '',
    nin:            contact.nin !== 'null'     ? contact.nin              : '',
    photo:          contact.photo?.url,
    handleWithCare: contact.handleWithCare     ?? false,
    religion: contact.religion
      ? { value: contact.religion.id, label: contact.religion.name.trim() }
      : undefined,
    contactModes: contact.contactModes ?? [],
    tagList:   contact.contactEmails?.map((e) => e.email.trim())  ?? [],
    phoneList: contact.contactPhones?.map((p) => p.phone.trim())  ?? [],
    apartmentBuilding: addr?.apartmentBuilding,
    address1:          addr?.address1 ?? '',
    address2:          addr?.address2 ?? '',
    townCity:          addr?.townCity  ?? '',
    countryId:         addr?.countryId,
    stateId:           addr?.stateId,
    addressType: addr?.type ? { label: addr.type, value: addr.type } : undefined,
    relations: contact.relatedContacts?.map((r) => ({
      contact2Id: {
        value: r.relatedContact.id,
        label: `${r.relatedContact.firstName} ${r.relatedContact.lastName} – ${r.relatedContact.gender.charAt(0)}`,
      },
      relationshipId: {
        value: r.relationshipId,
        label: r.relationship.relationship,
      },
    })) ?? [],
  };
}

/* ─── Component ───────────────────────────────────────────────────── */
export default function ContactFormPage() {
  const navigate     = useNavigate();
  const { id }       = useParams<{ id?: string }>();
  const isEdit       = !!id;

  /* Communication channels + settings state */
  const [channels,          setChannels]         = useState<CommunicationChannel[]>([]);
  const [commSettings, setCommSettings]  = useState<CommunicationSetting[]>([]);
  const [isSaving,          setIsSaving]          = useState(false);

  /* ── RHF setup ────────────────────────────────────────────────── */
  const formHook = useForm<ContactFormPayload>({
    mode:     'onChange',
    resolver: yupResolver(contactFormSchema) as Resolver<ContactFormPayload>,
    defaultValues: toDefaultValues(), // empty → filled after contact loads
  });

  const { handleSubmit, reset } = formHook;

  /* ── Load communication channels (once) ──────────────────────── */
  useEffect(() => {
    fetchCommunicationChannels().then((list) => {
      setChannels(list);
      setCommSettings(buildDefaultSettings(list));
    });
  }, []);

  /* ── Load existing contact in edit mode ───────────────────────── */
  useEffect(() => {
    if (!id) return;
    // TODO: replace with your real API call: api.get(`/crm/contacts/${id}`)
    // For now we just reset with an empty object so edit mode still works
    // Example when you have a loader:
    //   fetchContact(id).then((contact) => reset(toDefaultValues(contact)));
  }, [id, reset]);

  /* ── Communication channel handlers ──────────────────────────── */
  const handleToggleChannel = useCallback((channelId: string) => {
    setCommSettings((prev) =>
      prev.map((s) =>
        s.communicationId === channelId
          ? {
              ...s,
              isEnabled:        !s.isEnabled,
              preferredFormats: s.isEnabled ? [] : s.preferredFormats,
            }
          : s,
      ),
    );
  }, []);

  const handleModeChange = useCallback(
    (channelId: string, mode: ContactMode) => {
      setCommSettings((prev) =>
        prev.map((s) => {
          if (s.communicationId !== channelId) return s;
          const has = s.preferredFormats.includes(mode);
          return {
            ...s,
            preferredFormats: has
              ? s.preferredFormats.filter((f) => f !== mode)
              : [...s.preferredFormats, mode],
            isEnabled: has ? s.preferredFormats.length > 1 : true,
          };
        }),
      );
    },
    [],
  );

  /* ── Submit ───────────────────────────────────────────────────── */
  const onSubmit = useCallback(
    async (data: ContactFormPayload) => {
      setIsSaving(true);
      try {
        const saved = await saveContact(data, commSettings, id);
        toast.success(`Contact ${isEdit ? 'updated' : 'created'} successfully`);
        navigate(`/crm/contacts/${saved.id}`);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })
            ?.response?.data?.message ?? 'An error occurred. Please try again.';
        toast.error(message);
      } finally {
        setIsSaving(false);
      }
    },
    [commSettings, id, isEdit, navigate],
  );

  /* ── Resolve default country/state for edit mode ─────────────── */
  // These are passed to AddressSection to show the saved label immediately
  // while the async select is initialising
  const address = formHook.watch('countryId')
    ? { countryId: formHook.watch('countryId'), stateId: formHook.watch('stateId') }
    : undefined;

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <Stack gap={6}>
      {/* ── Page title card ──────────────────────────────────────── */}
      <Stack
        bg="var(--surface-card)"
        borderRadius="0.8rem"
        border="1px solid var(--surface-border)"
        px={10}
        py={6}
        gap={10}
      >
        <Text
          fontSize="2rem"
          fontWeight="700"
          fontFamily="Montserrat, sans-serif"
          color="var(--text-primary)"
        >
          {isEdit ? 'Edit Contact' : 'Add New Contact'}
        </Text>

        {/* ── Form ─────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack gap={8} w="100%">
            {/* 1 — Basic information */}
            <BasicSection handler={formHook} />

            {/* 2 — Communication preferences */}
            <CommunicationsSection
              channels={channels}
              settings={commSettings}
              onToggle={handleToggleChannel}
              onModeChange={handleModeChange}
            />

            {/* 3 — Address */}
            <AddressSection handler={formHook} />

            {/* 4 — Relations */}
            <RelationsSection handler={formHook} />

            {/* ── Action bar ──────────────────────────────────── */}
            <Flex gap="1rem" justify="flex-end" pt="1rem">
              <AdvancedButton
                variant="secondary"
                type="button"
                onClick={() =>
                  navigate(isEdit ? `/crm/contacts/${id}` : '/crm/contacts')
                }
              >
                Cancel
              </AdvancedButton>

              <AdvancedButton
                variant="primary"
                type="submit"
                loading={isSaving}
                disabled={isSaving}
              >
                {isSaving ? 'Saving…' : isEdit ? 'Update Contact' : 'Save Contact'}
              </AdvancedButton>
            </Flex>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
}
