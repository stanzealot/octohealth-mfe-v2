/**
 * RelationsSection.tsx
 *
 * Accordion section for related contacts.
 *
 * Uses react-hook-form's useFieldArray for dynamic add / remove.
 * "Contact Person" is an async paginated search (AppAsyncSelect).
 * "Relationship type" is a static AppSelect populated from the API.
 */
import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { PlusSquare, Trash2 } from 'lucide-react';
import AppAccordionSection from 'sharedUi/AppAccordionSection';
import AppSelect from 'sharedUi/AppSelect';
import AppAsyncSelect from 'sharedUi/AppAsyncSelect';
import type { ContactFormPayload } from '../schema';
import { loadContactOptions, fetchRelationships } from '../../../../lib/contacts-api';
import type { StrOption } from '../../../../lib/contacts-api';

/* ─── Props ───────────────────────────────────────────────────────── */
interface RelationsSectionProps {
  handler: UseFormReturn<ContactFormPayload>;
}

/* ─── Component ───────────────────────────────────────────────────── */
export function RelationsSection({ handler }: RelationsSectionProps) {
  const { control, setValue, watch } = handler;
  const [relationshipOptions, setRelationshipOptions] = useState<StrOption[]>([]);

  /* Load relationship type options once */
  useEffect(() => {
    fetchRelationships().then(setRelationshipOptions);
  }, []);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'relations',
  });

  const relations = watch('relations') ?? [];
  const defaultOpen = fields.length > 0;

  const addRow = () =>
    append({ contact2Id: { label: '', value: '' }, relationshipId: { label: '', value: '' } });

  return (
    <AppAccordionSection
      title="Relations"
      defaultOpen={defaultOpen}
      headerExtra={
        fields.length > 0 ? (
          <Box
            px="0.8rem"
            py="0.2rem"
            borderRadius="full"
            bg="var(--brand-primary-light)"
            fontSize="1.2rem"
            fontWeight="600"
            color="var(--brand-primary)"
            fontFamily="Montserrat, sans-serif"
          >
            {fields.length}
          </Box>
        ) : undefined
      }
    >
      <Flex direction="column" gap="2rem">
        {fields.length === 0 && (
          <Text
            fontSize="1.4rem"
            color="var(--text-muted)"
            fontFamily="Montserrat, sans-serif"
            textAlign="center"
            py="1rem"
          >
            No relations added yet. Click "Add Relation" below.
          </Text>
        )}

        {fields.map((field, index) => {
          const row = relations[index];

          return (
            <Flex key={field.id} align="flex-end" gap="1.2rem">
              {/* Contact person async search */}
              <Box flex={1}>
                <AppAsyncSelect
                  label="Contact Person"
                  placeholder="Search contact…"
                  loadOptions={loadContactOptions}
                  value={
                    row?.contact2Id?.value
                      ? { label: row.contact2Id.label ?? '', value: row.contact2Id.value }
                      : null
                  }
                  onChange={(opt) =>
                    setValue(`relations.${index}.contact2Id`, {
                      value: (opt as StrOption | null)?.value ?? '',
                      label: (opt as StrOption | null)?.label ?? '',
                    })
                  }
                  menuPlacement="top"
                />
              </Box>

              {/* Relationship type */}
              <Box flex={1}>
                <AppSelect
                  label="Relationship Type"
                  placeholder="Select relationship"
                  options={relationshipOptions}
                  value={
                    row?.relationshipId?.value
                      ? { label: row.relationshipId.label ?? '', value: row.relationshipId.value }
                      : undefined
                  }
                  onChange={(opt) =>
                    setValue(`relations.${index}.relationshipId`, {
                      value: opt?.value ?? '',
                      label: opt?.label ?? '',
                    })
                  }
                  menuPlacement="top"
                />
              </Box>

              {/* Remove row */}
              <Box
                as="button"
                type="button"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="4rem"
                h="4.4rem"
                borderRadius="8px"
                border="1px solid var(--status-danger)"
                bg="transparent"
                color="var(--status-danger)"
                cursor="pointer"
                flexShrink={0}
                mb="0.1rem"
                transition="background 0.15s"
                _hover={{ bg: 'var(--status-danger)', color: 'white' }}
                onClick={() => remove(index)}
                aria-label="Remove relation"
              >
                <Trash2 size={16} />
              </Box>
            </Flex>
          );
        })}

        {/* Add button */}
        <Flex
          as="button"
          type="button"
          align="center"
          gap="0.6rem"
          cursor="pointer"
          w="fit-content"
          color="var(--brand-primary)"
          onClick={addRow}
          _hover={{ textDecoration: 'underline' }}
          transition="opacity 0.15s"
        >
          <PlusSquare size={18} />
          <Text
            fontSize="1.4rem"
            fontWeight="600"
            fontFamily="Montserrat, sans-serif"
            color="var(--brand-primary)"
          >
            {fields.length > 0 ? 'Add Another Relation' : 'Add Relation'}
          </Text>
        </Flex>
      </Flex>
    </AppAccordionSection>
  );
}
