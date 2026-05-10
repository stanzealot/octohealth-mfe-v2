import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import type { Lead } from '../../types';
import LeadInfoTab from './LeadInfoTab';
import ContactInfoTab from './ContactInfoTab';

interface LeadTabsProps {
  lead: Lead;
}

function LeadTabsBase({ lead }: LeadTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { label: 'Lead Info', content: <LeadInfoTab lead={lead} /> },
    { label: 'Contact Info', content: <ContactInfoTab lead={lead} /> },
  ];

  const updateIndicator = useCallback((index: number) => {
    const el = tabRefs.current[index];
    const container = containerRef.current;
    if (!el || !container) return;
    const cRect = container.getBoundingClientRect();
    const tRect = el.getBoundingClientRect();
    setIndicator({
      left: tRect.left - cRect.left + container.scrollLeft,
      width: tRect.width,
    });
  }, []);

  useEffect(() => {
    updateIndicator(activeTab);
  }, [activeTab, updateIndicator]);

  useEffect(() => {
    const handler = () => updateIndicator(activeTab);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [activeTab, updateIndicator]);

  return (
    <Box mt="2.4rem">
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
              onClick={() => setActiveTab(index)}
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
      <Box mt="2.8rem" minHeight="40rem" position="relative" overflow="hidden">
        {tabs.map((tab, index) => {
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

export const LeadTabs = memo(LeadTabsBase);
export default LeadTabs;
