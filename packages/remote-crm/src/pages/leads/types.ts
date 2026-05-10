export type LeadStatus = 'Active' | 'Qualified' | 'Disqualified';
export type LeadSource = 'Email' | 'Website' | 'Social Media';
export type LeadNeedMaturity = 'Sales-ready' | 'Suspected' | 'Not ready';
export type LeadStage = 'Distribution' | 'Qualification';

export interface Lead {
  id: string;
  title: string;
  needType: string[];
  source: LeadSource;
  needMaturity: LeadNeedMaturity;
  leadStage: LeadStage;
  contact: string;
  entity: string;
  status: LeadStatus;
  disqualificationReason?: string;
  createdDate: string;
  createdBy: string;
}

export interface NewLeadPayload {
  title: string;
  needType: string[];
  source: string;
  needMaturity: string;
  leadStage: string;
  contact: string;
  entity: string;
}
