import React, { memo } from 'react';
import { Box, Grid, Flex, Text } from '@chakra-ui/react';

export interface DetailItem {
  label: string;
  value: string | React.ReactNode;
}

export interface DetailSection {
  title?: string;
  items: DetailItem[];
}

export interface DetailGridProps {
  sections: DetailSection[];
  columns?: { base?: number; md?: number; lg?: number };
  gap?: { base?: number; md?: number; lg?: number };
  containerWidth?: { base?: string; md?: string; lg?: string };
  showSectionTitles?: boolean;
}

export const DetailRow = memo(function DetailRow({ label, value }: DetailItem) {
  return (
    <Flex
      borderBottom="1px solid var(--surface-border)"
      pb="1.6rem"
      mb="1.6rem"
      justify="space-between"
      align="flex-start"
      gap="1.2rem"
    >
      <Text
        fontFamily="Montserrat, sans-serif"
        fontWeight="400"
        fontSize="1.4rem"
        lineHeight="2rem"
        color="var(--text-muted)"
        minWidth="12rem"
        flexShrink={0}
      >
        {label}
      </Text>
      <Text
        fontFamily="Montserrat, sans-serif"
        fontWeight="400"
        fontSize="1.4rem"
        lineHeight="2rem"
        color="var(--text-primary)"
        textAlign="right"
      >
        {value ?? 'N/A'}
      </Text>
    </Flex>
  );
});

function DetailGridBase({
  sections,
  columns = { base: 1, md: 2, lg: 3 },
  gap = { base: 4, md: 8, lg: 12 },
  containerWidth = { base: '100%', md: '85%' },
  showSectionTitles = false,
}: DetailGridProps) {
  const templateColumns = {
    base: `repeat(${columns.base ?? 1}, 1fr)`,
    md: `repeat(${columns.md ?? 2}, 1fr)`,
    lg: `repeat(${columns.lg ?? 3}, 1fr)`,
  };

  return (
    <Box w={containerWidth}>
      <Grid templateColumns={templateColumns} gap={gap}>
        {sections.map((section, si) => (
          <Box key={si}>
            {showSectionTitles && section.title && (
              <Text
                fontWeight="600"
                fontSize="1.6rem"
                color="var(--text-primary)"
                mb="1.6rem"
                fontFamily="Montserrat, sans-serif"
              >
                {section.title}
              </Text>
            )}
            {section.items.map((item, ii) => (
              <DetailRow key={ii} label={item.label} value={item.value} />
            ))}
          </Box>
        ))}
      </Grid>
    </Box>
  );
}

export const DetailGrid = memo(DetailGridBase);
export default DetailGrid;
