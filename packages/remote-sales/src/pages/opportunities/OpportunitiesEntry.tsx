import React, { useState, useMemo, useCallback, memo } from 'react';
import { Stack, Flex, Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Filter, Upload, Plus } from 'lucide-react';
import AppButton from 'sharedUi/AppButton';
import StageSummaryCards, { type StageSummaryItem } from 'sharedUi/StageSummaryCards';
import OpportunityCard from 'sharedUi/OpportunityCard';
import KanbanColumn from 'sharedUi/KanbanColumn';

import { opportunityStages } from './mock/opportunities';
import {
  OPPORTUNITY_STAGES,
  OPPORTUNITY_STAGE_SUMMARY_COLORS,
  getOpportunityCardColors,
} from './constants';
import { SalesIcons } from './icons';
import type { Opportunity, OpportunityStage } from './types';

const STAGE_HEADER_ICONS: Record<string, React.ReactNode> = {
  Proposal: <SalesIcons.proposal />,
  Quotation: <SalesIcons.quotation />,
  'Contract signing': <SalesIcons.contract />,
  'Payment collection': <SalesIcons.payment />,
  Lost: <SalesIcons.lost />,
};

const STAGE_CARD_ICONS: Record<string, React.ReactNode> = {
  Proposal: <SalesIcons.proposalCard />,
  Quotation: <SalesIcons.quotationCard />,
  'Contract signing': <SalesIcons.wonCard />,
  'Payment collection': <SalesIcons.payment />,
  Lost: <SalesIcons.lostCard />,
};

const SearchBox = memo(function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Box
      as="input"
      type="text"
      placeholder="Search here..."
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      w={{ base: '100%', md: '32rem' }}
      h="4rem"
      px="1.2rem"
      border="1px solid var(--surface-border)"
      borderRadius="8px"
      fontSize="1.4rem"
      fontFamily="Montserrat, sans-serif"
      bg="var(--surface-card)"
      color="var(--text-primary)"
      outline="none"
      css={{ '&:focus': { borderColor: 'var(--brand-primary)' } }}
      _placeholder={{ color: 'var(--text-placeholder)' }}
    />
  );
});

