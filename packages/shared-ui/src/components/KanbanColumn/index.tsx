import React, { memo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

interface Props {
  stageIcon?: React.ReactNode;
  stageName: string;

  width?: string;

  minHeight?: string;

  emptyMessage?: string;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  children?: React.ReactNode;

  isEmpty?: boolean;
}

function KanbanColumnBase({
  stageIcon,
  stageName,
  width = '28rem',
  minHeight = '60rem',
  emptyMessage = 'No opportunities',
  onDrop,
  onDragOver,
  children,
  isEmpty = false,
}: Props) {
  return (
    <Box
      bg="var(--surface-card)"
      borderRadius="12px"
      border="1px solid var(--surface-border)"
      minH={minHeight}
      w={width}
      flexShrink={0}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {}
      <Flex align="center" gap="0.8rem" borderBottom="1px solid var(--surface-border)" p="1.6rem">
        {stageIcon && (
          <Box display="flex" alignItems="center" flexShrink={0}>
            {stageIcon}
          </Box>
        )}
        <Text
          fontSize="1.4rem"
          fontWeight="600"
          color="var(--text-primary)"
          fontFamily="Montserrat, sans-serif"
        >
          {stageName}
        </Text>
      </Flex>

      {}
      <Box p="1.6rem">
        {children}

        {}
        {isEmpty && (
          <Box
            p="3.2rem 1.6rem"
            textAlign="center"
            border="2px dashed var(--surface-border)"
            borderRadius="8px"
            color="var(--text-muted)"
            bg="transparent"
          >
            <Text fontSize="1.4rem" fontFamily="Montserrat, sans-serif">
              {emptyMessage}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export const KanbanColumn = memo(KanbanColumnBase);
export default KanbanColumn;
