export interface Activity {
  id: string;
  type: 'Call' | 'Email' | 'Whatsapp' | 'Meeting' | 'Note';
  subject: string;
  description: string;
  dueBy: string;
  priority: 'Urgent' | 'Normal' | 'Low' | 'Important';
  dateCreated: string;
  status: 'Completed' | 'Pending' | 'In-progress' | 'Past due';
  dateUpdated: string;
}

export interface Claim {
  id: string;
  claimNo: string;
  statementNo: string;
  payer: string;
  groupName: string;
  planName: string;
  serviceDate: string;
  type: 'IP' | 'OP';
  claimAmount: number;
  approvedAmount: number;
  status: 'Approved' | 'Closed' | 'Denied';
  providerName: string;
}

export interface Authorization {
  id: string;
  authNumber: string;
  providerName: string;
  type: 'IP' | 'OP';
  requestAmount: number;
  approvedAmount: number;
  authCreatedDate: string;
  submittedBy: string;
  processedBy: string;
  status: 'Completed' | 'Pending' | 'In-progress' | 'Past due';
  lastUpdated: string;
}

export interface Invoice {
  id: string;
  invoiceId: string;
  service: string;
  issuedFor: string;
  amountPaid: number;
  issuedPaid: string;
  datePaid: string;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Pending';
}

export interface Document {
  id: string;
  documentName: string;
  documentType: 'PDF' | 'DOC' | 'DOCX' | 'JPG' | 'PNG' | 'TXT';
  fileSize: string;
  uploadedBy: string;
  uploadedDate: string;
  status: 'Active' | 'Archived' | 'Deleted';
  category: 'Medical' | 'Legal' | 'Financial' | 'Other';
}

export interface Relation {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  relationship: 'Sister' | 'Mother' | 'Father' | 'Brother' | 'Spouse' | 'Child' | 'Friend';
  initials: string;
}

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'Call',
    subject: 'Follow-up call',
    description: 'Called to confirm appointment',
    dueBy: '06/Jul/2024',
    priority: 'Urgent',
    dateCreated: '06/Jul/2024',
    status: 'Completed',
    dateUpdated: '06/Jul/2024',
  },
  {
    id: '2',
    type: 'Email',
    subject: 'Lab results',
    description: 'Sent lab results to patient',
    dueBy: '06/Jul/2024',
    priority: 'Normal',
    dateCreated: '06/Jul/2024',
    status: 'Pending',
    dateUpdated: '06/Jul/2024',
  },
  {
    id: '3',
    type: 'Whatsapp',
    subject: 'Appointment reminder',
    description: 'Reminder sent via WhatsApp',
    dueBy: '06/Jul/2024',
    priority: 'Normal',
    dateCreated: '06/Jul/2024',
    status: 'In-progress',
    dateUpdated: '06/Jul/2024',
  },
  {
    id: '4',
    type: 'Call',
    subject: 'Prescription renewal',
    description: 'Discussed prescription renewal',
    dueBy: '06/Jul/2024',
    priority: 'Normal',
    dateCreated: '06/Jul/2024',
    status: 'Past due',
    dateUpdated: '06/Jul/2024',
  },
  {
    id: '5',
    type: 'Email',
    subject: 'Insurance claim',
    description: 'Submitted insurance claim documents',
    dueBy: '06/Jul/2024',
    priority: 'Urgent',
    dateCreated: '06/Jul/2024',
    status: 'In-progress',
    dateUpdated: '06/Jul/2024',
  },
  {
    id: '6',
    type: 'Call',
    subject: 'General enquiry',
    description: 'Patient enquired about services',
    dueBy: '06/Jul/2024',
    priority: 'Urgent',
    dateCreated: '06/Jul/2024',
    status: 'Completed',
    dateUpdated: '06/Jul/2024',
  },
  {
    id: '7',
    type: 'Whatsapp',
    subject: 'Pre-auth request',
    description: 'Pre-authorization request submitted',
    dueBy: '06/Jul/2024',
    priority: 'Important',
    dateCreated: '06/Jul/2024',
    status: 'In-progress',
    dateUpdated: '06/Jul/2024',
  },
  {
    id: '8',
    type: 'Email',
    subject: 'Discharge summary',
    description: 'Discharge summary sent to insurer',
    dueBy: '06/Jul/2024',
    priority: 'Urgent',
    dateCreated: '06/Jul/2024',
    status: 'In-progress',
    dateUpdated: '06/Jul/2024',
  },
  {
    id: '9',
    type: 'Whatsapp',
    subject: 'Payment confirmation',
    description: 'Confirmed receipt of payment',
    dueBy: '06/Jul/2024',
    priority: 'Urgent',
    dateCreated: '06/Jul/2024',
    status: 'Completed',
    dateUpdated: '06/Jul/2024',
  },
];

