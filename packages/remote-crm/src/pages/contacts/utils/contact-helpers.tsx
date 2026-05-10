import React from 'react';
import { Flex } from '@chakra-ui/react';
import type { Contact } from '../../../mock/contacts';
import { CONTACT_STATUS_STYLES } from '../constants';

export function calculateAge(dob: string | undefined): string {
  if (!dob) return '-';
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return String(age);
}

export function StatusBadge({ status }: { status: Contact['contactStatus'] }) {
  const s = CONTACT_STATUS_STYLES[status] ?? CONTACT_STATUS_STYLES.Inactive;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.3rem 1rem',
        borderRadius: '2rem',
        fontSize: '1.2rem',
        fontWeight: 500,
        background: s.bg,
        color: s.color,
      }}
    >
      {status}
    </span>
  );
}

export function ContactAvatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  return (
    <Flex
      align="center"
      justify="center"
      w="4rem"
      h="4rem"
      borderRadius="50%"
      bg="var(--avatar-fallback-bg)"
      color="var(--avatar-fallback-color)"
      fontWeight={700}
      fontSize="1.3rem"
      flexShrink={0}
      fontFamily="Montserrat, sans-serif"
    >
      {firstName[0]}
      {lastName[0]}
    </Flex>
  );
}
