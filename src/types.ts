export type RtiStatus = 'Draft' | 'Submitted' | 'Received' | 'Under Process' | 'Additional Fee Required' | 'Supporting Document Requested' | 'Response Received' | 'Transferred' | 'First Appeal Filed' | 'Closed';

export interface PublicAuthority {
  id: string;
  name: string;
  ministry: string;
  department: string;
  category: string;
}

export interface UserDetails {
  fullName: string;
  email: string;
  mobile: string;
  address: string;
  state: string;
  pinCode: string;
  isBpl: boolean;
  gender?: string;
  country?: string;
  status?: string;
  educationalStatus?: string;
}

export interface RtiApplication {
  id: string; // Registration Number e.g. RTI/2026/004821
  dateSubmitted: string;
  authority: PublicAuthority;
  question: string;
  subject: string;
  applicant: UserDetails;
  status: RtiStatus;
  feePaid: number;
  documents: string[]; // Mock file names
  documentsData?: { name: string, dataUrl: string }[];
  responses: RtiResponse[];
  timeline: RtiTimelineEvent[];
}

export interface RtiResponse {
  id: string;
  date: string;
  text: string;
  documents: string[];
}

export interface RtiTimelineEvent {
  status: RtiStatus;
  date: string;
  description: string;
}

export interface RtiDraft {
  question: string;
  authority: PublicAuthority | null;
  applicant: UserDetails | null;
  supportingDocument: { name: string, type: string, dataUrl: string, size: number } | null;
}
