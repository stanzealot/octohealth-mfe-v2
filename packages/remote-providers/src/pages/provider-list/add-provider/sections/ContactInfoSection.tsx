import React, { useState, useCallback, memo, type ChangeEvent } from 'react';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { type UseFormReturn, Controller } from 'react-hook-form';
import AppInput from 'sharedUi/AppInput';
import AppSelect from 'sharedUi/AppSelect';
import AppButton from 'sharedUi/AppButton';
import AppMultiPhoneInput from 'sharedUi/AppMultiPhoneInput';
import AppTextTagInput from 'sharedUi/AppTextTagInput';
import AppAccordionSection from 'sharedUi/AppAccordionSection';
import type { AddProviderPayload, PrimaryContact } from '../../../../types';
import { COUNTRY_OPTIONS, STATE_OPTIONS } from '../../../../constants';

interface Props {
  handler: UseFormReturn<AddProviderPayload>;
}

function ContactInfoSectionBase({ handler }: Props) {
  const {
    register,
    control,
    formState: { errors },
  } = handler;

  const [primaryContacts, setPrimaryContacts] = useState<PrimaryContact[]>([
    { id: 1, name: 'Jame Johns', phone: '090746536372', email: 'jamesjones@gmail.com' },
  ]);

  const handleAddContact = useCallback(() => {
    setPrimaryContacts((prev) => [
      ...prev,
      { id: prev.length + 1, name: '', phone: '', email: '' },
    ]);
  }, []);

  const updateContact = useCallback((index: number, field: keyof PrimaryContact, value: string) => {
    setPrimaryContacts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  return (
    <AppAccordionSection title="Contact Info" defaultOpen>
      {/* Email + Phone */}
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
        <Box w={{ base: '100%', md: '50%' }}>
          <AppTextTagInput
            handler={handler}
            name="emailList"
            label="Email Address *"
            placeholder="Input email addresses separated by comma"
            tagPlacement="bottom"
          />
        </Box>
        <Box w={{ base: '100%', md: '50%' }}>
          <AppMultiPhoneInput
            handler={handler}
            name="phoneList"
            label="Phone Number *"
            placeholder="090344566788"
          />
        </Box>
      </Flex>

      {/* Address 1 + 2 */}
      <Flex gap="3rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start">
        <Box w={{ base: '100%', md: '50%' }}>
          <AppInput
            label="Address 1 *"
            placeholder="Add Address"
            errorMessage={errors.address1?.message}
            {...register('address1')}
          />
        </Box>
        <Box w={{ base: '100%', md: '50%' }}>
          <AppInput
            label="Address 2"
            placeholder="Add Address"
            errorMessage={errors.address2?.message}
            {...register('address2')}
          />
        </Box>
      </Flex>

      {/* PO Box, Country, State, Town */}
      <Flex gap="2rem" flexDir={{ base: 'column', md: 'row' }} align="flex-start" flexWrap="wrap">
        <Box w={{ base: '100%', md: '23%' }}>
          <AppInput
            label="PO Box"
            placeholder="Add PO BOX"
            errorMessage={errors.poBox?.message}
            {...register('poBox')}
          />
        </Box>
        <Box w={{ base: '100%', md: '23%' }}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <AppSelect
                label="Country *"
                placeholder="Select"
                options={COUNTRY_OPTIONS}
                value={COUNTRY_OPTIONS.find((o) => o.value === field.value) ?? null}
                onChange={(opt) => field.onChange((opt as { value: string } | null)?.value ?? '')}
                errorMessage={errors.country?.message}
                height="4.4rem"
              />
            )}
          />
        </Box>
        <Box w={{ base: '100%', md: '23%' }}>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <AppSelect
                label="State *"
                placeholder="Select"
                options={STATE_OPTIONS}
                value={STATE_OPTIONS.find((o) => o.value === field.value) ?? null}
                onChange={(opt) => field.onChange((opt as { value: string } | null)?.value ?? '')}
                errorMessage={errors.state?.message}
                height="4.4rem"
              />
            )}
          />
        </Box>
        <Box w={{ base: '100%', md: '23%' }}>
          <AppInput
            label="Town/City *"
            placeholder="Enter town"
            errorMessage={errors.townCity?.message}
            {...register('townCity')}
          />
        </Box>
      </Flex>

      {/* Primary Contact Info */}
      <Stack gap="1.6rem">
        <Text
          fontFamily="Montserrat, sans-serif"
          fontSize="1.2rem"
          fontWeight="600"
          color="var(--text-secondary)"
          textTransform="uppercase"
          letterSpacing="0.5px"
        >
          Primary Contact Info
        </Text>
        {primaryContacts.map((contact, idx) => (
          <Flex
            key={contact.id}
            gap="2rem"
            flexDir={{ base: 'column', md: 'row' }}
            align="flex-start"
          >
            <Box w={{ base: '100%', md: '33%' }}>
              <AppInput
                label="Name"
                placeholder="Jame Johns"
                value={contact.name}
                disabled={idx === 0}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateContact(idx, 'name', e.target.value)
                }
              />
            </Box>
            <Box w={{ base: '100%', md: '33%' }}>
              <AppInput
                label="Phone number"
                placeholder="090746536372"
                value={contact.phone}
                disabled={idx === 0}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateContact(idx, 'phone', e.target.value)
                }
              />
            </Box>
            <Box w={{ base: '100%', md: '33%' }}>
              <AppInput
                label="Email"
                placeholder="jamesjones@gmail.com"
                value={contact.email}
                disabled={idx === 0}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updateContact(idx, 'email', e.target.value)
                }
              />
            </Box>
          </Flex>
        ))}
        <Flex justify="flex-end">
          <AppButton variant="outline" type="button" onClick={handleAddContact} enableRipple>
            + Add another
          </AppButton>
        </Flex>
      </Stack>
    </AppAccordionSection>
  );
}

export const ContactInfoSection = memo(ContactInfoSectionBase);
export default ContactInfoSection;