function OpportunitiesEntryBase() {
  const [stages, setStages] = useState<OpportunityStage[]>(opportunityStages);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleMove = useCallback((opportunityId: string, newStageName: string) => {
    setStages((prev) => {
      const next = prev.map((s) => ({ ...s, opportunities: [...s.opportunities] }));
      let moved: Opportunity | null = null;

      for (const stage of next) {
        const idx = stage.opportunities.findIndex((o) => o.id === opportunityId);
        if (idx !== -1) {
          moved = { ...stage.opportunities[idx], stage: newStageName as Opportunity['stage'] };
          stage.opportunities.splice(idx, 1);
          stage.count = stage.opportunities.length;
          break;
        }
      }

      if (moved) {
        const target = next.find((s) => s.name === newStageName);
        if (target) {
          target.opportunities.push(moved);
          target.count = target.opportunities.length;
        }
      }

      return next;
    });
  }, []);

  const handleArchive = useCallback((opportunityId: string) => {
    setStages((prev) =>
      prev.map((s) => ({
        ...s,
        opportunities: s.opportunities.filter((o) => o.id !== opportunityId),
        count: s.opportunities.filter((o) => o.id !== opportunityId).length,
      })),
    );
  }, []);

  const handleEdit = useCallback(
    (opportunityId: string) => {
      navigate(`/sales/opportunities/edit/${opportunityId}`);
    },
    [navigate],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, targetStageId: string) => {
      e.preventDefault();
      const opportunityId = e.dataTransfer.getData('opportunityId');
      const sourceStageId = e.dataTransfer.getData('sourceStage');

      if (sourceStageId !== targetStageId) {
        const targetStage = stages.find((s) => s.id === targetStageId);
        if (targetStage) handleMove(opportunityId, targetStage.name);
      }
    },
    [stages, handleMove],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const filteredStages = useMemo(() => {
    if (!searchTerm.trim()) return stages;
    const q = searchTerm.toLowerCase();
    return stages.map((s) => ({
      ...s,
      opportunities: s.opportunities.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          o.contactPerson.toLowerCase().includes(q) ||
          o.company.toLowerCase().includes(q),
      ),
    }));
  }, [stages, searchTerm]);

  const stageSummaryItems = useMemo<StageSummaryItem[]>(
    () =>
      stages.map((s) => ({
        id: s.id,
        name: s.name,
        count: s.count,
        color: OPPORTUNITY_STAGE_SUMMARY_COLORS[s.name] ?? s.color,
        icon: STAGE_CARD_ICONS[s.name],
      })),
    [stages],
  );

  return (
    <Stack gap="2.4rem" minH="100vh">
      {}
      <StageSummaryCards stages={stageSummaryItems} />

      {}
      <Stack
        bg="var(--surface-card)"
        borderRadius=".8rem"
        border="1px solid var(--surface-border)"
        minH="80vh"
        gap={0}
      >
        {}
        <Flex
          flexDir={{ base: 'column', lg: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', lg: 'center' }}
          gap="1.2rem"
          borderBottom="1px solid var(--surface-border)"
          p="2rem 2.5rem"
        >
          {}
          <Flex gap="1.2rem" align="center" flex="1" flexDir={{ base: 'column', sm: 'row' }}>
            <SearchBox value={searchTerm} onChange={setSearchTerm} />
            <AppButton variant="outline" leftIcon={<Filter size={16} />} buttonSize="md">
              Filter
            </AppButton>
          </Flex>

          {}
          <Flex
            gap="1.2rem"
            align="center"
            flexWrap="wrap"
            justify={{ base: 'flex-end', lg: 'flex-start' }}
          >
            <AppButton variant="outline" leftIcon={<Upload size={16} />} buttonSize="md">
              Import file
            </AppButton>
            <AppButton
              variant="primary"
              leftIcon={<Plus size={16} />}
              buttonSize="md"
              onClick={() => navigate('/sales/opportunities/add-opportunity')}
            >
              Add opportunity
            </AppButton>
          </Flex>
        </Flex>

        {}
        <Box overflowX="auto" pb="1.6rem" p="2rem 2.5rem">
          <Flex gap="1.6rem" minW="fit-content">
            {filteredStages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stageIcon={STAGE_HEADER_ICONS[stage.name]}
                stageName={stage.name}
                isEmpty={stage.opportunities.length === 0}
                emptyMessage="No opportunities in this stage"
                onDrop={(e) => handleDrop(e, stage.id)}
                onDragOver={handleDragOver}
              >
                {stage.opportunities.map((opp) => {
                  const cardColors = getOpportunityCardColors(opp.stage);
                  return (
                    <Box
                      key={opp.id}
                      draggable
                      onDragStart={(e: React.DragEvent) => {
                        e.dataTransfer.setData('opportunityId', opp.id);
                        e.dataTransfer.setData('sourceStage', stage.id);
                      }}
                    >
                      <OpportunityCard
                        title={opp.title}
                        description={opp.description}
                        stageName={opp.stage}
                        stageIndicatorColor={cardColors.borderTop}
                        cardColors={cardColors}
                        infoRows={[
                          { icon: <SalesIcons.source />, label: 'Source', value: opp.source },
                          {
                            icon: <SalesIcons.calendar />,
                            label: 'Created',
                            value: opp.createdDate,
                          },
                          { icon: <SalesIcons.clock />, label: 'Created by', value: opp.createdBy },
                        ]}
                        menuItems={[
                          {
                            label: 'Edit',
                            value: 'edit',
                            onClick: () => handleEdit(opp.id),
                          },
                          {
                            label: 'View Details',
                            value: 'view',
                            onClick: () => navigate(`/sales/opportunities/${opp.id}`),
                          },

                          ...OPPORTUNITY_STAGES.filter((s) => s.value !== opp.stage).map((s) => ({
                            label: `Move to ${s.label}`,
                            value: `move-${s.value}`,
                            onClick: () => handleMove(opp.id, s.value),
                          })),
                          {
                            label: 'Archive',
                            value: 'archive',
                            danger: true,
                            onClick: () => handleArchive(opp.id),
                          },
                        ]}
                      />
                    </Box>
                  );
                })}
              </KanbanColumn>
            ))}
          </Flex>

          {}
          {filteredStages.every((s) => s.opportunities.length === 0) && searchTerm && (
            <Flex direction="column" align="center" justify="center" py="6.4rem">
              <Text
                fontSize="1.6rem"
                fontWeight="600"
                color="var(--text-primary)"
                fontFamily="Montserrat, sans-serif"
                mb="0.8rem"
              >
                No results found
              </Text>
              <Text fontSize="1.4rem" color="var(--text-muted)" fontFamily="Montserrat, sans-serif">
                Try adjusting your search term
              </Text>
            </Flex>
          )}
        </Box>
      </Stack>
    </Stack>
  );
}

export const OpportunitiesEntry = memo(OpportunitiesEntryBase);
export default OpportunitiesEntry;
