export type OpportunityStageType =
  | 'Proposal'
  | 'Quotation'
  | 'Contract signing'
  | 'Payment collection'
  | 'Lost';

export type OpportunitySource = 'Website' | 'Email' | 'Phone' | 'Social Media';
export type OpportunityPriority = 'High' | 'Medium' | 'Low';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  stage: OpportunityStageType;
  value: number;
  source: OpportunitySource;
  createdDate: string;
  createdBy: string;
  assignedTo?: string;
  priority: OpportunityPriority;
  closeDate?: string;
  probability: number;
  contactPerson: string;
  company: string;
}

export interface OpportunityStage {
  id: string;
  name: string;
  count: number;
  color: string;
  opportunities: Opportunity[];
}

export interface NewOpportunityPayload {
  title: string;
  description: string;
  stage: string;
  value: number;
  source: string;
  priority: string;
  contactPerson: string;
  company: string;
  closeDate?: string;
  probability: number;
}