export const mockClaims: Claim[] = [
  {
    id: '1',
    claimNo: '98765765',
    statementNo: '98765765',
    payer: 'Bastion',
    groupName: 'Health Policy',
    planName: 'Beryl',
    serviceDate: '06/Jul/2024',
    type: 'IP',
    claimAmount: 230980,
    approvedAmount: 230980,
    status: 'Approved',
    providerName: 'R-Jolad',
  },
  {
    id: '2',
    claimNo: '98765766',
    statementNo: '98765766',
    payer: 'Bastion',
    groupName: 'Health Policy',
    planName: 'Beryl',
    serviceDate: '06/Jul/2024',
    type: 'OP',
    claimAmount: 230980,
    approvedAmount: 230980,
    status: 'Closed',
    providerName: 'R-Jolad',
  },
  {
    id: '3',
    claimNo: '98765767',
    statementNo: '98765767',
    payer: 'Bastion',
    groupName: 'Health Policy',
    planName: 'Beryl',
    serviceDate: '06/Jul/2024',
    type: 'IP',
    claimAmount: 230980,
    approvedAmount: 230980,
    status: 'Approved',
    providerName: 'R-Jolad',
  },
  {
    id: '4',
    claimNo: '98765768',
    statementNo: '98765768',
    payer: 'Bastion',
    groupName: 'Health Policy',
    planName: 'Beryl',
    serviceDate: '06/Jul/2024',
    type: 'OP',
    claimAmount: 230980,
    approvedAmount: 230980,
    status: 'Denied',
    providerName: 'R-Jolad',
  },
  {
    id: '5',
    claimNo: '98765769',
    statementNo: '98765769',
    payer: 'Bastion',
    groupName: 'Health Policy',
    planName: 'Beryl',
    serviceDate: '06/Jul/2024',
    type: 'IP',
    claimAmount: 230980,
    approvedAmount: 230980,
    status: 'Denied',
    providerName: 'R-Jolad',
  },
  {
    id: '6',
    claimNo: '98765770',
    statementNo: '98765770',
    payer: 'Bastion',
    groupName: 'Health Policy',
    planName: 'Beryl',
    serviceDate: '06/Jul/2024',
    type: 'OP',
    claimAmount: 42980,
    approvedAmount: 42980,
    status: 'Approved',
    providerName: 'R-Jolad',
  },
  {
    id: '7',
    claimNo: '98765771',
    statementNo: '98765771',
    payer: 'Bastion',
    groupName: 'Health Policy',
    planName: 'Beryl',
    serviceDate: '06/Jul/2024',
    type: 'IP',
    claimAmount: 10980,
    approvedAmount: 10980,
    status: 'Closed',
    providerName: 'R-Jolad',
  },
  {
    id: '8',
    claimNo: '98765772',
    statementNo: '98765772',
    payer: 'Bastion',
    groupName: 'Health Policy',
    planName: 'Beryl',
    serviceDate: '06/Jul/2024',
    type: 'IP',
    claimAmount: 42980,
    approvedAmount: 42980,
    status: 'Approved',
    providerName: 'R-Jolad',
  },
  {
    id: '9',
    claimNo: '98765773',
    statementNo: '98765773',
    payer: 'Bastion',
    groupName: 'Health Policy',
    planName: 'Beryl',
    serviceDate: '06/Jul/2024',
    type: 'OP',
    claimAmount: 30980,
    approvedAmount: 30980,
    status: 'Approved',
    providerName: 'R-Jolad',
  },
];

