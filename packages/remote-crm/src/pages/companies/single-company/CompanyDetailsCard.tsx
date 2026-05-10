import React, { useState, memo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppButton from 'sharedUi/AppButton';
import { ThreeColumnDetailGrid } from 'sharedUi/DetailGridPresets';
import type { Entity } from '../types';
import { getInitials } from '../constants';

interface Props {
  entity: Entity;
}

function CompanyDetailsCardBase({ entity }: Props) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const sections = [
    {
      items: [
        { label: 'Name', value: entity.name },
        { label: 'Industry', value: 'Health' },
        { label: 'Category', value: 'Pharmacy' },
      ],
    },
    {
      items: [
        { label: 'No of Employees', value: '34' },
        { label: 'Legal Entity Type', value: 'Limited Liability' },
        { label: 'Annual Revenue', value: '₦857,967.09' },
      ],
    },
    {
      items: [
        { label: 'Owner ID', value: '98765' },
        { label: 'Lead ID', value: '98765' },
        { label: 'CAC', value: entity.cac || '98765' },
      ],
    },
  ];

  return (
    <>
      {}
      <Box borderBottom="1px solid var(--surface-border)" pb="2.4rem">
        <Flex justify="space-between" align="center">
          <Text
            fontFamily="Montserrat, sans-serif"
            fontSize="2.4rem"
            fontWeight="600"
            color="var(--text-primary)"
          >
            Entity Details
          </Text>
          <AppButton
            variant="outline"
            leftIcon={<Pencil size={16} />}
            buttonSize="md"
            onClick={() => navigate(`/crm/companies/edit/${entity.id}`)}
          >
            Edit information
          </AppButton>
        </Flex>
      </Box>

      {}
      <Box mt="2.8rem">
        <Flex align="flex-start" gap="2.4rem" mb="3.2rem" flexDir={{ base: 'column', sm: 'row' }}>
          {}
          {!imgError && entity.logo ? (
            <Box
              as="img"
              src={entity.logo}
              alt={entity.name}
              w="8rem"
              h="8rem"
              borderRadius="12px"
              objectFit="cover"
              flexShrink={0}
              onError={() => setImgError(true)}
            />
          ) : (
            <Flex
              w="8rem"
              h="8rem"
              bg="rgba(18,183,106,0.12)"
              borderRadius="12px"
              align="center"
              justify="center"
              fontSize="2.4rem"
              fontWeight="700"
              color="var(--status-success)"
              fontFamily="Montserrat, sans-serif"
              flexShrink={0}
            >
              {getInitials(entity.name)}
            </Flex>
          )}

          <Box flex="1">
            <Text
              fontFamily="Montserrat, sans-serif"
              fontSize="2.4rem"
              fontWeight="600"
              color="var(--text-primary)"
            >
              {entity.name}
            </Text>
          </Box>
        </Flex>

        <ThreeColumnDetailGrid sections={sections} />
      </Box>
    </>
  );
}

export const CompanyDetailsCard = memo(CompanyDetailsCardBase);
export default CompanyDetailsCard;
