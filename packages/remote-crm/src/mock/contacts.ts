export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  prefix?: string;
  gender?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  contactStatus: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
  membership?: {
    regNumber: string;
    regDate: string;
  };
}

export const mockContacts: Contact[] = [
  { id: 'c-001', firstName: 'Adeola', lastName: 'Okonkwo', prefix: 'Mrs.', gender: 'Female', email: 'adeola.okonkwo@gmail.com', phone: '+2348012345678', dateOfBirth: '1988-03-15', contactStatus: 'Active', createdAt: '2024-01-10T09:00:00Z', membership: { regNumber: 'REG-001234', regDate: '2024-01-10' } },
  { id: 'c-002', firstName: 'Emeka', lastName: 'Nwosu', prefix: 'Mr.', gender: 'Male', email: 'emeka.nwosu@yahoo.com', phone: '+2348023456789', dateOfBirth: '1975-07-22', contactStatus: 'Active', createdAt: '2024-01-12T10:30:00Z', membership: { regNumber: 'REG-001235', regDate: '2024-01-12' } },
  { id: 'c-003', firstName: 'Fatima', lastName: 'Abdullahi', prefix: 'Ms.', gender: 'Female', email: 'fatima.a@gmail.com', phone: '+2348034567890', dateOfBirth: '1992-11-05', contactStatus: 'Inactive', createdAt: '2024-01-14T11:00:00Z', membership: { regNumber: 'REG-001236', regDate: '2024-01-14' } },
  { id: 'c-004', firstName: 'Chukwuemeka', lastName: 'Obi', prefix: 'Dr.', gender: 'Male', email: 'c.obi@hospital.ng', phone: '+2348045678901', dateOfBirth: '1968-01-30', contactStatus: 'Active', createdAt: '2024-01-15T14:00:00Z', membership: { regNumber: 'REG-001237', regDate: '2024-01-15' } },
  { id: 'c-005', firstName: 'Ngozi', lastName: 'Eze', prefix: 'Mrs.', gender: 'Female', email: 'ngozi.eze@outlook.com', phone: '+2348056789012', dateOfBirth: '1983-06-18', contactStatus: 'Active', createdAt: '2024-01-16T09:30:00Z', membership: { regNumber: 'REG-001238', regDate: '2024-01-16' } },
  { id: 'c-006', firstName: 'Babatunde', lastName: 'Adeyemi', prefix: 'Mr.', gender: 'Male', email: 'b.adeyemi@gmail.com', phone: '+2348067890123', dateOfBirth: '1980-09-12', contactStatus: 'Suspended', createdAt: '2024-01-17T10:00:00Z', membership: { regNumber: 'REG-001239', regDate: '2024-01-17' } },
  { id: 'c-007', firstName: 'Amina', lastName: 'Suleiman', prefix: 'Ms.', gender: 'Female', email: 'amina.s@hotmail.com', phone: '+2348078901234', dateOfBirth: '1995-04-25', contactStatus: 'Active', createdAt: '2024-01-18T11:30:00Z', membership: { regNumber: 'REG-001240', regDate: '2024-01-18' } },
  { id: 'c-008', firstName: 'Ifeanyi', lastName: 'Chukwu', prefix: 'Mr.', gender: 'Male', email: 'ifeanyi.c@gmail.com', phone: '+2348089012345', dateOfBirth: '1987-12-08', contactStatus: 'Active', createdAt: '2024-01-19T13:00:00Z', membership: { regNumber: 'REG-001241', regDate: '2024-01-19' } },
  { id: 'c-009', firstName: 'Grace', lastName: 'Ogbuike', prefix: 'Mrs.', gender: 'Female', email: 'grace.o@gmail.com', phone: '+2348090123456', dateOfBirth: '1978-08-14', contactStatus: 'Inactive', createdAt: '2024-01-20T14:30:00Z', membership: { regNumber: 'REG-001242', regDate: '2024-01-20' } },
  { id: 'c-010', firstName: 'Usman', lastName: 'Musa', prefix: 'Mr.', gender: 'Male', email: 'usman.musa@gmail.com', phone: '+2348001234567', dateOfBirth: '1970-02-20', contactStatus: 'Active', createdAt: '2024-01-21T09:00:00Z', membership: { regNumber: 'REG-001243', regDate: '2024-01-21' } },
  { id: 'c-011', firstName: 'Chioma', lastName: 'Nwofor', prefix: 'Ms.', gender: 'Female', email: 'chioma.n@yahoo.com', phone: '+2348012349876', dateOfBirth: '1993-10-31', contactStatus: 'Active', createdAt: '2024-01-22T10:00:00Z', membership: { regNumber: 'REG-001244', regDate: '2024-01-22' } },
  { id: 'c-012', firstName: 'Abubakar', lastName: 'Tukur', prefix: 'Mr.', gender: 'Male', email: 'a.tukur@gmail.com', phone: '+2348023459876', dateOfBirth: '1985-05-17', contactStatus: 'Active', createdAt: '2024-01-23T11:00:00Z', membership: { regNumber: 'REG-001245', regDate: '2024-01-23' } },
];

export function filterContacts(search: string): Contact[] {
  const q = search.toLowerCase();
  if (!q) return mockContacts;
  return mockContacts.filter(
    (c) =>
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      (c.email?.toLowerCase().includes(q)) ||
      (c.membership?.regNumber.toLowerCase().includes(q)),
  );
}