export const mockAuthorizations: Authorization[] = [
  {
    id: '1',
    authNumber: '98765765',
    providerName: 'R-Jolad',
    type: 'IP',
    requestAmount: 230980,
    approvedAmount: 230980,
    authCreatedDate: '06/Jul/2024',
    submittedBy: 'John Jackson',
    processedBy: 'John Jackson',
    status: 'Completed',
    lastUpdated: '06/Jul/2024',
  },
  {
    id: '2',
    authNumber: '98765766',
    providerName: 'R-Jolad',
    type: 'OP',
    requestAmount: 20980,
    approvedAmount: 230980,
    authCreatedDate: '06/Jul/2024',
    submittedBy: 'John Jackson',
    processedBy: 'John Jackson',
    status: 'Pending',
    lastUpdated: '06/Jul/2024',
  },
  {
    id: '3',
    authNumber: '98765767',
    providerName: 'R-Jolad',
    type: 'IP',
    requestAmount: 90980,
    approvedAmount: 230980,
    authCreatedDate: '06/Jul/2024',
    submittedBy: 'John Jackson',
    processedBy: 'John Jackson',
    status: 'In-progress',
    lastUpdated: '06/Jul/2024',
  },
  {
    id: '4',
    authNumber: '98765768',
    providerName: 'R-Jolad',
    type: 'OP',
    requestAmount: 65980,
    approvedAmount: 230980,
    authCreatedDate: '06/Jul/2024',
    submittedBy: 'John Jackson',
    processedBy: 'John Jackson',
    status: 'Past due',
    lastUpdated: '06/Jul/2024',
  },
  {
    id: '5',
    authNumber: '98765769',
    providerName: 'R-Jolad',
    type: 'IP',
    requestAmount: 230980,
    approvedAmount: 230980,
    authCreatedDate: '06/Jul/2024',
    submittedBy: 'John Jackson',
    processedBy: 'John Jackson',
    status: 'In-progress',
    lastUpdated: '06/Jul/2024',
  },
  {
    id: '6',
    authNumber: '98765770',
    providerName: 'R-Jolad',
    type: 'OP',
    requestAmount: 230980,
    approvedAmount: 42980,
    authCreatedDate: '06/Jul/2024',
    submittedBy: 'John Jackson',
    processedBy: 'John Jackson',
    status: 'Completed',
    lastUpdated: '06/Jul/2024',
  },
  {
    id: '7',
    authNumber: '98765771',
    providerName: 'R-Jolad',
    type: 'IP',
    requestAmount: 230980,
    approvedAmount: 10980,
    authCreatedDate: '06/Jul/2024',
    submittedBy: 'John Jackson',
    processedBy: 'John Jackson',
    status: 'In-progress',
    lastUpdated: '06/Jul/2024',
  },
  {
    id: '8',
    authNumber: '98765772',
    providerName: 'R-Jolad',
    type: 'IP',
    requestAmount: 230980,
    approvedAmount: 42980,
    authCreatedDate: '06/Jul/2024',
    submittedBy: 'John Jackson',
    processedBy: 'John Jackson',
    status: 'In-progress',
    lastUpdated: '06/Jul/2024',
  },
  {
    id: '9',
    authNumber: '98765773',
    providerName: 'R-Jolad',
    type: 'OP',
    requestAmount: 230980,
    approvedAmount: 30980,
    authCreatedDate: '06/Jul/2024',
    submittedBy: 'John Jackson',
    processedBy: 'John Jackson',
    status: 'Completed',
    lastUpdated: '06/Jul/2024',
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceId: '#INV109',
    service: 'Title of the service paid for',
    issuedFor: 'LUKE BROKERS',
    amountPaid: 230980,
    issuedPaid: '06/Jul/2024',
    datePaid: '06/Jul/2024',
    status: 'Paid',
  },
  {
    id: '2',
    invoiceId: '#INV102',
    service: 'Title of the service paid for',
    issuedFor: 'Adetunji Bastion',
    amountPaid: 230980,
    issuedPaid: '06/Jul/2024',
    datePaid: '06/Jul/2024',
    status: 'Paid',
  },
  {
    id: '3',
    invoiceId: '#INV009',
    service: 'Title of the service paid for',
    issuedFor: 'Steam Child',
    amountPaid: 230980,
    issuedPaid: '06/Jul/2024',
    datePaid: '06/Jul/2024',
    status: 'Paid',
  },
  {
    id: '4',
    invoiceId: '#INV010',
    service: 'Title of the service paid for',
    issuedFor: 'Greenwich',
    amountPaid: 230980,
    issuedPaid: '06/Jul/2024',
    datePaid: '06/Jul/2024',
    status: 'Unpaid',
  },
  {
    id: '5',
    invoiceId: '#INV011',
    service: 'Title of the service paid for',
    issuedFor: 'Greenwich Group',
    amountPaid: 230980,
    issuedPaid: '06/Jul/2024',
    datePaid: '06/Jul/2024',
    status: 'Overdue',
  },
  {
    id: '6',
    invoiceId: '#INV012',
    service: 'Title of the service paid for',
    issuedFor: 'Octobrokers',
    amountPaid: 230980,
    issuedPaid: '06/Jul/2024',
    datePaid: '06/Jul/2024',
    status: 'Paid',
  },
  {
    id: '7',
    invoiceId: '#INV013',
    service: 'Title of the service paid for',
    issuedFor: 'Suliat Giwa',
    amountPaid: 230980,
    issuedPaid: '06/Jul/2024',
    datePaid: '06/Jul/2024',
    status: 'Pending',
  },
  {
    id: '8',
    invoiceId: '#INV014',
    service: 'Title of the service paid for',
    issuedFor: 'SCIB',
    amountPaid: 230980,
    issuedPaid: '06/Jul/2024',
    datePaid: '06/Jul/2024',
    status: 'Paid',
  },
  {
    id: '9',
    invoiceId: '#INV015',
    service: 'Title of the service paid for',
    issuedFor: 'Wills Towers',
    amountPaid: 230980,
    issuedPaid: '06/Jul/2024',
    datePaid: '06/Jul/2024',
    status: 'Paid',
  },
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    documentName: 'Name of document.pdf',
    documentType: 'PDF',
    fileSize: '6 pages • 90.2kb',
    uploadedBy: 'John Doe',
    uploadedDate: '06/Jul/2024',
    status: 'Active',
    category: 'Medical',
  },
  {
    id: '2',
    documentName: 'Medical Report.pdf',
    documentType: 'PDF',
    fileSize: '12 pages • 156.8kb',
    uploadedBy: 'Jane Smith',
    uploadedDate: '05/Jul/2024',
    status: 'Active',
    category: 'Medical',
  },
  {
    id: '3',
    documentName: 'Insurance Policy.pdf',
    documentType: 'PDF',
    fileSize: '8 pages • 120.5kb',
    uploadedBy: 'Mike Johnson',
    uploadedDate: '04/Jul/2024',
    status: 'Active',
    category: 'Legal',
  },
  {
    id: '4',
    documentName: 'Lab Results.pdf',
    documentType: 'PDF',
    fileSize: '3 pages • 45.2kb',
    uploadedBy: 'Dr. Williams',
    uploadedDate: '03/Jul/2024',
    status: 'Active',
    category: 'Medical',
  },
  {
    id: '5',
    documentName: 'Financial Statement.pdf',
    documentType: 'PDF',
    fileSize: '15 pages • 200.1kb',
    uploadedBy: 'Sarah Lee',
    uploadedDate: '02/Jul/2024',
    status: 'Active',
    category: 'Financial',
  },
  {
    id: '6',
    documentName: 'Prescription.pdf',
    documentType: 'PDF',
    fileSize: '2 pages • 25.8kb',
    uploadedBy: 'Dr. Brown',
    uploadedDate: '01/Jul/2024',
    status: 'Active',
    category: 'Medical',
  },
  {
    id: '7',
    documentName: 'Consent Form.pdf',
    documentType: 'PDF',
    fileSize: '4 pages • 60.3kb',
    uploadedBy: 'Admin User',
    uploadedDate: '30/Jun/2024',
    status: 'Active',
    category: 'Legal',
  },
  {
    id: '8',
    documentName: 'Treatment Plan.pdf',
    documentType: 'PDF',
    fileSize: '10 pages • 140.7kb',
    uploadedBy: 'Dr. Davis',
    uploadedDate: '29/Jun/2024',
    status: 'Active',
    category: 'Medical',
  },
  {
    id: '9',
    documentName: 'Discharge Summary.pdf',
    documentType: 'PDF',
    fileSize: '6 pages • 85.9kb',
    uploadedBy: 'Nurse Wilson',
    uploadedDate: '28/Jun/2024',
    status: 'Archived',
    category: 'Medical',
  },
];

export const mockRelations: Relation[] = [
  {
    id: '1',
    name: 'MOYO BENSON',
    gender: 'Female',
    age: 24,
    relationship: 'Sister',
    initials: 'MB',
  },
  {
    id: '2',
    name: 'DAMILOLA BENSON',
    gender: 'Female',
    age: 51,
    relationship: 'Mother',
    initials: 'DB',
  },
];
