import React, { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import SharedActionMenu from '../ActionMenu';

type StatusType = 'Active' | 'Inactive' | 'Suspended' | string;

const STATUS_DOT: Record<string, string> = {
  Active:    '#12B76A',
  Inactive:  '#98A2B3',
  Suspended: '#F79009',
};

interface Detail {
  label: string;
  value: string;
}

interface Action {
  label: string;
  cta: () => void;
  allowPopover?: boolean;
  confirmationText?: string;
}

interface AvatarConfig {
  name: string;
  bg?: string;
  color?: string;
}

export interface GridCardProps {
  id: string;
  title: string;
  status: StatusType;
  avatar: AvatarConfig;
  details: Detail[];
  actions: Action[];
  onCardClick?: (id: string) => void;
  hoverEffect?: boolean;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return ((parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '')).toUpperCase();
}

export function GridCard({
  id,
  title,
  status,
  avatar,
  details,
  actions,
  onCardClick,
  hoverEffect = true,
}: GridCardProps) {
  const [hovered, setHovered] = useState(false);
  const dotColor = STATUS_DOT[status] ?? '#98A2B3';

  return (
    <Box
      bg="white"
      border="1px solid #EAECF0"
      borderRadius="1.2rem"
      overflow="hidden"
      cursor={onCardClick ? 'pointer' : 'default'}
      transition="all 0.2s ease"
      transform={hoverEffect && hovered ? 'scale(1.02)' : 'scale(1)'}
      boxShadow={hovered ? '0 8px 24px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.05)'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onCardClick?.(id)}
      position="relative"
    >
      {/* Status dot */}
      <Box
        position="absolute"
        top="1.2rem"
        right="1.2rem"
        w="1rem"
        h="1rem"
        borderRadius="50%"
        bg={dotColor}
        title={status}
      />

      {/* Card body */}
      <Box p="2rem">
        {/* Avatar + name */}
        <Flex direction="column" align="center" gap="1rem" mb="2rem">
          <Flex
            align="center"
            justify="center"
            w="6rem"
            h="6rem"
            borderRadius="50%"
            bg={avatar.bg ?? '#E0FAEC'}
            color={avatar.color ?? '#0C6525'}
            fontWeight="700"
            fontSize="2rem"
            fontFamily="Montserrat, sans-serif"
            flexShrink={0}
          >
            {getInitials(avatar.name)}
          </Flex>
          <Text
            fontSize="1.5rem"
            fontWeight={600}
            color="#101828"
            fontFamily="Montserrat, sans-serif"
            textAlign="center"
            noOfLines={1}
          >
            {title}
          </Text>
        </Flex>

        {/* Details grid */}
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr"
          gap="0.8rem 1.6rem"
        >
          {details.map((d, i) => (
            <Box key={i}>
              <Text fontSize="1.1rem" color="#98A2B3" fontFamily="Montserrat, sans-serif" mb="0.2rem">
                {d.label}
              </Text>
              <Text fontSize="1.3rem" fontWeight={500} color="#344054" fontFamily="Montserrat, sans-serif">
                {d.value}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Footer — actions */}
      <Flex
        borderTop="1px solid #EAECF0"
        bg="#FAFAFA"
        px="1.6rem"
        py="1.2rem"
        justify="flex-end"
        onClick={(e) => e.stopPropagation()}
      >
        <SharedActionMenu actions={actions} />
      </Flex>
    </Box>
  );
}

export function GridCardList({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        .grid-card-list {
          display: grid;
          gap: 2rem;
          grid-template-columns: repeat(4, 1fr);
        }
        @media (max-width: 1400px) {
          .grid-card-list { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 1024px) {
          .grid-card-list { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .grid-card-list { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="grid-card-list">{children}</div>
    </>
  );
}
