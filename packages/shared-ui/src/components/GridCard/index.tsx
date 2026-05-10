import React, { useState, memo } from 'react';
import { Box, Flex, Text, Avatar } from '@chakra-ui/react';
import CardActionMenu, { type CardAction } from '../CardActionMenu';

const STATUS_DOT: Record<string, string> = {
  Active: '#12B76A',
  Inactive: '#475467',
  Suspended: '#B42318',
};

type StatusType = 'Active' | 'Inactive' | 'Suspended' | string;

interface Detail {
  label: string;
  value: string;
}

export interface GridCardProps {
  id: string;
  title: string;
  status: StatusType;
  avatar: { name: string };
  details: Detail[];
  actions: CardAction[];
  onCardClick?: (id: string) => void;
  hoverEffect?: boolean;
}

export const GridCard = memo(function GridCard({
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
  const dotColor = STATUS_DOT[status] ?? '#475467';

  return (
    <Box
      bg="var(--surface-card)"
      borderRadius="1.6rem"
      border="1px solid var(--surface-border)"
      p="2rem"
      position="relative"
      boxShadow={hovered ? 'var(--shadow-card), 0 8px 24px rgba(0,0,0,0.10)' : 'var(--shadow-card)'}
      transform={hoverEffect && hovered ? 'scale(1.02) translateY(-2px)' : 'scale(1) translateY(0)'}
      transition="all 0.22s ease-in-out"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {}
      <Box
        position="absolute"
        top="1.4rem"
        right="1.4rem"
        w="1rem"
        h="1rem"
        borderRadius="50%"
        bg={dotColor}
        title={status}
        flexShrink={0}
      />

      {}
      <Box cursor={onCardClick ? 'pointer' : 'default'} onClick={() => onCardClick?.(id)}>
        {}
        <Flex flexDir="column" align="center" mb="1.2rem">
          <Avatar.Root h="5rem" w="5rem" mb="0.8rem">
            <Avatar.Fallback
              name={avatar.name}
              bg="var(--avatar-fallback-bg)"
              color="var(--avatar-fallback-color)"
              fontFamily="Montserrat, sans-serif"
              fontWeight="700"
              fontSize="1.6rem"
            />
          </Avatar.Root>

          <Text
            fontWeight="700"
            fontSize="1.4rem"
            color="var(--text-primary)"
            fontFamily="Montserrat, sans-serif"
            textAlign="center"
            lineClamp={1}
          >
            {title}
          </Text>
        </Flex>

        {}
        <Flex flexDir="column" gap="0.8rem" w="100%" maxW="18rem" mx="auto" mb="0.4rem">
          {details.map((d) => (
            <Flex key={d.label} justify="space-between" w="100%" align="center">
              <Text fontSize="1.3rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
                {d.label}
              </Text>
              <Text
                fontSize="1.3rem"
                fontWeight="600"
                color="var(--text-secondary)"
                fontFamily="Montserrat, sans-serif"
              >
                {d.value}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>

      {}
      <Box
        mt="1.4rem"
        p="1rem 1.4rem"
        bg="var(--hover-bg)"
        borderRadius="8px"
        onClick={(e) => e.stopPropagation()}
      >
        <CardActionMenu actions={actions} />
      </Box>
    </Box>
  );
});

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
