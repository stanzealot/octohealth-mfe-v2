import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import type { ProviderDetails } from '../../../../types';
import ProviderInfoTab from './ProviderInfoTab';
import ContactInfoTab from './ContactInfoTab';
import FinancialInfoTab from './FinancialInfoTab';

interface Props {
  provider: ProviderDetails;
}

const TABS = ['Provider Info', 'Contact Info', 'Financial Info'];

function ProviderTabsBase({ provider }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateIndicator = useCallback((index: number) => {
    const el = tabRefs.current[index];
    const container = containerRef.current;
    if (!el || !container) return;
    const cr = container.getBoundingClientRect();
    const tr = el.getBoundingClientRect();
    setIndicator({ left: tr.left - cr.left + container.scrollLeft, width: tr.width });
  }, []);

  useEffect(() => {
    updateIndicator(activeTab);
  }, [activeTab, updateIndicator]);

  const tabContent = [
    <ProviderInfoTab key="info" provider={provider} />,
    <ContactInfoTab key="contact" provider={provider} />,
    <FinancialInfoTab key="financial" provider={provider} />,
  ];

  return (
    <Box mt="2.4rem">
      <Box position="relative" ref={containerRef as React.RefObject<HTMLDivElement>}>
        <Flex
          overflowX="auto"
          borderBottom="1px solid var(--surface-border)"
          css={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
        >
          {TABS.map((tab, i) => (
            <Box
              key={tab}
              as="button"
              ref={(el: HTMLButtonElement | null) => {
                tabRefs.current[i] = el;
              }}
              onClick={() => setActiveTab(i)}
              px="2.4rem"
              py="1.6rem"
              whiteSpace="nowrap"
              fontFamily="Montserrat, sans-serif"
              fontSize="1.4rem"
              fontWeight={activeTab === i ? '600' : '500'}
              color={activeTab === i ? 'var(--text-primary)' : 'var(--text-muted)'}
              bg="transparent"
              border="none"
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{ color: 'var(--text-primary)', bg: 'var(--hover-bg)' }}
              _focus={{ outline: 'none' }}
            >
              {tab}
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
          transition="all 0.3s cubic-bezier(0.4,0,0.2,1)"
          zIndex={1}
        />
      </Box>

      <Box mt="2.8rem" minHeight="40rem" position="relative" overflow="hidden">
        {tabContent.map((content, i) => (
          <Box
            key={i}
            position={activeTab === i ? 'relative' : 'absolute'}
            top={activeTab === i ? '0' : '-100%'}
            left="0"
            right="0"
            opacity={activeTab === i ? 1 : 0}
            transform={activeTab === i ? 'translateY(0)' : 'translateY(20px)'}
            transition="all 0.4s cubic-bezier(0.4,0,0.2,1)"
            overflow="hidden"
          >
            {content}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export const ProviderTabs = memo(ProviderTabsBase);
export default ProviderTabs;
