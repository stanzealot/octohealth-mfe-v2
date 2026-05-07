/**
 * AddressTabs — secondary tab bar inside the Add/Edit Company form
 *
 * Matches monolith's address-tabs.tsx:
 * Tabs: Addresses | Contacts | Social Media | Opportunity |
 *       Departments | Documents | Financial info | Activity | Notes | Attachment
 *
 * Addresses tab has a working data table + Add Address modal.
 * All other tabs are "coming soon" placeholders.
 */

import React, { useState, useRef, useEffect, memo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import AddressesTabContent from './tabs/AddressesTabContent';

const TABS = [
  'Addresses', 'Contacts', 'Social Media', 'Opportunity',
  'Departments', 'Documents', 'Financial info', 'Activity', 'Notes', 'Attachment',
];

const PlaceholderContent = memo(({ name }: { name: string }) => (
  <Box p="3.2rem" textAlign="center">
    <Text fontFamily="Montserrat, sans-serif" fontSize="1.4rem" color="var(--text-muted)">
      {name} — coming soon
    </Text>
  </Box>
));

function AddressTabsBase() {
  const [activeTab, setActiveTab] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const tabRefs      = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el        = tabRefs.current[activeTab];
    const container = containerRef.current;
    if (!el || !container) return;
    const cRect = container.getBoundingClientRect();
    const tRect = el.getBoundingClientRect();
    setIndicator({ left: tRect.left - cRect.left + container.scrollLeft, width: tRect.width });
  }, [activeTab]);

  const content = TABS.map((label, i) =>
    i === 0 ? <AddressesTabContent key={i} /> : <PlaceholderContent key={i} name={label} />,
  );

  return (
    <Box>
      {/* Tab bar */}
      <Box position="relative" ref={containerRef}>
        <Flex
          overflowX="auto"
          borderBottom="1px solid var(--surface-border)"
          css={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
        >
          {TABS.map((label, i) => (
            <Box
              key={i}
              as="button"
              type="button"
              ref={(el: HTMLButtonElement | null) => { tabRefs.current[i] = el; }}
              onClick={(e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setActiveTab(i); }}
              px="2.4rem"
              py="1.6rem"
              whiteSpace="nowrap"
              fontSize="1.4rem"
              fontFamily="Montserrat, sans-serif"
              fontWeight={activeTab === i ? '600' : '500'}
              color={activeTab === i ? 'var(--brand-primary)' : 'var(--text-muted)'}
              bg="transparent"
              border="none"
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{ color: 'var(--brand-primary)' }}
              _focus={{ outline: 'none' }}
            >
              {label}
            </Box>
          ))}
        </Flex>

        <Box
          position="absolute"
          bottom="0"
          left={`${indicator.left}px`}
          width={`${indicator.width}px`}
          height="2px"
          bg="var(--brand-primary)"
          transition="left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)"
          zIndex={1}
          pointerEvents="none"
        />
      </Box>

      {/* Tab content */}
      <Box mt="2.4rem" minH="20rem">
        {TABS.map((_, i) => (
          <Box key={i} display={activeTab === i ? 'block' : 'none'}>
            {content[i]}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export const AddressTabs = memo(AddressTabsBase);
export default AddressTabs;
