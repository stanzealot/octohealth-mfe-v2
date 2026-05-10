import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';
import AnimatedModal from '../AnimatedModal';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete item?',
  description = 'This action cannot be undone.',
}: ConfirmDeleteModalProps) {
  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose} size="sm">
      <Flex direction="column" align="center" textAlign="center" gap="1.6rem">
        <Flex
          align="center"
          justify="center"
          w="6rem"
          h="6rem"
          borderRadius="50%"
          bg="#FEF2F2"
          flexShrink={0}
        >
          <Trash2 size={28} color="var(--status-danger)" />
        </Flex>
        <Box>
          <Text
            fontSize="1.8rem"
            fontWeight={700}
            color="var(--text-primary)"
            fontFamily="Montserrat, sans-serif"
            mb="0.8rem"
          >
            {title}
          </Text>
          <Text fontSize="1.4rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
            {description}
          </Text>
        </Box>
        <Flex gap="1.2rem" w="100%">
          <Box
            as="button"
            flex={1}
            h="4.4rem"
            borderRadius="8px"
            border="1px solid var(--surface-border)"
            bg="var(--surface-card)"
            color="var(--text-secondary)"
            fontSize="1.4rem"
            fontWeight={600}
            fontFamily="Montserrat, sans-serif"
            cursor="pointer"
            _hover={{ bg: 'var(--hover-bg)' }}
            onClick={onClose}
          >
            Cancel
          </Box>
          <Box
            as="button"
            flex={1}
            h="4.4rem"
            borderRadius="8px"
            border="1px solid var(--status-danger)"
            bg="var(--status-danger)"
            color="white"
            fontSize="1.4rem"
            fontWeight={600}
            fontFamily="Montserrat, sans-serif"
            cursor="pointer"
            _hover={{ bg: '#C91C1C' }}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </Box>
        </Flex>
      </Flex>
    </AnimatedModal>
  );
}
