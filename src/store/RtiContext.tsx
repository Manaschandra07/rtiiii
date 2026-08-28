import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RtiApplication, RtiStatus, PublicAuthority } from '../types';

interface RtiContextType {
  applications: RtiApplication[];
  addApplication: (app: RtiApplication) => void;
  updateApplicationStatus: (id: string, status: RtiStatus) => void;
  getApplicationById: (id: string) => RtiApplication | undefined;
}

const mockAuthorities: PublicAuthority[] = [
  { id: '1', name: 'Department of Higher Education', ministry: 'Ministry of Education', department: 'Department of Higher Education', category: 'Education' },
  { id: '2', name: 'Passport Seva', ministry: 'Ministry of External Affairs', department: 'CPV Division', category: 'Passports' },
  { id: '3', name: 'Railway Board', ministry: 'Ministry of Railways', department: 'Railway Board', category: 'Transport' },
];

const mockInitialData: RtiApplication[] = [
  {
    id: 'HIGHE/R/E/26/04821',
    dateSubmitted: '2026-08-12T10:30:00Z',
    authority: mockAuthorities[0],
    question: 'I would like to know how much money was allocated for scholarships under the Post Matric Scholarship Scheme in Rajasthan for the financial year 2024-25. Also provide the details of beneficiaries.',
    subject: 'Scholarship allocation details',
    applicant: { fullName: 'Aarav Sharma', email: 'aarav.sharma@example.com', mobile: '+91 9876543210', address: '12, Gandhi Road, Jaipur', state: 'Rajasthan', pinCode: '302001', isBpl: false },
    status: 'Under Process',
    feePaid: 10,
    documents: ['scholarship_details.pdf'],
    responses: [],
    timeline: [
      { status: 'Submitted', date: '2026-08-12T10:30:00Z', description: 'Application submitted successfully.' },
      { status: 'Received', date: '2026-08-13T11:20:00Z', description: 'Received by Nodal Officer.' },
      { status: 'Under Process', date: '2026-08-14T14:15:00Z', description: 'Forwarded to CPIO.' }
    ]
  },
  {
    id: 'PASSP/R/E/26/03817',
    dateSubmitted: '2026-08-02T09:15:00Z',
    authority: mockAuthorities[1],
    subject: 'Passport processing details',
    question: 'Please provide the average processing time for passport applications in the Delhi regional passport office for the month of July 2026.',
    applicant: { fullName: 'Aarav Sharma', email: 'aarav.sharma@example.com', mobile: '+91 9876543210', address: '12, Gandhi Road, Jaipur', state: 'Rajasthan', pinCode: '302001', isBpl: false },
    status: 'Response Received',
    feePaid: 10,
    documents: [],
    responses: [
      { id: 'resp1', date: '2026-08-10T16:00:00Z', text: 'The public authority has provided the information requested.', documents: ['Passport_Processing_Details.pdf'] }
    ],
    timeline: [
      { status: 'Submitted', date: '2026-08-02T09:15:00Z', description: 'Application submitted.' },
      { status: 'Response Received', date: '2026-08-10T16:00:00Z', description: 'Response provided by CPIO.' }
    ]
  }
];

const RtiContext = createContext<RtiContextType | undefined>(undefined);

import { useAuth } from './AuthContext';

export const RtiProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<RtiApplication[]>(() => {
    if (currentUser) {
      const userScopedDataStr = typeof window !== 'undefined' ? localStorage.getItem(`userData_${currentUser.id}`) : null;
      if (userScopedDataStr) {
        try {
          const parsed = JSON.parse(userScopedDataStr);
          return parsed.applications || [];
        } catch (e) {}
      }
    }
    return [];
  });

  // 2. completely replace the active in-memory state on login/logout
  React.useEffect(() => {
    if (currentUser) {
      const userScopedDataStr = localStorage.getItem(`userData_${currentUser.id}`);
      let initialData: RtiApplication[] = [];

      if (userScopedDataStr) {
        try {
          const parsed = JSON.parse(userScopedDataStr);
          initialData = parsed.applications || [];
        } catch (e) {
          initialData = [];
        }
      } else {
        initialData = [];
      }
      setApplications(initialData);
    } else {
      // 3. Clear all active in-memory state on logout
      setApplications([]);
    }
  }, [currentUser]);

  const saveApplications = (newApps: RtiApplication[]) => {
    setApplications(newApps);
    if (currentUser) {
      const existingDataStr = localStorage.getItem(`userData_${currentUser.id}`);
      let existingData = {};
      if (existingDataStr) {
        try { existingData = JSON.parse(existingDataStr); } catch (e) {}
      }
      localStorage.setItem(`userData_${currentUser.id}`, JSON.stringify({ ...existingData, applications: newApps }));
    }
  };

  const addApplication = (app: RtiApplication) => {
    const newApps = [app, ...applications];
    saveApplications(newApps);
  };

  const updateApplicationStatus = (id: string, status: RtiStatus) => {
    const newApps = applications.map(app => 
      app.id === id ? { 
        ...app, 
        status, 
        timeline: [...app.timeline, { status, date: new Date().toISOString(), description: `Status updated to ${status}` }] 
      } : app
    );
    saveApplications(newApps);
  };

  const getApplicationById = (id: string) => applications.find(app => app.id === id);

  return (
    <RtiContext.Provider value={{ applications, addApplication, updateApplicationStatus, getApplicationById }}>
      {children}
    </RtiContext.Provider>
  );
};

export const useRtiContext = () => {
  const context = useContext(RtiContext);
  if (context === undefined) {
    throw new Error('useRtiContext must be used within a RtiProvider');
  }
  return context;
};
