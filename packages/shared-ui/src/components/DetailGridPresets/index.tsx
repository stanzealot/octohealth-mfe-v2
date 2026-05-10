import React from 'react';
import { DetailGrid } from '../DetailGrid';
import type { DetailSection } from '../DetailGrid';

export const DetailGridPresets = {
  twoColumn: {
    columns: { base: 1, md: 2, lg: 2 },
    gap: { base: 4, md: 8, lg: 20 },
    containerWidth: { base: '100%', md: '100%' },
  },
  threeColumn: {
    columns: { base: 1, md: 2, lg: 3 },
    gap: { base: 4, md: 8, lg: 12 },
    containerWidth: { base: '100%', md: '85%' },
  },
  fourColumn: {
    columns: { base: 1, md: 2, lg: 4 },
    gap: { base: 4, md: 6, lg: 8 },
    containerWidth: { base: '100%', md: '90%' },
  },
  compact: {
    columns: { base: 1, md: 2, lg: 3 },
    gap: { base: 3, md: 4, lg: 6 },
    containerWidth: { base: '100%', md: '100%' },
  },
} as const;

interface PresetProps {
  sections: DetailSection[];
  showSectionTitles?: boolean;
}

export function TwoColumnDetailGrid({ sections, showSectionTitles = false }: PresetProps) {
  return (
    <DetailGrid
      sections={sections}
      {...DetailGridPresets.twoColumn}
      showSectionTitles={showSectionTitles}
    />
  );
}

export function ThreeColumnDetailGrid({ sections, showSectionTitles = false }: PresetProps) {
  return (
    <DetailGrid
      sections={sections}
      {...DetailGridPresets.threeColumn}
      showSectionTitles={showSectionTitles}
    />
  );
}

export function FourColumnDetailGrid({ sections, showSectionTitles = false }: PresetProps) {
  return (
    <DetailGrid
      sections={sections}
      {...DetailGridPresets.fourColumn}
      showSectionTitles={showSectionTitles}
    />
  );
}

export function CompactDetailGrid({ sections, showSectionTitles = false }: PresetProps) {
  return (
    <DetailGrid
      sections={sections}
      {...DetailGridPresets.compact}
      showSectionTitles={showSectionTitles}
    />
  );
}

export default DetailGridPresets;
