/**
 * GridCompanies — card grid view of entities/companies
 */

import React, { memo } from 'react';
import { Grid } from '@chakra-ui/react';
import { GridCard } from 'sharedUi/GridCard';
import type { Entity } from '../types';
import { getInitials } from '../constants';

interface Props {
  entities:      Entity[];
  onEntityClick: (id: string) => void;
  onEditClick:   (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export const GridCompanies = memo(function GridCompanies({
  entities,
  onEntityClick,
  onEditClick,
  onDeleteClick,
}: Props) {
  return (
    <Grid
      gap="2rem"
      templateColumns={{
        base: 'repeat(1, 1fr)',
        sm:   'repeat(2, 1fr)',
        lg:   'repeat(3, 1fr)',
        xl:   'repeat(4, 1fr)',
      }}
    >
      {entities.map((entity) => (
        <GridCard
          key={entity.id}
          id={entity.id}
          title={entity.name}
          status={entity.status}
          avatar={{ name: entity.name }}
          details={[
            { label: 'Entity ID:',      value: entity.providerCode || 'N/A' },
            { label: 'Industry:',       value: 'Health'                     },
            { label: 'No of Employee:', value: '190'                        },
            { label: 'Annual Revenue:', value: '₦456,906.00'               },
          ]}
          actions={[
            { label: 'View',   cta: () => onEntityClick(entity.id)  },
            { label: 'Edit',   cta: () => onEditClick(entity.id)    },
            { label: 'Delete', cta: () => onDeleteClick(entity.id)  },
          ]}
          onCardClick={onEntityClick}
          hoverEffect
        />
      ))}
    </Grid>
  );
});

export default GridCompanies;
