/**
 * CompanyTabs — 11-tab animated bar for the single-company view
 *
 * Tabs: Addresses | Contacts | Social Media | Opportunity | Email |
 *       Departments | Documents | Financial Info | Activity | Notes | Attachment
 *
 * Same sliding-indicator pattern as ContactTabs / LeadTabs.
 * Lazy mount with mountedTabs Set — tab is kept in DOM after first visit.
 */

import React, {
  useState, useRef, useEffect, useCallback, memo,
} from 'react';
import { Box, Flex } from '@chakra-ui/react';
import AddressesTab  from './tabs/AddressesTab';
import PlaceholderTab from './tabs/PlaceholderTab';
import type { Entity } from '../types';

interface Props { entity: Entity }

function CompanyTabsBase({ entity: _entity }: Props) {
  const tabs = [
    { label: 'Addresses',      content: <AddressesTab />                           },
    { label: 'Contacts',       content: <PlaceholderTab name="Contacts"     />     },
    { label: 'Social Media',   content: <PlaceholderTab name="Social Media" />     },
    { label: 'Opportunity',    content: <PlaceholderTab name="Opportunity"  />     },
    { label: 'Email',          content: <PlaceholderTab name="Email"        />     },
    { label: 'Departments',    content: <PlaceholderTab name="Departments"  />     },
    { label: 'Documents',      content: <PlaceholderTab name="Documents"    />     },
    { label: 'Financial Info', content: <PlaceholderTab name="Financial Info" />   },
    { label: 'Activity',       content: <PlaceholderTab name="Activity"     />     },
    { label: 'Notes',          content: <PlaceholderTab name="Notes"        />     },
    { label: 'Attachment',     content: <PlaceholderTab name="Attachment"   />     },
  ] as const;

  const [activeTab,   setActiveTab]   = useState(0);
  const [indicator,   setIndicator]   = useState({ left: 0, width: 0 });
  const [mountedTabs, setMountedTabs] = useState(() => new Set([0]));

  const tabRefs      = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateIndicator = useCallback((index: number) => {
    const el        = tabRefs.current[index];
    const container = containerRef.current;
    if (!el || !container) return;
    const cRect = container.getBoundingClientRect();
    const tRect = el.getBoundingClientRect();
    setIndicator({
      left:  tRect.left - cRect.left + container.scrollLeft,
      width: tRect.width,
    });
  }, []);

  useEffect(() => { updateIndicator(activeTab); }, [activeTab, updateIndicator]);

  useEffect(() => {
    const h = () => updateIndicator(activeTab);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [activeTab, updateIndicator]);

  const handleTabClick = useCallback((index: number) => {
    setActiveTab(index);
    setMountedTabs((prev) => new Set([...prev, index]));
  }, []);

  return (
    <Box mt="2.4rem">
      {/* Tab bar */}
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
              ref={(el: HTMLButtonElement | null) => { tabRefs.current[index] = el; }}
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

        {/* Sliding underline */}
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

      {/* Tab content — lazy mounted */}
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

export const CompanyTabs = memo(CompanyTabsBase);
export default CompanyTabs;
