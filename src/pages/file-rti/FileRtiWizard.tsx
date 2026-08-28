import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, X, AlertTriangle  } from 'lucide-react';

import { Step2Authority } from './steps/Step2Authority';
import { Step3Details } from './steps/Step3Details';
import { Step4Request } from './steps/Step4Request';
import { Step5Review } from './steps/Step5Review';
import { Step6Payment } from './steps/Step6Payment';
import { Step7Success } from './steps/Step7Success';
import { RtiDraft } from '../../types';
import { useRtiContext } from '../../store/RtiContext';
import { GuidelinesModal } from '../../components/GuidelinesModal';

const STEPS = ['Authority', 'Your Details', 'RTI Request', 'Review', 'Payment'];

import { useAuth } from '../../store/AuthContext';
import { useSessionStorage } from '../../hooks/useSessionStorage';
import { generateRegistrationId } from '../../utils/generateId';

export const FileRtiWizard = () => {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useSessionStorage('rti_wizard_step', 1);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const [hasAcceptedGuidelines, setHasAcceptedGuidelines] = useSessionStorage('rti_wizard_guidelines', false);
  const [draft, setDraft] = useSessionStorage<RtiDraft>('rti_wizard_draft', {
    question: '',
    authority: null,
    applicant: null,
    supportingDocument: null
  });


  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { addApplication } = useRtiContext();
  const navigate = useNavigate();

  const handleCancel = () => {
    setShowCancelModal(true);
  };
  
  const confirmCancel = () => {
    if (currentUser) {
       const dataStr = localStorage.getItem(`userData_${currentUser.id}`);
       if (dataStr) {
         try {
           const parsed = JSON.parse(dataStr);
           delete parsed.draft;
           delete parsed.draftStep;
           localStorage.setItem(`userData_${currentUser.id}`, JSON.stringify(parsed));
         } catch (e) {}
       }
    }
    sessionStorage.removeItem('rti_wizard_draft');
    sessionStorage.removeItem('rti_wizard_step');
    sessionStorage.removeItem('rti_wizard_guidelines');
    sessionStorage.removeItem('rti_wizard_mob_verified');
    sessionStorage.removeItem('rti_wizard_email_verified');
    navigate('/');
  };

  const handleNext = () => {
     setCurrentStep(prev => {
        const next = Math.min(prev + 1, 6);
        return next;
     });
  };

  const handleBack = () => {
     setCurrentStep(prev => {
        const next = Math.max(prev - 1, 1);
        return next;
     });
  };


  const updateDraft = (data: Partial<RtiDraft>) => {
    setDraft(prev => {
       const newDraft = { ...prev, ...data };
       return newDraft;
    });
  };

  const handleSubmit = (feePaid: number) => {
    const newId = generateRegistrationId(draft.authority?.name, 'R');
    setGeneratedId(newId);
    
    // Save to context
    if (draft.authority && draft.applicant) {
       addApplication({
         id: newId,
         dateSubmitted: new Date().toISOString(),
         authority: draft.authority,
         question: draft.question,
         subject: draft.question.substring(0, 50) + '...',
         applicant: draft.applicant,
         status: 'Submitted',
         feePaid,
         documents: (draft.supportingDocument && draft.supportingDocument.name) ? [draft.supportingDocument.name] : [],
         documentsData: draft.supportingDocument ? [{ name: draft.supportingDocument.name, dataUrl: draft.supportingDocument.dataUrl }] : [],
         responses: [],
         timeline: [
           { status: 'Submitted', date: new Date().toISOString(), description: 'Application submitted successfully via portal.' }
         ]
       });
       
    }
    
    setCurrentStep(6); // Success step
  };

  return (
    <>
      {!hasAcceptedGuidelines && <GuidelinesModal onAccept={() => setHasAcceptedGuidelines(true)} />}
      <div className="min-h-screen bg-stone-50 text-slate-900 font-sans flex flex-col">
      {/* Minimal Header */}
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
        {currentStep < 6 && (
          <button type="button" onClick={handleCancel} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <span className="font-medium text-sm hidden sm:block">Cancel & Exit</span>
            <X className="w-5 h-5" />
          </button>
        )}
      </header>

      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
      
      {/* Progress Indicator */}
      {currentStep < 6 && (
        <div className="mb-12">
          <div className="flex items-center justify-between relative mb-8">
             <div className="absolute left-[20px] right-[20px] top-5 h-1 bg-slate-200 z-0 transform -translate-y-1/2">
               <div 
                 className="h-full bg-orange-500 transition-all duration-500 ease-in-out"
                 style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
               ></div>
             </div>
             
             {STEPS.map((label, index) => {
               const stepNumber = index + 1;
               const isActive = currentStep === stepNumber;
               const isPast = currentStep > stepNumber;
               
               return (
                 <div key={label} className="flex flex-col items-center relative z-10">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-semibold transition-colors duration-300 ${
                     isPast ? 'bg-orange-500 border-orange-500 text-white' :
                     isActive ? 'bg-white border-orange-500 text-orange-600' :
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

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-grow p-6 md:p-10 flex flex-col"
          >
            {currentStep === 1 && <Step2Authority draft={draft} updateDraft={updateDraft} onNext={handleNext} onBack={handleBack} />}
            {currentStep === 2 && <Step3Details draft={draft} updateDraft={updateDraft} onNext={handleNext} onBack={handleBack} />}
            {currentStep === 3 && <Step4Request draft={draft} updateDraft={updateDraft} onNext={handleNext} onBack={handleBack} />}
            {currentStep === 4 && <Step5Review draft={draft} onNext={handleNext} onBack={handleBack} onEditStep={setCurrentStep} />}
            {currentStep === 5 && <Step6Payment draft={draft} onNext={handleSubmit} onBack={handleBack} />}
            {currentStep === 6 && <Step7Success draft={draft} registrationId={generatedId!} />}
          </motion.div>
        </AnimatePresence>
      </div>


      {/* Custom Cancel Modal */}
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
              Are you sure you want to close the application? All your entered details and progress will be lost.
            </p>
            <div className="flex gap-3 w-full">
              <button 
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Continue RTI
              </button>
              <button 
                type="button"
                onClick={confirmCancel}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </>
  );
};
