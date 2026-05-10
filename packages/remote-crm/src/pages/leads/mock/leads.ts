import type { Lead } from '../types';

export const mockLeads: Lead[] = [
  {
    id: '1',
    title: 'This is a lead title',
    needType: ['Claim authorization', 'Tariff mapping'],
    source: 'Email',
    needMaturity: 'Suspected',
    leadStage: 'Distribution',
    contact: 'Jade Jac',
    entity: 'Bastion',
    status: 'Active',
    createdDate: '15/Mar/2025',
    createdBy: 'Emeka Nwankwo',
  },
  {
    id: '2',
    title: 'This is a lead title',
    needType: ['Claim authorization', 'Tariff mapping'],
    source: 'Website',
    needMaturity: 'Suspected',
    leadStage: 'Distribution',
    contact: 'Jade Jac',
    entity: 'Bastion',
    status: 'Active',
    createdDate: '16/Mar/2025',
    createdBy: 'Emeka Nwankwo',
  },
  {
    id: '3',
    title: 'This is a lead title',
    needType: ['Claim authorization', 'Tariff mapping'],
    source: 'Social Media',
    needMaturity: 'Sales-ready',
    leadStage: 'Qualification',
    contact: 'Jade Jac',
    entity: 'Bastion',
    status: 'Qualified',
    createdDate: '14/Mar/2025',
    createdBy: 'Emeka Nwankwo',
  },
  {
    id: '4',
    title: 'This is a lead title',
    needType: ['Claim authorization', 'Tariff mapping'],
    source: 'Social Media',
    needMaturity: 'Suspected',
    leadStage: 'Qualification',
    contact: 'Jade Jac',
    entity: 'Bastion',
    status: 'Active',
    createdDate: '17/Mar/2025',
    createdBy: 'Shola Jackson',
  },
  {
    id: '5',
    title: 'This is a lead title',
    needType: ['Claim authorization', 'Tariff mapping'],
    source: 'Website',
    needMaturity: 'Not ready',
    leadStage: 'Distribution',
    contact: 'Jade Jac',
    entity: 'Bastion',
    status: 'Disqualified',
    disqualificationReason: 'This is a disqualification reason',
    createdDate: '18/Mar/2025',
    createdBy: 'Joseph Rey',
  },
  {
    id: '6',
    title: 'This is a lead title',
    needType: ['Claim authorization', 'Tariff mapping'],
    source: 'Email',
    needMaturity: 'Not ready',
    leadStage: 'Distribution',
    contact: 'Jade Jac',
    entity: 'Bastion',
    status: 'Disqualified',
    disqualificationReason: 'This is a disqualification reason',
    createdDate: '19/Mar/2025',
    createdBy: 'Joseph Rey',
  },
  {
    id: '7',
    title: 'This is a lead title',
    needType: ['Claim authorization', 'Tariff mapping'],
    source: 'Email',
    needMaturity: 'Sales-ready',
    leadStage: 'Qualification',
    contact: 'Jade Jac',
    entity: 'Bastion',
    status: 'Qualified',
    createdDate: '10/Mar/2025',
    createdBy: 'Shola Jackson',
  },
  {
    id: '8',
    title: 'This is a lead title',
    needType: ['Claim authorization', 'Tariff mapping'],
    source: 'Website',
    needMaturity: 'Sales-ready',
    leadStage: 'Qualification',
    contact: 'Jade Jac',
    entity: 'Bastion',
    status: 'Qualified',
    createdDate: '09/Mar/2025',
    createdBy: 'Joseph Rey',
  },
  {
    id: '9',
    title: 'This is a lead title',
    needType: ['Claim authorization', 'Tariff mapping'],
    source: 'Email',
    needMaturity: 'Not ready',
    leadStage: 'Distribution',
    contact: 'Jade Jac',
    entity: 'Bastion',
    status: 'Disqualified',
    disqualificationReason: 'This is a disqualification reason',
    createdDate: '07/Mar/2025',
    createdBy: 'Shola Jackson',
  },
];

export function getLeadById(id: string): Lead | undefined {
  return mockLeads.find((lead) => lead.id === id);
}

export function filterLeadsData(leads: Lead[], filters: { search?: string }): Lead[] {
  if (!filters.search) return leads;
  const q = filters.search.toLowerCase();
  return leads.filter(
    (lead) =>
      lead.title.toLowerCase().includes(q) ||
      lead.contact.toLowerCase().includes(q) ||
      lead.entity.toLowerCase().includes(q) ||
      lead.source.toLowerCase().includes(q) ||
      lead.createdBy.toLowerCase().includes(q),
  );
}
