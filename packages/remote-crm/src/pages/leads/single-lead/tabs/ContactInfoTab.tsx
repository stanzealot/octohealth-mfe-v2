/**
 * ContactInfoTab — Contact Info tab content
 *
 * Renders 4 GridCards in a responsive SimpleGrid (1→2→4 cols).
 * Contact data is derived from lead fields (matches monolith exactly).
 */

import React, { useMemo, memo } from 'react';
import { Box, SimpleGrid } from '@chakra-ui/react';
import { GridCard } from 'sharedUi/GridCard';
import type { Lead } from '../../types';

interface Props { lead: Lead }

function ContactInfoTabBase({ lead }: Props) {
  const contacts = useMemo(() => {
    const email = `${lead.contact.toLowerCase().replace(' ', '.')  }@${lead.entity.toLowerCase().replace(' ', '')}.com`;
    return [
      {
        id:      '1',
        name:    lead.contact,
        gender:  'Male',
        age:     '51 years',
        emrNo:   '9080919',
        regDate: lead.createdDate,
        email,
        phone:   '+1 (555) 123-4567',
      },
      {
        id:      '2',
        name:    lead.contact,
        gender:  'Male',
        age:     '51 years',
        emrNo:   '9080919',
        regDate: lead.createdDate,
        email,
        phone:   '+1 (555) 234-5678',
      },
      {
        id:      '3',
        name:    lead.contact,
        gender:  'Male',
        age:     '51 years',
        emrNo:   undefined,
        regDate: lead.createdDate,
        email,
        phone:   '+1 (555) 345-6789',
      },
      {
        id:      '4',
        name:    lead.contact,
        gender:  'Male',
        age:     '51 years',
        emrNo:   '9080919',
        regDate: lead.createdDate,
        email,
        phone:   '+1 (555) 456-7890',
      },
    ];
  }, [lead]);

  return (
    <Box p="2.4rem">
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="2.4rem">
        {contacts.map((c) => (
          <GridCard
            key={c.id}
            id={c.id}
            title={c.name}
            status="Active"
            avatar={{ name: c.name }}
            details={[
              { label: 'Gender:',   value: c.gender   },
              { label: 'Age:',      value: c.age      },
              ...(c.emrNo ? [{ label: 'EMR No:', value: c.emrNo }] : []),
              { label: 'Reg. Date:', value: c.regDate },
            ]}
            actions={[]}
            hoverEffect
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export const ContactInfoTab = memo(ContactInfoTabBase);
export default ContactInfoTab;
