import React, { type ReactNode } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SIZE_MAP: Record<ModalSize, string> = {
  sm:   '40rem',
  md:   '52rem',
  lg:   '72rem',
  xl:   '90rem',
  full: '98vw',
};

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: ReactNode;
}

export default function AnimatedModal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
}: AnimatedModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(16,24,40,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            zIndex: 1000,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              width: SIZE_MAP[size],
              maxWidth: '95vw',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--surface-card)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(16,24,40,0.18)',
            }}
          >
            {/* Header */}
            {title && (
              <Flex
                align="center"
                justify="space-between"
                px="2.4rem"
                py="2rem"
                borderBottom="1px solid var(--surface-border)"
              >
                <Text
                  fontSize="1.8rem"
                  fontWeight={700}
                  color="var(--text-primary)"
                  fontFamily="Montserrat, sans-serif"
                >
                  {title}
                </Text>
                <Box
                  as="button"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w="3.6rem"
                  h="3.6rem"
                  borderRadius="8px"
                  border="1px solid var(--surface-border)"
                  bg="var(--surface-card)"
                  cursor="pointer"
                  color="var(--text-muted)"
                  _hover={{ bg: 'var(--hover-bg)', color: 'var(--text-secondary)' }}
                  transition="all 0.15s"
                  onClick={onClose}
                >
                  <X size={18} />
                </Box>
              </Flex>
            )}

            {/* Body */}
            <Box px="2.4rem" py="2rem">
              {children}
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
