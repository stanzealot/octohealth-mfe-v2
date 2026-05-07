/**
 * DetailGridPresets
 *
 * Pre-configured DetailGrid layouts for common use cases.
 * The same repeating label/value grid pattern appears throughout the
 * application (contacts, companies, policies, etc.) — these presets
 * make it trivial to pick the right layout.
 *
 * Usage:
 *   import { ThreeColumnDetailGrid } from 'sharedUi/DetailGridPresets';
 *
 *   <ThreeColumnDetailGrid
 *     sections={[
 *       { items: [{ label: 'Member ID', value: 'BG-001' }, ...] },
 *       { items: [...] },
 *       { items: [...] },
 *     ]}
 *   />
 */

import React from 'react';
import { DetailGrid } from '../DetailGrid';
import type { DetailSection } from '../DetailGrid';

/* ─── Raw preset configs ─────────────────────────────────────────────── */

export const DetailGridPresets = {
  twoColumn: {
    columns:        { base: 1, md: 2, lg: 2 },
    gap:            { base: 4, md: 8, lg: 20 },
    containerWidth: { base: '100%', md: '100%' },
  },
  threeColumn: {
    columns:        { base: 1, md: 2, lg: 3 },
    gap:            { base: 4, md: 8, lg: 12 },
    containerWidth: { base: '100%', md: '85%' },
  },
  fourColumn: {
    columns:        { base: 1, md: 2, lg: 4 },
    gap:            { base: 4, md: 6, lg: 8 },
    containerWidth: { base: '100%', md: '90%' },
  },
  compact: {
    columns:        { base: 1, md: 2, lg: 3 },
    gap:            { base: 3, md: 4, lg: 6 },
    containerWidth: { base: '100%', md: '100%' },
  },
} as const;

/* ─── Shared convenience props ───────────────────────────────────────── */

interface PresetProps {
  sections: DetailSection[];
  showSectionTitles?: boolean;
}

/* ─── Convenience components ─────────────────────────────────────────── */

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
