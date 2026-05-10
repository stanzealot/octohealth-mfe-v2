import React, { useCallback } from 'react';
import { Flex, HStack, Text, VStack } from '@chakra-ui/react';
import AppAccordionSection from 'sharedUi/AppAccordionSection';
import AppSwitch from 'sharedUi/AppSwitch';
import AppCheckbox from 'sharedUi/AppCheckbox';
import type { CommunicationChannel, CommunicationSetting } from '../../../../types/contact';
import { ContactMode } from '../../../../types/contact';

const MODE_LABELS: Record<ContactMode, string> = {
  [ContactMode.Sms]: 'SMS',
  [ContactMode.Email]: 'Email',
  [ContactMode.RichSMS]: 'Rich SMS',
  [ContactMode.WhatsApp]: 'WhatsApp',
  [ContactMode.Telephone]: 'Telephone',
};

interface CommunicationsSectionProps {
  channels: CommunicationChannel[];
  settings: CommunicationSetting[];
  onToggle: (channelId: string) => void;
  onModeChange: (channelId: string, mode: ContactMode) => void;
}

export function CommunicationsSection({
  channels,
  settings,
  onToggle,
  onModeChange,
}: CommunicationsSectionProps) {
  const getSetting = useCallback(
    (channelId: string): CommunicationSetting =>
      settings.find((s) => s.communicationId === channelId) ?? {
        communicationId: channelId,
        isEnabled: false,
        preferredFormats: [],
      },
    [settings],
  );

  if (!channels.length) return null;

  return (
    <AppAccordionSection title="Communication Preferences" contentPadding="0">
      {channels.map((channel, idx) => {
        const setting = getSetting(channel.id);

        return (
          <HStack
            key={channel.id}
            justify="space-between"
            align="flex-start"
            px={6}
            py={5}
            borderBottom={idx < channels.length - 1 ? '1px solid var(--surface-border)' : 'none'}
          >
            {}
            <HStack gap={6} flex="0 0 45%">
              <AppSwitch
                size="sm"
                checked={setting.isEnabled}
                onCheckedChange={() => onToggle(channel.id)}
                aria-label={`Enable ${channel.title}`}
              />
              <VStack align="flex-start" gap="0.2rem">
                <Text
                  fontSize="1.4rem"
                  fontWeight="600"
                  fontFamily="Montserrat, sans-serif"
                  color="var(--text-primary)"
                >
                  {channel.title}
                </Text>
                {channel.description && (
                  <Text
                    fontSize="1.2rem"
                    fontFamily="Montserrat, sans-serif"
                    color="var(--text-muted)"
                  >
                    {channel.description}
                  </Text>
                )}
              </VStack>
            </HStack>

            {}
            <Flex gap="2.4rem" flex="0 0 55%" flexWrap="wrap" px={4}>
              {channel.formats.map((mode) => (
                <AppCheckbox
                  key={mode}
                  size="sm"
                  label={MODE_LABELS[mode]}
                  disabled={!setting.isEnabled}
                  checked={setting.preferredFormats.includes(mode)}
                  onChange={() => onModeChange(channel.id, mode)}
                />
              ))}
            </Flex>
          </HStack>
        );
      })}
    </AppAccordionSection>
  );
}
