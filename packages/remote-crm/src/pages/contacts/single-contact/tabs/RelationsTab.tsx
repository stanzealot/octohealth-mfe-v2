import React, { useState, useMemo, memo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { CheckCircle, Plus, SlidersHorizontal } from 'lucide-react';
import AppButton from 'sharedUi/AppButton';
import { mockRelations, type Relation } from './types';

const RelationCard = memo(function RelationCard({ relation }: { relation: Relation }) {
  return (
    <Box
      border="1px solid var(--surface-border)"
      borderRadius="8px"
      p="1.6rem"
      bg="var(--surface-card)"
      display="flex"
      flexDirection="column"
      gap="1.2rem"
      transition="box-shadow 0.2s"
      _hover={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
    >
      {}
      <Flex justify="space-between" align="center">
        <Box
          bg="var(--hover-bg)"
          borderRadius="4px"
          px="0.8rem"
          py="0.4rem"
          fontSize="1.2rem"
          fontWeight="600"
          color="var(--text-muted)"
          fontFamily="Montserrat, sans-serif"
        >
          {relation.initials}
        </Box>
        <CheckCircle size={18} color="var(--brand-primary)" />
      </Flex>

      {}
      <Text
        fontFamily="Montserrat, sans-serif"
        fontSize="1.6rem"
        fontWeight="600"
        color="var(--text-primary)"
      >
        {relation.name}
      </Text>

      {}
      <Box>
        <Flex justify="space-between" mb="0.4rem">
          <Text fontFamily="Montserrat, sans-serif" fontSize="1.4rem" color="var(--text-muted)">
            Gender:
          </Text>
          <Text fontFamily="Montserrat, sans-serif" fontSize="1.4rem" color="var(--text-primary)">
            {relation.gender}
          </Text>
        </Flex>
        <Flex justify="space-between" mb="0.4rem">
          <Text fontFamily="Montserrat, sans-serif" fontSize="1.4rem" color="var(--text-muted)">
            Age:
          </Text>
          <Text fontFamily="Montserrat, sans-serif" fontSize="1.4rem" color="var(--text-primary)">
            {relation.age} years
          </Text>
        </Flex>
        <Flex justify="space-between">
          <Text fontFamily="Montserrat, sans-serif" fontSize="1.4rem" color="var(--text-muted)">
            Relationship:
          </Text>
          <Text fontFamily="Montserrat, sans-serif" fontSize="1.4rem" color="var(--text-primary)">
            {relation.relationship}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
});

interface Props {
  contactId: string;
}

function RelationsTabBase({ contactId: _contactId }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (!searchTerm) return mockRelations;
    const q = searchTerm.toLowerCase();
    return mockRelations.filter(
      (r) => r.name.toLowerCase().includes(q) || r.relationship.toLowerCase().includes(q),
    );
  }, [searchTerm]);

  return (
    <Box
      border="1px solid var(--surface-border)"
      borderRadius="8px"
      bg="var(--surface-card)"
      overflow="hidden"
    >
      {}
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justify="space-between"
        align={{ base: 'stretch', lg: 'center' }}
        gap="1.2rem"
        p="1.6rem"
        bg="var(--table-header-bg)"
        borderBottom="1px solid var(--surface-border)"
      >
        <Flex gap="1.2rem" align="center" flex="1">
          <Box maxW={{ base: '100%', md: '32rem' }} w="100%">
            <input
              type="text"
              placeholder="Search relations…"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1.2rem',
                border: '1px solid var(--surface-border)',
                borderRadius: '6px',
                fontSize: '1.4rem',
                fontFamily: 'Montserrat, sans-serif',
                background: 'var(--surface-card)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                e.target.style.borderColor = 'var(--brand-primary)';
              }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                e.target.style.borderColor = 'var(--surface-border)';
              }}
            />
          </Box>
          <AppButton
            variant="gray-outline"
            leftIcon={<SlidersHorizontal size={16} />}
            buttonSize="md"
          >
            Filter
          </AppButton>
        </Flex>

        <AppButton variant="primary" leftIcon={<Plus size={16} />} enableRipple>
          Add New Relation
        </AppButton>
      </Flex>

      {}
      <Box p="2.4rem">
        {filtered.length === 0 ? (
          <Box textAlign="center" py="3.2rem">
            <Text fontFamily="Montserrat, sans-serif" color="var(--text-muted)" fontSize="1.4rem">
              No relations found
            </Text>
          </Box>
        ) : (
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(28rem, 1fr))"
            gap="2.4rem"
          >
            {filtered.map((r) => (
              <RelationCard key={r.id} relation={r} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export const RelationsTab = memo(RelationsTabBase);
export default RelationsTab;
