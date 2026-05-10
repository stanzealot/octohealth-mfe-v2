import React, { memo } from 'react';
import { Box, Text, Flex, Menu, IconButton, Portal } from '@chakra-ui/react';
import { MoreVertical } from 'lucide-react';

export interface CardColorConfig {
  borderTop: string;
  badge: { bg: string; text: string };
  hover: { borderColor: string; boxShadow: string };
}

export interface CardInfoRow {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export interface CardMenuItem {
  label: string;
  value: string;
  danger?: boolean;
  onClick: () => void;
}

export interface OpportunityCardProps {
  title: string;
  description?: string;
  stageName: string;

  stageIndicatorColor: string;
  cardColors: CardColorConfig;
  infoRows?: CardInfoRow[];
  menuItems: CardMenuItem[];
  isDragging?: boolean;
}

function OpportunityCardBase({
  title,
  description,
  stageName,
  stageIndicatorColor,
  cardColors,
  infoRows = [],
  menuItems,
  isDragging = false,
}: OpportunityCardProps) {
  return (
    <Box
      bg="var(--surface-card)"
      border="1px solid var(--surface-border)"
      borderTop={`3px solid ${cardColors.borderTop}`}
      borderRadius="12px"
      p="1.6rem"
      mb="1.2rem"
      cursor="grab"
      _hover={{
        boxShadow: cardColors.hover.boxShadow,
        transform: 'translateY(-4px)',
        borderColor: cardColors.hover.borderColor,
        borderTopColor: cardColors.borderTop,
        zIndex: 10,
      }}
      transition="all 0.2s ease-in-out"
      opacity={isDragging ? 0.5 : 1}
      transform={isDragging ? 'rotate(5deg)' : 'none'}
      position="relative"
      zIndex={isDragging ? 5 : 1}
    >
      {}
      <Flex justify="space-between" align="flex-start" mb="1.2rem">
        {}
        <Flex
          align="center"
          gap="0.6rem"
          bg={cardColors.badge.bg}
          color={cardColors.badge.text}
          fontSize="1rem"
          px="0.8rem"
          py="0.4rem"
          borderRadius="4px"
          fontWeight="500"
          border="1px solid"
          borderColor={cardColors.badge.text + '20'}
          fontFamily="Montserrat, sans-serif"
          maxW="calc(100% - 4rem)"
          flexShrink={0}
        >
          {}
          <Box
            as="span"
            w="6px"
            h="6px"
            borderRadius="50%"
            bg={stageIndicatorColor}
            display="inline-block"
            flexShrink={0}
          />
          <Text as="span" fontSize="1rem" fontFamily="Montserrat, sans-serif" noOfLines={1}>
            {stageName}
          </Text>
        </Flex>

        {}
        <Menu.Root positioning={{ placement: 'bottom-end' }}>
          <Menu.Trigger asChild>
            <IconButton
              variant="ghost"
              size="sm"
              color="var(--text-muted)"
              _hover={{ bg: 'var(--hover-bg)' }}
              aria-label="Card options"
              position="relative"
              zIndex={20}
              minW="3.2rem"
              h="3.2rem"
            >
              <MoreVertical size={16} />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content
                zIndex={9999}
                boxShadow="0px 10px 38px -10px rgba(22,23,24,0.35), 0px 10px 20px -15px rgba(22,23,24,0.2)"
                border="1px solid var(--surface-border)"
                borderRadius="8px"
                bg="var(--surface-card)"
                py="0.4rem"
                minW="16rem"
              >
                {menuItems.map((item) => (
                  <Menu.Item
                    key={item.value}
                    value={item.value}
                    onClick={item.onClick}
                    fontSize="1.4rem"
                    py="0.8rem"
                    px="1.2rem"
                    color={item.danger ? 'var(--status-danger)' : 'var(--text-secondary)'}
                    _hover={{ bg: item.danger ? '#FEF2F2' : 'var(--hover-bg)' }}
                    fontFamily="Montserrat, sans-serif"
                    cursor="pointer"
                  >
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>

      {}
      <Text
        fontSize="1.4rem"
        fontWeight="600"
        color="var(--text-primary)"
        mb="0.8rem"
        lineClamp={2}
        fontFamily="Montserrat, sans-serif"
      >
        {title}
      </Text>

      {}
      {description && (
        <Text
          fontSize="1.4rem"
          color="var(--text-muted)"
          mb="1.2rem"
          lineClamp={2}
          fontFamily="Montserrat, sans-serif"
        >
          {description}
        </Text>
      )}

      {}
      {infoRows.length > 0 && (
        <Box border="1px solid var(--surface-border)" borderRadius="8px" p="1.2rem">
          {infoRows.map((row, i) => (
            <Flex key={i} gap="0.8rem" align="center" mb={i < infoRows.length - 1 ? '0.6rem' : 0}>
              <Box flexShrink={0} display="flex" alignItems="center">
                {row.icon}
              </Box>
              <Flex align="center" gap="0.4rem" fontSize="1.2rem" flexWrap="wrap">
                <Text
                  color="var(--text-muted)"
                  fontFamily="Montserrat, sans-serif"
                  whiteSpace="nowrap"
                >
                  {row.label}:
                </Text>
                <Text color="var(--text-primary)" fontFamily="Montserrat, sans-serif">
                  {row.value}
                </Text>
              </Flex>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
}

export const OpportunityCard = memo(OpportunityCardBase);
export default OpportunityCard;
