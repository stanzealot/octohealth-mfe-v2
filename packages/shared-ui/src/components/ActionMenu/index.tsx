import React, { useState, useRef, useEffect } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { MoreHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Action {
  label: string;
  cta: () => void;
  variant?: 'default' | 'danger';
  allowPopover?: boolean;
  confirmationText?: string;
}

interface ActionMenuProps {
  actions: Action[];
}

export default function SharedActionMenu({ actions }: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<Action | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirmAction(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAction = (action: Action) => {
    if (action.allowPopover && action.confirmationText) {
      setConfirmAction(action);
    } else {
      setOpen(false);
      action.cta();
    }
  };

  return (
    <Box position="relative" ref={menuRef}>
      <Box
        as="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="3.2rem"
        h="3.2rem"
        borderRadius="6px"
        border="1px solid #E4E7EC"
        bg="white"
        cursor="pointer"
        color="#667085"
        transition="all 0.2s"
        _hover={{ bg: '#F9FAFB', borderColor: '#D0D5DD', color: '#344054' }}
        onClick={() => { setOpen((p) => !p); setConfirmAction(null); }}
      >
        <MoreHorizontal size={16} />
      </Box>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 4px)',
              zIndex: 300,
              minWidth: '160px',
            }}
          >
            {confirmAction ? (
              /* Confirmation popover */
              <Box
                bg="white"
                borderRadius="10px"
                boxShadow="0 4px 20px rgba(0,0,0,0.12)"
                border="1px solid #FECACA"
                p="1.2rem"
                minW="22rem"
              >
                <Text fontSize="1.3rem" color="#344054" fontFamily="Montserrat, sans-serif" mb="1.2rem">
                  {confirmAction.confirmationText}
                </Text>
                <Flex gap="0.8rem" justify="flex-end">
                  <Box
                    as="button"
                    px="1.2rem"
                    h="3.2rem"
                    borderRadius="6px"
                    border="1px solid #D0D5DD"
                    bg="white"
                    color="#344054"
                    fontSize="1.3rem"
                    fontFamily="Montserrat, sans-serif"
                    cursor="pointer"
                    onClick={() => setConfirmAction(null)}
                  >
                    Cancel
                  </Box>
                  <Box
                    as="button"
                    px="1.2rem"
                    h="3.2rem"
                    borderRadius="6px"
                    border="1px solid #DC2626"
                    bg="#DC2626"
                    color="white"
                    fontSize="1.3rem"
                    fontFamily="Montserrat, sans-serif"
                    cursor="pointer"
                    onClick={() => { setOpen(false); setConfirmAction(null); confirmAction.cta(); }}
                  >
                    Delete
                  </Box>
                </Flex>
              </Box>
            ) : (
              /* Normal menu */
              <Box
                bg="white"
                borderRadius="10px"
                boxShadow="0 4px 20px rgba(0,0,0,0.12)"
                border="1px solid #E4E7EC"
                overflow="hidden"
                py="0.4rem"
              >
                {actions.map((action) => (
                  <Box
                    key={action.label}
                    as="button"
                    display="flex"
                    w="100%"
                    px="1.4rem"
                    py="1rem"
                    fontSize="1.4rem"
                    fontFamily="Montserrat, sans-serif"
                    color={action.label.toLowerCase() === 'delete' ? '#DC2626' : '#344054'}
                    bg="transparent"
                    border="none"
                    cursor="pointer"
                    textAlign="left"
                    _hover={{ bg: action.label.toLowerCase() === 'delete' ? '#FEF2F2' : '#F9FAFB' }}
                    transition="background 0.15s"
                    onClick={() => handleAction(action)}
                  >
                    {action.label}
                  </Box>
                ))}
              </Box>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
