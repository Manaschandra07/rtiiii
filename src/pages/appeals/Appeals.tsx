import React, { useState, useEffect } from 'react';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { generateRegistrationId } from '../../utils/generateId';
import { useNavigate } from 'react-router-dom';
import { generatePdfFromElement } from '../../utils/pdfGenerator';
import { Download } from 'lucide-react';
import { useRtiContext } from '../../store/RtiContext';
import { ArrowRight, ArrowLeft, AlertCircle, AlertTriangle, CheckCircle, ChevronLeft, Upload, Check, X, CheckCircle2, Copy } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { UserDetails } from '../../types';
import { GuidelinesModal } from '../../components/GuidelinesModal';
import { RtiApplication } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = ['Verify Application', 'RTI Details', 'Appeal Request', 'Review and File an Appeal'];

export const Appeals = () => {
  const [hasAcceptedGuidelines, setHasAcceptedGuidelines] = useSessionStorage('rti_appeals_guidelines', false);
  const [step, setStep] = useSessionStorage('rti_appeals_step', 1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const [regNumber, setRegNumber] = useSessionStorage('rti_appeals_reg', '');
    const [error, _setError] = useState('');
  const setError = (msg: string) => {
    _setError(msg);
    if (msg) {
      setTimeout(() => {
        const el = document.getElementById('error-container');
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 140;
          window.scrollTo({ top: y, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }
  };
  const [targetRti, setTargetRti] = useSessionStorage<RtiApplication | null>('rti_appeals_target', null);
  const [newAppealId, setNewAppealId] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newAppealId);
    setCopiedId(newAppealId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  
  // Verification states
  const { currentUser } = useAuth();
  const [details, setDetails] = useSessionStorage<UserDetails | null>('rti_appeals_details', null);
  
  const [isMobileVerifying, setIsMobileVerifying] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useSessionStorage('rti_appeals_mob_verified', false);
  const [otpMobile, setOtpMobile] = useState('');

  const [isEmailVerifying, setIsEmailVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useSessionStorage('rti_appeals_email_verified', false);
  const [otpEmail, setOtpEmail] = useState('');

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!details) return;
    const { name, value, type } = e.target;
    setDetails(prev => prev ? {
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    } : prev);
  };
  
  // Appeal Form State
  const [groundForAppeal, setGroundForAppeal] = useSessionStorage('rti_appeals_ground', '');
  const [appealText, setAppealText] = useSessionStorage('rti_appeals_text', '');
  const [appealDoc, setAppealDoc] = useState<File | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const navigate = useNavigate();
  const { applications, updateApplicationStatus, addApplication } = useRtiContext();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber.trim()) {
      setError('Please enter a registration number.');
      return;
    }

    const regNumUpper = regNumber.trim().toUpperCase();
    const formatRegex = /^[A-Z0-9]{5}\/[RA]\/[EPTXL]\/\d{2}\/\d{5}$/;

    if (!formatRegex.test(regNumUpper)) {
      setError('Invalid format. Use AAAAA/B/C/DD/EEEEE (e.g. HIGHE/R/E/26/04821)');
      return;
    }

    const foundRti = applications.find((rti) => rti.id === regNumUpper);

    if (foundRti) {
      if (foundRti.status === 'First Appeal Filed') {
         setError('A First Appeal has already been filed for this application.');
         return;
      }
      
      const currentDate = new Date();
      let canAppeal = false;
      let appealError = '';
      
      const responseEvent = foundRti.timeline.slice().reverse().find(e => e.status === 'Response Received' || e.status === 'Closed');
      const transferEvent = foundRti.timeline.slice().reverse().find(e => e.status === 'Transferred');
      
      if (responseEvent) {
          const responseDate = new Date(responseEvent.date);
          const daysSinceResponse = Math.ceil((currentDate.getTime() - responseDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceResponse <= 30) {
              canAppeal = true;
          } else {
              appealError = `Exceeded the 30-day limit to file a First Appeal after receiving a reply. (Reply was ${daysSinceResponse} days ago)`;
          }
      } else {
          if (transferEvent) {
               const transferDate = new Date(transferEvent.date);
               const daysSinceTransfer = Math.ceil((currentDate.getTime() - transferDate.getTime()) / (1000 * 60 * 60 * 24));
               
               if (daysSinceTransfer < 30) {
                   appealError = `Must wait 30 days after the RTI was transferred to file an appeal. (Transferred ${daysSinceTransfer} days ago)`;
               } else if (daysSinceTransfer <= 60) {
                   canAppeal = true;
               } else {
                   appealError = `Exceeded the 30-day limit to file a First Appeal after the 30-day reply period expired.`;
               }
          } else {
               const submitDate = new Date(foundRti.dateSubmitted);
               const daysSinceSubmit = Math.ceil((currentDate.getTime() - submitDate.getTime()) / (1000 * 60 * 60 * 24));
               
               if (daysSinceSubmit < 30) {
                   appealError = `Must wait 30 days for a reply before filing an appeal. (Filed ${daysSinceSubmit} days ago)`;
               } else if (daysSinceSubmit <= 60) {
                   canAppeal = true;
               } else {
                   appealError = `Exceeded the 30-day limit to file a First Appeal after the 30-day reply period expired.`;
               }
          }
      }
      
      if (canAppeal) {
         setTargetRti(foundRti);
         setDetails({...foundRti.applicant});
         setIsMobileVerified(true);
         setIsEmailVerified(true);
         setStep(2);
      } else {
         setError(appealError);
      }
    } else {
      setError('No RTI application found with this registration number.');
    }
  };

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groundForAppeal) {
       setError('Please select a ground for appeal.');
       return;
    }
    if (!appealText.trim()) {
       setError('Please enter the text for the RTI first appeal application.');
       return;
    }
    
    const isValidText = /^[a-zA-Z0-9\s,\.\-_\(\)\/@:&\?\%]*$/.test(appealText);
    if (!isValidText) {
       setError('The appeal text contains invalid characters.');
       return;
    }
    
    if (targetRti) {
      setStep(4); // Review step
    }
  };

  const handleFinalSubmit = () => {
    if (targetRti) {
      updateApplicationStatus(targetRti.id, 'Closed'); // Close original RTI since appeal is taken up
      
      const appealIdStr = generateRegistrationId(targetRti.authority.name, 'A');
      setNewAppealId(appealIdStr);
      
      const newAppealApp = {
        ...targetRti,
        id: appealIdStr,
        dateSubmitted: new Date().toISOString(),
        status: 'First Appeal Filed' as const,
        subject: `First Appeal: ${targetRti.subject}`,
        responses: [],
        timeline: [
          { status: 'First Appeal Filed' as const, date: new Date().toISOString(), description: `Appeal filed against ${targetRti.id}.` }
        ]
      };
      
      addApplication(newAppealApp);
      setStep(5); // Success step
    }
  };

  return (
    <>
      {!hasAcceptedGuidelines && <GuidelinesModal onAccept={() => setHasAcceptedGuidelines(true)} />}
      <div className="min-h-screen bg-stone-50 text-slate-900 font-sans flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="National Emblem of India" className="w-full h-full object-contain" />
                </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight leading-tight block">RTI Online</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Government of India</span>
            </div>
          </div>
          {step < 5 && (
            <button type="button" onClick={() => setShowCancelModal(true)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
              <span className="font-medium text-sm hidden sm:block">Cancel & Exit</span>
              <X className="w-5 h-5" />
            </button>
          )}
        </header>

        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
          
          {/* Progress Indicator */}
          {step < 5 && (
            <div className="mb-12">
              <div className="flex items-center justify-between relative mb-8">
                 {/* Progress Line */}
                 <div className="absolute left-[20px] right-[20px] top-5 h-1 bg-slate-200 z-0 transform -translate-y-1/2">
                   <div 
                     className="h-full bg-emerald-600 transition-all duration-500 ease-in-out"
                     style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                   ></div>
                 </div>
                    
                 {STEPS.map((label, index) => {
                   const stepNumber = index + 1;
                   const isActive = step === stepNumber;
                   const isPast = step > stepNumber;
                      
                   return (
                     <div key={label} className="flex flex-col items-center relative z-10">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-semibold transition-colors duration-300 ${
                         isPast ? 'bg-emerald-600 border-emerald-600 text-white' :
                         isActive ? 'bg-white border-emerald-600 text-emerald-600' :
                         'bg-white border-slate-300 text-slate-400'
                       }`}>
                         {isPast ? <Check size={18} /> : stepNumber}
                       </div>
                       <span className={`absolute top-12 whitespace-nowrap text-xs font-medium hidden sm:block ${
                         isActive || isPast ? 'text-slate-800' : 'text-slate-400'
                       }`}>
                         {label}
                       </span>
                     </div>
                   );
                 })}
              </div>
            </div>
          )}

          <div className={`overflow-hidden min-h-[500px] flex flex-col ${step === 1 ? '' : 'bg-white rounded-2xl shadow-sm border border-slate-200'}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-grow flex flex-col"
              >
                {step === 1 && (
                  <div className="flex-grow flex flex-col items-center justify-center">
                    <div className="w-full flex flex-col bg-white overflow-hidden rounded-2xl shadow-sm border border-slate-200 max-w-lg">
                      <div className="bg-emerald-600 p-8 text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
                        </div>
                        <h2 className="text-3xl font-bold mb-2">File an Appeal</h2>
                        <p className="text-emerald-50 text-sm font-medium">Enter your Registration Number to initiate a First Appeal.</p>
                      </div>
                      <div className="p-8">
                        <form onSubmit={handleTrack} className="space-y-6">
                           <div>
                             <label className="block text-sm font-semibold text-slate-700 mb-2">RTI Registration Number</label>
                             <input 
                               type="text" 
                               required value={regNumber}
                               onChange={(e) => {
                                 setRegNumber(e.target.value.toUpperCase());
                                 if (error) setError('');
                               }}
                               className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 shadow-sm"
                               placeholder="e.g. PASSP/R/E/26/03817"
                             />
                             <p className="text-xs text-slate-500 mt-2">Format: AAAAA/B/C/DD/EEEEE (e.g., PASSP/R/E/26/03817)</p>
                             {error && <p id="error-container" className="text-sm text-red-600 font-medium mt-2">{error}</p>}
                           </div>
                           <button 
                             type="submit" 
                             className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                           >
                             Review and File an Appeal
                           </button>
                           <p className="text-xs text-slate-500 text-center leading-relaxed mt-4">
                             First Appeals must be filed within 30 days of receiving a response or the expiry of the time limit.
                           </p>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && targetRti && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!currentUser && (!isMobileVerified || !isEmailVerified)) {
                      setError('Please verify both Mobile Number and Email Address to continue.');
                      return;
                    }
                    setError('');
                    setStep(3);
                  }} className="flex-grow flex flex-col">
                    <div className="p-6 md:p-10 flex-grow">
                      <div className="border-b border-slate-100 pb-6 mb-8">
                         <h2 className="text-2xl font-bold text-slate-900 tracking-tight">RTI Application Details</h2>
                         <p className="text-slate-600 text-sm mt-1">All fields marked with * are mandatory.</p>
                      </div>
                      
                      {/* Read Only Authority & Editable Applicant Fields */}
                      <div className="flex flex-col gap-8 p-6 bg-slate-50 border-y border-slate-200">
                        {/* Read Only Authority Data */}
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Authority Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Select Ministry/Department/Apex body</label>
                               <CustomSelect theme="emerald" disabled value={targetRti.authority.ministry} options={[{label: targetRti.authority.ministry, value: targetRti.authority.ministry}]} />
                            </div>
                            <div>
                               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Public Authority</label>
                               <CustomSelect theme="emerald" disabled value={targetRti.authority.name} options={[{label: targetRti.authority.name, value: targetRti.authority.name}]} />
                            </div>
                            <div>
                               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Request Registration Number</label>
                               <input disabled type="text" value={targetRti.id} className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-sm text-slate-700 cursor-not-allowed" />
                            </div>
                            <div>
                               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Request Registration Date</label>
                               <input disabled type="text" value={new Date(targetRti.dateSubmitted).toLocaleDateString('en-GB')} className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-sm text-slate-700 cursor-not-allowed" />
                            </div>
                          </div>
                        </div>

                        {/* Editable Applicant Data */}
                        {details && (
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Applicant Details</h3>
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
                                  <input type="text" name="fullName" value={details.fullName} disabled className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-100 text-slate-500 cursor-not-allowed" />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number *</label>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <input type="tel" name="mobile" value={details.mobile} disabled className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed outline-none" />
                                    {isMobileVerified ? (
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-lg border border-green-200">
                                          <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        
                                      </div>
                                    ) : (
                                      <button type="button" onClick={() => { setOtpMobile(''); if (details.mobile.length === 10) setIsMobileVerifying(true); }} disabled={details.mobile.length !== 10} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors outline-none">
                                        Verify
                                      </button>
                                    )}
                                  </div>
                                  {isMobileVerifying && !isMobileVerified && (
                                    <div className="mt-3 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                                      <p className="text-xs text-emerald-800 mb-2 font-medium">Since it's a mock website enter any random number it will work.</p>
                                      <div className="flex flex-col sm:flex-row gap-2">
                                        <input type="text" inputMode="numeric" pattern="\d{6}" maxLength={6} value={otpMobile} onKeyDown={(e) => { if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) e.preventDefault(); }} onChange={e => setOtpMobile(e.target.value.replace(/\D/g, ''))} className="flex-1 px-3 py-2 text-center tracking-widest border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="6-digit OTP" />
                                        <button type="button" onClick={() => otpMobile.length === 6 && setIsMobileVerified(true)} disabled={otpMobile.length !== 6} className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors">Confirm</button>
                    </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <input type="email" name="email" value={details.email} disabled className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed outline-none" />
                                  {isEmailVerified ? (
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-lg border border-green-200">
                                        <CheckCircle2 className="w-5 h-5" />
                                      </div>
                                      
                                    </div>
                                  ) : (
                                    <button type="button" onClick={() => { setOtpEmail(''); if (details.email.includes('@') && details.email.endsWith('.com')) setIsEmailVerifying(true); }} disabled={!details.email.includes('@') || !details.email.endsWith('.com')} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors outline-none">
                                      Verify
                                    </button>
                                  )}
                                </div>
                                {isEmailVerifying && !isEmailVerified && (
                                  <div className="mt-3 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                                    <p className="text-xs text-emerald-800 mb-2 font-medium">Since it's a mock website enter any random number it will work.</p>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input type="text" inputMode="numeric" pattern="\d{6}" maxLength={6} value={otpEmail} onKeyDown={(e) => { if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) e.preventDefault(); }} onChange={e => setOtpEmail(e.target.value.replace(/\D/g, ''))} className="flex-1 px-3 py-2 text-center tracking-widest border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="6-digit OTP" />
                                      <button type="button" onClick={() => otpEmail.length === 6 && setIsEmailVerified(true)} disabled={otpEmail.length !== 6} className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors">Confirm</button>
                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1">Gender *</label>
                                  <CustomSelect theme="emerald" name="gender" value={details.gender} disabled options={[{label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}, {label: 'Transgender', value: 'Transgender'}, {label: 'Prefer not to say', value: 'Prefer not to say'}]} />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1">Educational Status *</label>
                                  <CustomSelect theme="emerald" name="educationalStatus" value={details.educationalStatus} disabled options={[{label: 'Literate', value: 'Literate'}, {label: 'Illiterate', value: 'Illiterate'}]} />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Complete Address *</label>
                                <input type="text" name="address" value={details.address} disabled className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-100 text-slate-500 cursor-not-allowed" />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1">Country *</label>
                                  <div>
                                    <input type="text" value="India" disabled className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed outline-none" />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1">State *</label>
                                  <CustomSelect theme="emerald" name="state" value={details.state} disabled options={[{"label":"Andhra Pradesh","value":"Andhra Pradesh"},{"label":"Arunachal Pradesh","value":"Arunachal Pradesh"},{"label":"Assam","value":"Assam"},{"label":"Bihar","value":"Bihar"},{"label":"Chhattisgarh","value":"Chhattisgarh"},{"label":"Goa","value":"Goa"},{"label":"Gujarat","value":"Gujarat"},{"label":"Haryana","value":"Haryana"},{"label":"Himachal Pradesh","value":"Himachal Pradesh"},{"label":"Jharkhand","value":"Jharkhand"},{"label":"Karnataka","value":"Karnataka"},{"label":"Kerala","value":"Kerala"},{"label":"Madhya Pradesh","value":"Madhya Pradesh"},{"label":"Maharashtra","value":"Maharashtra"},{"label":"Manipur","value":"Manipur"},{"label":"Meghalaya","value":"Meghalaya"},{"label":"Mizoram","value":"Mizoram"},{"label":"Nagaland","value":"Nagaland"},{"label":"Odisha","value":"Odisha"},{"label":"Punjab","value":"Punjab"},{"label":"Rajasthan","value":"Rajasthan"},{"label":"Sikkim","value":"Sikkim"},{"label":"Tamil Nadu","value":"Tamil Nadu"},{"label":"Telangana","value":"Telangana"},{"label":"Tripura","value":"Tripura"},{"label":"Uttar Pradesh","value":"Uttar Pradesh"},{"label":"Uttarakhand","value":"Uttarakhand"},{"label":"West Bengal","value":"West Bengal"},{"label":"Andaman and Nicobar Islands","value":"Andaman and Nicobar Islands"},{"label":"Chandigarh","value":"Chandigarh"},{"label":"Dadra and Nagar Haveli and Daman and Diu","value":"Dadra and Nagar Haveli and Daman and Diu"},{"label":"Delhi","value":"Delhi"},{"label":"Jammu and Kashmir","value":"Jammu and Kashmir"},{"label":"Ladakh","value":"Ladakh"},{"label":"Lakshadweep","value":"Lakshadweep"},{"label":"Puducherry","value":"Puducherry"}]} />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1">PIN Code *</label>
                                  <input type="text" name="pinCode" value={details.pinCode} disabled className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-slate-100 text-slate-500 cursor-not-allowed" placeholder="6-digit PIN code" />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status (Rural/Urban) *</label>
                                  <CustomSelect theme="emerald" name="status" value={details.status} disabled options={[{label: 'Rural', value: 'Rural'}, {label: 'Urban', value: 'Urban'}]} />
                                </div>
                              </div>

                              <div className="pt-4 border-t border-slate-200">
                                 <label className="flex items-start gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                    <input type="checkbox" name="isBpl" checked={details.isBpl} onChange={handleDetailsChange} className="mt-1 w-5 h-5 text-emerald-500 border-slate-300 rounded outline-none" />
                                    <div>
                                      <span className="block font-semibold text-slate-900">I am a Below Poverty Line (BPL) applicant</span>
                                      <span className="block text-sm text-slate-500 mt-1">No RTI fee is required to be paid by any citizen who is below poverty line as per RTI Rules, 2012. You will be required to upload a valid BPL certificate in the next step.</span>
                                    </div>
                                 </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 md:px-10 md:py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        Save & Continue <ChevronLeft className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  </form>
                )}

                {step === 3 && targetRti && (
                  <div className="flex-grow flex flex-col">
                    <div className="p-6 md:p-10 flex-grow">
                      <div className="border-b border-slate-100 pb-6 mb-8">
                         <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Appeal Request</h2>
                         <p className="text-slate-600 text-sm mt-1">All fields marked with * are mandatory.</p>
                      </div>
                      
                      {error && (
                        <div id="error-container" className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start text-sm border border-red-100">
                          <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                          <p>{error}</p>
                        </div>
                      )}

                      <form id="appeal-form" onSubmit={handleAppealSubmit} className="space-y-6">
                        {/* Active Form Fields */}
                        <div>
                           <label className="block text-sm font-semibold text-slate-700 mb-2">
                             * Ground For Appeal
                           </label>
                           <CustomSelect theme="emerald" 
                             name="groundForAppeal"
                             value={groundForAppeal}
                             required
                             onChange={(e) => {
                                setGroundForAppeal(e.target.value);
                                if (error) setError('');
                             }}
                             placeholder="--Select--"
                             className="w-full md:w-1/2"
                             options={[
                               {label: 'Refused access to Information Requested', value: 'Refused access to Information Requested'},
                               {label: 'No Response Within the Time Limit', value: 'No Response Within the Time Limit'},
                               {label: 'Unreasonable amount of Fee required to Pay', value: 'Unreasonable amount of Fee required to Pay'},
                               {label: 'Provided Incomplete,Misleading or False Information', value: 'Provided Incomplete,Misleading or False Information'},
                               {label: 'Any Other ground', value: 'Any Other ground'}
                             ]}
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-semibold text-slate-700 mb-2">
                             * Text for RTI first appeal application
                             <span className="block text-xs font-normal text-slate-500 mt-1">
                               (Enter Text for RTI first appeal application upto 500 characters)
                             </span>
                           </label>
                           <textarea
                             value={appealText}
                             onChange={(e) => {
                                if (e.target.value.length <= 500) {
                                  setAppealText(e.target.value);
                                  if (error) setError('');
                                }
                             }}
                             maxLength={500}
                             rows={6}
                             required
                             className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-mono text-sm"
                             placeholder="Type your appeal text here..."
                           ></textarea>
                           <div className="text-right text-xs text-slate-500 mt-1">
                             {appealText.length} / 500 characters
                           </div>
                        </div>

                        <div>
                           <label className="block text-sm font-semibold text-slate-700 mb-2">
                             Supporting document (only pdf upto 1 MB)
                           </label>
                           <div className="flex items-center gap-4">
                             <input 
                                type="file" 
                                id="appealDoc" 
                                accept=".pdf" 
                                className="hidden" 
                                onChange={(e) => {
                                   if (e.target.files && e.target.files[0]) {
                                     setAppealDoc(e.target.files[0]);
                                   }
                                }} 
                             />
                             <label 
                                htmlFor="appealDoc" 
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
                             >
                                <Upload className="w-4 h-4" /> Choose File
                             </label>
                             <span className="text-sm text-slate-500">
                               {appealDoc ? appealDoc.name : 'No file chosen'}
                             </span>
                           </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-6">
                           <h4 className="font-semibold text-slate-700 text-sm mb-2">Important Guidelines</h4>
                           <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                              <li>File name should not contain blank spaces.</li>
                              <li>Do not upload Aadhaar, PAN or other personal ID documents (Except BPL Card for fee exemption).</li>
                           </ul>
                        </div>
                      </form>
                    </div>
                    
                    <div className="p-6 md:px-10 md:py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        form="appeal-form"
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        Save & Continue <ChevronLeft className="w-4 h-4 rotate-180" />
                      </button>
                    </div>
                  </div>
                )}

                
                {step === 4 && targetRti && (
                  <div className="flex-grow flex flex-col">
                    <div className="p-6 md:p-10 flex-grow">
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-8">Review and File an Appeal</h2>
                      
                      <div className="space-y-6 mb-8">
                        {/* Applicant Details */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
                           <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                             <h3 className="text-sm font-bold text-slate-900">Personal Details</h3>
                             <button onClick={() => setStep(2)} className="text-sm text-emerald-600 font-medium hover:underline">Edit</button>
                           </div>
                           {details && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</h4>
                                 <p className="text-sm text-slate-900 font-medium">{details.fullName}</p>
                               </div>
                               <div>
                                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mobile Number</h4>
                                 <p className="text-sm text-slate-900 font-medium">{details.mobile}</p>
                               </div>
                               <div>
                                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</h4>
                                 <p className="text-sm text-slate-900 font-medium">{details.email}</p>
                               </div>
                               <div>
                                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Gender</h4>
                                 <p className="text-sm text-slate-900 font-medium">{details.gender || '-'}</p>
                               </div>
                               <div className="md:col-span-2">
                                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Complete Address</h4>
                                 <p className="text-sm text-slate-900 font-medium">
                                   {[details.address, details.state, details.pinCode, details.country].filter(Boolean).join(', ')}
                                 </p>
                               </div>
                               <div>
                                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Educational Status</h4>
                                 <p className="text-sm text-slate-900 font-medium">{details.educationalStatus || '-'}</p>
                               </div>
                               <div>
                                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status (Rural/Urban)</h4>
                                 <p className="text-sm text-slate-900 font-medium">{details.status || '-'}</p>
                               </div>
                               <div>
                                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">BPL Status</h4>
                                 <p className="text-sm text-slate-900 font-medium">{details.isBpl ? 'Yes' : 'No'}</p>
                               </div>
                             </div>
                           )}
                        </div>

                        {/* Appeal Details */}
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 space-y-6">
                           <div className="flex justify-between items-start border-b border-emerald-200 pb-3">
                             <h3 className="text-sm font-bold text-emerald-900">Appeal Request Details</h3>
                             <button onClick={() => setStep(3)} className="text-sm text-emerald-700 font-medium hover:underline">Edit</button>
                           </div>
                           <div>
                             <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Ground For Appeal</h4>
                             <p className="text-sm text-emerald-950 font-medium">{groundForAppeal}</p>
                           </div>
                           <div>
                             <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Appeal Text</h4>
                             <p className="text-sm text-emerald-900 bg-white border border-emerald-200 p-4 rounded-lg whitespace-pre-wrap font-mono">
                               {appealText}
                             </p>
                           </div>
                           {appealDoc && (
                             <div>
                               <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Supporting Document</h4>
                               <p className="text-sm text-emerald-950 flex items-center gap-2">
                                 <span className="w-8 h-8 bg-emerald-200 text-emerald-700 rounded flex items-center justify-center">📄</span>
                                 {appealDoc.name}
                               </p>
                             </div>
                           )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 w-full justify-between mt-auto pt-6 border-t border-slate-100">
                        <button 
                          type="button"
                          onClick={() => setStep(3)}
                          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button 
                          onClick={handleFinalSubmit}
                          className="px-8 py-3 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors flex items-center gap-2"
                        >
                          Confirm & File Appeal
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && targetRti && (
                  <div className="flex-grow flex flex-col justify-center items-center p-8">
                    <div className="relative mb-6 w-24 h-24 mx-auto">
                      <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-70"></div>
                      <div className="absolute inset-0 bg-emerald-500 rounded-full flex items-center justify-center z-10 shadow-lg shadow-emerald-500/30">
                        <Check className="w-12 h-12 text-white stroke-[3]" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Appeal Filed Successfully</h2>
                    <p className="text-slate-600 text-center max-w-md mb-4">
                      Your First Appeal has been filed successfully. Your new appeal registration number is:
                    </p>
                    <div className="flex items-center justify-center gap-2 mb-8 bg-slate-50 border border-slate-200 px-6 py-4 rounded-xl shadow-sm">
                      <strong className="text-2xl text-slate-900 break-all">{newAppealId}</strong>
                      <div className="flex items-center">
                        <button 
                          onClick={copyToClipboard}
                          className={`p-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 ${copiedId === newAppealId ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:text-[#06038D] hover:bg-slate-100 cursor-pointer'}`}
                          title="Copy Registration Number"
                        >
                          {copiedId === newAppealId ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                        {copiedId === newAppealId && (
                          <span className="text-sm font-medium text-emerald-600 ml-2 animate-in fade-in slide-in-from-left-2 duration-200">
                            Copied!
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4 w-full justify-center max-w-sm mx-auto">
                      <button 
                        onClick={async () => {
                          await generatePdfFromElement('appeal-application-template', `Appeal_Application_${targetRti.id}.pdf`);
                        }}
                        className="px-6 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" /> Download Appeal Application
                      </button>
                      <button 
                        onClick={async () => {
                          await generatePdfFromElement('appeal-receipt-template', `Appeal_Receipt_${targetRti.id}.pdf`);
                        }}
                        className="px-6 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" /> Download Receipt
                      </button>
                      <button 
                        onClick={() => {
                          sessionStorage.removeItem('rti_appeals_step'); sessionStorage.removeItem('rti_appeals_reg'); sessionStorage.removeItem('rti_appeals_target'); sessionStorage.removeItem('rti_appeals_details'); sessionStorage.removeItem('rti_appeals_ground'); sessionStorage.removeItem('rti_appeals_text'); sessionStorage.removeItem('rti_appeals_guidelines');
                          sessionStorage.removeItem('rti_appeals_mob_verified'); sessionStorage.removeItem('rti_appeals_email_verified');
                          navigate('/dashboard');
                        }}
                        className="px-6 py-3 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors flex items-center justify-center gap-2"
                      >
                        Go to My RTIs <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Hidden Templates for PDF Generation */}
                    <div className="hidden">
                      {/* Receipt Template */}
                      <div id="appeal-receipt-template" className="w-[800px] bg-white p-12 text-slate-900 font-sans">
                        <div className="border-b-2 border-emerald-500 pb-6 mb-8 flex justify-between items-center">
                          <div>
                            <h1 className="text-3xl font-bold text-emerald-700 mb-1">Appeal Filing Receipt</h1>
                            <p className="text-slate-500 font-medium">Government of India - RTI Online Portal</p>
                          </div>
                          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Check className="w-8 h-8 text-emerald-600" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8 mb-8">
                          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">RTI Registration Number</p>
                            <p className="text-2xl font-bold text-slate-900">{targetRti.id}</p>
                          </div>
                          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Date of Filing Appeal</p>
                            <p className="text-xl font-bold text-slate-900">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-lg font-bold text-emerald-700 border-b border-emerald-100 pb-2 mb-4">Applicant Details</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div><span className="text-slate-500">Name:</span> <span className="font-medium">{details.fullName || 'N/A'}</span></div>
                            <div><span className="text-slate-500">Email:</span> <span className="font-medium">{details.email || 'N/A'}</span></div>
                            <div><span className="text-slate-500">Mobile:</span> <span className="font-medium">{details.mobile || 'N/A'}</span></div>
                          </div>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-lg font-bold text-blue-700 border-b border-blue-100 pb-2 mb-4">Public Authority Details</h3>
                          <div className="grid grid-cols-1 gap-4">
                            <div><span className="text-slate-500">Ministry/Department:</span> <span className="font-medium">{targetRti.authority.ministry || 'N/A'}</span></div>
                            <div><span className="text-slate-500">Public Authority:</span> <span className="font-medium">{targetRti.authority.name || 'N/A'}</span></div>
                          </div>
                        </div>
                        
                        <div className="text-center mt-12 text-sm text-slate-500">
                          <p>This is a computer-generated receipt and does not require a signature.</p>
                        </div>
                      </div>

                      {/* Appeal Application Template */}
                      <div id="appeal-application-template" className="w-[800px] bg-white p-12 text-slate-900 font-sans">
                        <div className="border-b-2 border-emerald-600 pb-6 mb-8 text-center">
                          <h1 className="text-3xl font-bold text-emerald-600 mb-2">First Appeal Application Form</h1>
                          <p className="text-slate-600 font-medium">Under Section 19(1) of Right to Information Act, 2005</p>
                        </div>
                        
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200 mb-8">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Registration No.</p>
                            <p className="text-lg font-bold">{targetRti.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Date of Filing</p>
                            <p className="text-lg font-bold">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="text-md font-bold text-slate-800 bg-slate-100 p-2 px-4 rounded mb-4">1. Appellant Details</h3>
                          <div className="grid grid-cols-2 gap-4 px-4 text-sm">
                            <div><span className="text-slate-500 block mb-1">Full Name</span> <span className="font-medium text-base">{details.fullName || 'N/A'}</span></div>
                            <div><span className="text-slate-500 block mb-1">Gender</span> <span className="font-medium text-base">{details.gender || 'N/A'}</span></div>
                            <div><span className="text-slate-500 block mb-1">Email ID</span> <span className="font-medium text-base">{details.email || 'N/A'}</span></div>
                            <div><span className="text-slate-500 block mb-1">Mobile No.</span> <span className="font-medium text-base">{details.mobile || 'N/A'}</span></div>
                            <div className="col-span-2"><span className="text-slate-500 block mb-1">Address</span> <span className="font-medium text-base">{details.address || 'N/A'}, {details.pinCode}, {details.state}, {details.country}</span></div>
                            <div><span className="text-slate-500 block mb-1">Educational Status</span> <span className="font-medium text-base">{details.educationalStatus || 'N/A'}</span></div>
                            <div><span className="text-slate-500 block mb-1">Citizenship</span> <span className="font-medium text-base">Indian</span></div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="text-md font-bold text-slate-800 bg-slate-100 p-2 px-4 rounded mb-4">2. Public Authority Details</h3>
                          <div className="grid grid-cols-1 gap-4 px-4 text-sm">
                            <div><span className="text-slate-500 block mb-1">Ministry/Department/Apex Body</span> <span className="font-medium text-base">{targetRti.authority.ministry || 'N/A'}</span></div>
                            <div><span className="text-slate-500 block mb-1">Public Authority</span> <span className="font-medium text-base">{targetRti.authority.name || 'N/A'}</span></div>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h3 className="text-md font-bold text-slate-800 bg-slate-100 p-2 px-4 rounded mb-4">3. Ground For Appeal</h3>
                          <div className="px-4 text-sm">
                            <div className="font-medium mb-4">
                              <span className="font-bold text-slate-600">Reason:</span> {groundForAppeal}
                            </div>
                            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 whitespace-pre-wrap font-medium">
                              {appealText || 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center mt-12 text-sm text-slate-500 border-t border-slate-200 pt-6">
                          <p>This appeal was electronically filed on the RTI Online Portal.</p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Discard Progress?</h3>
            </div>
            <p className="text-slate-600 text-sm mb-6">
              Are you sure you want to close the appeal? All your entered details and progress will be lost.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Continue Appeal
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  sessionStorage.removeItem('rti_appeals_step');
                  sessionStorage.removeItem('rti_appeals_reg');
                  sessionStorage.removeItem('rti_appeals_target');
                  sessionStorage.removeItem('rti_appeals_details');
                  sessionStorage.removeItem('rti_appeals_ground');
                  sessionStorage.removeItem('rti_appeals_text');
                  sessionStorage.removeItem('rti_appeals_guidelines');
                  sessionStorage.removeItem('rti_appeals_mob_verified');
                  sessionStorage.removeItem('rti_appeals_email_verified');
                  navigate('/');
                }}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


