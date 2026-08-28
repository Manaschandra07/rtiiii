import { User } from '../store/AuthContext';
import { RtiApplication } from '../types';

export const DEMO_USERNAME = 'tony-stark';

export const setupDemoUser = () => {
  const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Remove existing demo user if any
  const filteredUsers = users.filter(u => u.username !== DEMO_USERNAME);
  
  const demoUser: User = {
    id: 'demo-tony-stark-id',
    name: 'Tony Stark',
    gender: 'Male',
    educationalStatus: 'Literate',
    username: 'tony-stark',
    password: 'tony-stark',
    number: '0000000000',
    mail: 'tony-stark@gmail.com',
    addressLine1: 'Penthouse Suite, Stark Tower',
    addressLine2: '200 Park Avenue, Midtown',
    addressLine3: 'Near Grand Central Terminal',
    pinCode: '000000',
    country: 'India',
    state: 'Andhra Pradesh',
    status: 'Urban'
  };
  
  filteredUsers.push(demoUser);
  localStorage.setItem('users', JSON.stringify(filteredUsers));

  // Generate RTIs
  const today = new Date();
  
  const d_minus = (days: number) => {
    const d = new Date();
    d.setDate(today.getDate() - days);
    return d.toISOString();
  };
  
  const mockAuthorities = [
    { id: '1', name: 'Department of Higher Education', ministry: 'Ministry of Education', department: 'Department of Higher Education', category: 'Education' },
    { id: '2', name: 'Passport Seva', ministry: 'Ministry of External Affairs', department: 'CPV Division', category: 'Passports' },
    { id: '3', name: 'Railway Board', ministry: 'Ministry of Railways', department: 'Railway Board', category: 'Transport' },
    { id: '4', name: 'Department of Defence', ministry: 'Ministry of Defence', department: 'Department of Defence', category: 'Defence' },
    { id: '5', name: 'NHAI', ministry: 'Ministry of Road Transport and Highways', department: 'NHAI', category: 'Transport' }
  ];

  const applicantData = {
    fullName: demoUser.name,
    email: demoUser.mail,
    mobile: demoUser.number,
    address: 'Penthouse Suite, Stark Tower, 200 Park Avenue',
    state: demoUser.state || 'Andhra Pradesh',
    pinCode: demoUser.pinCode || '000000',
    isBpl: false,
    gender: demoUser.gender,
    country: demoUser.country,
    status: demoUser.status,
    educationalStatus: demoUser.educationalStatus
  };

  const applications: RtiApplication[] = [
    // 2 Pending RTIs: Filed on different dates in the past, with no response.
    {
      id: 'DEFEN/R/E/26/10001',
      dateSubmitted: d_minus(10),
      authority: mockAuthorities[3],
      question: 'Please provide details of the environmental clearance obtained for the new Stark Industries drone testing facility.',
      subject: 'Environmental clearance for testing facility',
      applicant: applicantData,
      status: 'Under Process',
      feePaid: 10,
      documents: [],
      responses: [],
      timeline: [
        { status: 'Submitted', date: d_minus(10), description: 'Application submitted successfully.' },
        { status: 'Received', date: d_minus(9), description: 'Received by Nodal Officer.' },
        { status: 'Under Process', date: d_minus(8), description: 'Forwarded to CPIO.' }
      ]
    },
    {
      id: 'NHAIX/R/E/26/10002',
      dateSubmitted: d_minus(5),
      authority: mockAuthorities[4],
      question: 'What is the current status of the highway expansion project near the eastern seaboard?',
      subject: 'Highway expansion project status',
      applicant: applicantData,
      status: 'Received',
      feePaid: 10,
      documents: [],
      responses: [],
      timeline: [
        { status: 'Submitted', date: d_minus(5), description: 'Application submitted successfully.' },
        { status: 'Received', date: d_minus(4), description: 'Received by Nodal Officer.' }
      ]
    },
    // 1 Closed RTI (< 30 days): Responded to recently.
    {
      id: 'HIGHE/R/E/26/10003',
      dateSubmitted: d_minus(25),
      authority: mockAuthorities[0],
      question: 'Kindly provide the number of scholarships awarded to students in the recent STEM initiative.',
      subject: 'STEM Scholarships',
      applicant: applicantData,
      status: 'Closed',
      feePaid: 10,
      documents: [],
      responses: [
        { id: 'r1', date: d_minus(15), text: 'Information has been provided.', documents: [] }
      ],
      timeline: [
        { status: 'Submitted', date: d_minus(25), description: 'Application submitted successfully.' },
        { status: 'Response Received', date: d_minus(15), description: 'Response provided by CPIO.' },
        { status: 'Closed', date: d_minus(14), description: 'Application closed.' }
      ]
    },
    // 1 Closed RTI (> 30 days): Responded to over a month ago. (Used for appeal)
    {
      id: 'PASSP/R/E/26/10004',
      dateSubmitted: d_minus(70),
      authority: mockAuthorities[1],
      question: 'I requested expedited passport processing details for high-priority business travel.',
      subject: 'Expedited Passport Processing',
      applicant: applicantData,
      status: 'Closed', // It was closed, but since an appeal is filed, maybe the appeal is tracking it. Wait, the prompt says "1 First Appeal: Filed against one of the older (> 30 days) closed RTIs." Let's keep it closed, the appeal will be a separate entry.
      feePaid: 10,
      documents: [],
      responses: [
        { id: 'r2', date: d_minus(50), text: 'Information denied due to security reasons under section 8(1)(a).', documents: [] }
      ],
      timeline: [
        { status: 'Submitted', date: d_minus(70), description: 'Application submitted successfully.' },
        { status: 'Response Received', date: d_minus(50), description: 'Response provided by CPIO.' },
        { status: 'Closed', date: d_minus(49), description: 'Application closed.' }
      ]
    },
    // Another Closed RTI (> 30 days)
    {
      id: 'HIGHE/R/E/26/10005',
      dateSubmitted: d_minus(65),
      authority: mockAuthorities[2],
      question: 'Details on the budget allocation for the new high-speed rail network.',
      subject: 'High-speed rail budget',
      applicant: applicantData,
      status: 'Closed',
      feePaid: 10,
      documents: [],
      responses: [
        { id: 'r3', date: d_minus(45), text: 'Budget details have been published on the official website.', documents: [] }
      ],
      timeline: [
        { status: 'Submitted', date: d_minus(65), description: 'Application submitted successfully.' },
        { status: 'Response Received', date: d_minus(45), description: 'Response provided by CPIO.' },
        { status: 'Closed', date: d_minus(40), description: 'Application closed.' }
      ]
    },
    // 1 First Appeal: Filed against PASSP/R/E/26/10004
    {
      id: 'PASSP/A/E/26/10004',
      dateSubmitted: d_minus(30),
      authority: mockAuthorities[1],
      question: 'I requested expedited passport processing details for high-priority business travel.',
      subject: 'First Appeal: Expedited Passport Processing',
      applicant: applicantData,
      status: 'First Appeal Filed',
      feePaid: 0,
      documents: [],
      responses: [],
      timeline: [
        { status: 'First Appeal Filed', date: d_minus(30), description: 'Appeal filed against PASSP/R/E/26/10004.' }
      ]
    }
  ];

  // Overwrite user data completely
  localStorage.setItem(`userData_${demoUser.id}`, JSON.stringify({ applications }));
  return demoUser;
};
