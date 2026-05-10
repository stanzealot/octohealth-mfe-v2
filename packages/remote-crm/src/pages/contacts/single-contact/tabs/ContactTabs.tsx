import React, { useState, useRef, useEffect, useCallback, memo, lazy, Suspense } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import type { ContactDetail } from '../../../../types/contact';

const ActivitiesTab = lazy(() => import('./ActivitiesTab'));
const AuthorizationTab = lazy(() => import('./AuthorizationTab'));
const ClaimsTab = lazy(() => import('./ClaimsTab'));
const InvoicesTab = lazy(() => import('./InvoicesTab'));
const DocumentsTab = lazy(() => import('./DocumentsTab'));
const RelationsTab = lazy(() => import('./RelationsTab'));

const PlaceholderTab = memo(function PlaceholderTab({ name }: { name: string }) {
  return (
    <Box p="3.2rem" textAlign="center">
      <Box color="var(--text-muted)" fontFamily="Montserrat, sans-serif" fontSize="1.4rem">
        {name} — coming soon
      </Box>
    </Box>
  );
});

const TabLoader = memo(function TabLoader() {
  return (
    <Flex h="20rem" align="center" justify="center">
      <Spinner color="var(--brand-primary)" size="md" />
    </Flex>
  );
});

interface ContactTabsProps {
  contact: ContactDetail;
}

function buildTabs(contactId: string) {
  return [
    {
      label: 'Activities',
      content: (
        <Suspense fallback={<TabLoader />}>
          <ActivitiesTab contactId={contactId} />
        </Suspense>
      ),
    },
    {
      label: 'Authorization',
      content: (
        <Suspense fallback={<TabLoader />}>
          <AuthorizationTab contactId={contactId} />
        </Suspense>
      ),
    },
    {
      label: 'Claims',
      content: (
        <Suspense fallback={<TabLoader />}>
          <ClaimsTab contactId={contactId} />
        </Suspense>
      ),
    },
    {
      label: 'Invoices',
      content: (
        <Suspense fallback={<TabLoader />}>
          <InvoicesTab contactId={contactId} />
        </Suspense>
      ),
    },
    {
      label: 'Notes',
      content: <PlaceholderTab name="Notes" />,
    },
    {
      label: 'Documents',
      content: (
        <Suspense fallback={<TabLoader />}>
          <DocumentsTab contactId={contactId} />
        </Suspense>
      ),
    },
    {
      label: 'Addresses',
      content: <PlaceholderTab name="Addresses" />,
    },
    {
      label: 'Emails',
      content: <PlaceholderTab name="Emails" />,
    },
    {
      label: 'Phone Numbers',
      content: <PlaceholderTab name="Phone Numbers" />,
    },
    {
      label: 'Relations',
      content: (
        <Suspense fallback={<TabLoader />}>
          <RelationsTab contactId={contactId} />
        </Suspense>
      ),
    },
  ] as const;
}

function ContactTabsBase({ contact }: ContactTabsProps) {
  const contactId = contact.id ?? '';
  const tabs = buildTabs(contactId);

  const [activeTab, setActiveTab] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const [mountedTabs, setMountedTabs] = useState<Set<number>>(() => new Set([0]));

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateIndicator = useCallback((index: number) => {
    const el = tabRefs.current[index];
    const container = containerRef.current;
    if (!el || !container) return;
    const cRect = container.getBoundingClientRect();
    const tRect = el.getBoundingClientRect();
    setIndicator({ left: tRect.left - cRect.left + container.scrollLeft, width: tRect.width });
  }, []);

  useEffect(() => {
    updateIndicator(activeTab);
  }, [activeTab, updateIndicator]);

  useEffect(() => {
    const handler = () => updateIndicator(activeTab);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [activeTab, updateIndicator]);

  const handleTabClick = useCallback((index: number) => {
    setActiveTab(index);
    setMountedTabs((prev) => new Set([...prev, index]));
  }, []);

  return (
    <Box>
      {}
      <Box position="relative" ref={containerRef}>
        <Flex
          overflowX="auto"
          borderBottom="1px solid var(--surface-border)"
          position="relative"
          css={{
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {tabs.map((tab, index) => (
            <Box
              key={index}
              as="button"
              ref={(el: HTMLButtonElement | null) => {
                tabRefs.current[index] = el;
              }}
              onClick={() => handleTabClick(index)}
              px="2.4rem"
              py="1.6rem"
              whiteSpace="nowrap"
              fontSize="1.4rem"
              fontFamily="Montserrat, sans-serif"
              fontWeight={activeTab === index ? '600' : '500'}
              color={activeTab === index ? 'var(--text-primary)' : 'var(--text-muted)'}
              bg="transparent"
              border="none"
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{ color: 'var(--text-primary)', bg: 'var(--hover-bg)' }}
              _focus={{ outline: 'none' }}
            >
              {tab.label}
            </Box>
          ))}
        </Flex>

        {}
        <Box
          position="absolute"
          bottom="0"
          left={`${indicator.left}px`}
          width={`${indicator.width}px`}
          height="2px"
          bg="var(--brand-primary)"
          transition="left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          zIndex={1}
          pointerEvents="none"
        />
      </Box>

      {}
      <Box mt="2.4rem" minHeight="40rem" position="relative" overflow="hidden">
        {tabs.map((tab, index) => {
          if (!mountedTabs.has(index)) return null;
          const isActive = activeTab === index;
          return (
            <Box
              key={index}
              position={isActive ? 'relative' : 'absolute'}
              top={isActive ? '0' : '-9999px'}
              left="0"
              right="0"
              opacity={isActive ? 1 : 0}
              transform={isActive ? 'translateY(0)' : 'translateY(2rem)'}
              transition="opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
              pointerEvents={isActive ? 'auto' : 'none'}
              aria-hidden={!isActive}
            >
              {tab.content}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export const ContactTabs = memo(ContactTabsBase);
export default ContactTabs;
