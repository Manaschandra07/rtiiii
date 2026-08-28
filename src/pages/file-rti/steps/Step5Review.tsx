import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { RtiDraft } from '../../../types';

interface Props {
  draft: RtiDraft;
  onNext: () => void;
  onBack: () => void;
  onEditStep: (step: number) => void;
}

export const Step5Review = ({ draft, onNext, onBack, onEditStep }: Props) => {
  const [confirmed, setConfirmed] = useState(false);
  const fee = draft.applicant?.isBpl ? 0 : 10;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Review your application</h2>
        <p className="text-slate-600 mt-2">Please verify all details before proceeding to payment.</p>
      </div>

      <div className="flex-grow space-y-6 pb-4">
        
        {/* Authority Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex justify-between items-start mb-3">
             <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Public Authority</h3>
             <button onClick={() => onEditStep(1)} className="text-sm text-orange-600 font-medium hover:underline">Edit</button>
          </div>
          <p className="font-semibold text-slate-900">{draft.authority?.name}</p>
          <p className="text-sm text-slate-600">{draft.authority?.ministry}</p>
        </div>

        {/* Applicant Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex justify-between items-start mb-3">
             <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Your Details</h3>
             <button onClick={() => onEditStep(2)} className="text-sm text-orange-600 font-medium hover:underline">Edit</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
             <div>
                <p className="text-slate-500">Name</p>
                <p className="font-medium text-slate-900">{draft.applicant?.fullName}</p>
             </div>
             <div>
                <p className="text-slate-500">Contact</p>
                <p className="font-medium text-slate-900">{draft.applicant?.mobile} <br/> {draft.applicant?.email}</p>
             </div>
             <div className="md:col-span-2">
                <p className="text-slate-500">Address</p>
                <p className="font-medium text-slate-900">{draft.applicant?.address}, {draft.applicant?.state} - {draft.applicant?.pinCode}</p>
             </div>
             <div>
                <p className="text-slate-500">BPL Status</p>
                <p className="font-medium text-slate-900">{draft.applicant?.isBpl ? 'Yes (Fee Exempted)' : 'No'}</p>
             </div>
          </div>
        </div>

        {/* Request Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="flex justify-between items-start mb-3">
             <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">RTI Request</h3>
             <button onClick={() => onEditStep(3)} className="text-sm text-orange-600 font-medium hover:underline">Edit</button>
          </div>
          <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{draft.question}</p>
          
          {draft.supportingDocument && (
            <div className="mt-4 pt-4 border-t border-slate-200">
               <p className="text-sm text-slate-500 mb-1">Supporting Document</p>
               <p className="text-sm font-medium text-slate-900">{draft.supportingDocument.name}</p>
            </div>
          )}
        </div>

        {/* Fee Section */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex justify-between items-center">
           <div>
             <h3 className="text-sm font-semibold text-orange-900">Application Fee</h3>
             <p className="text-xs text-orange-800 mt-1">{draft.applicant?.isBpl ? 'Exempted for BPL applicant' : 'Standard RTI fee applies'}</p>
           </div>
           <div className="text-2xl font-bold text-orange-600">
             ₹{fee}
           </div>
        </div>

      </div>

      <div className="mt-6 pt-4">
        <label className="flex items-start gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1 w-5 h-5 text-orange-500 focus:ring-orange-500 border-slate-300 rounded outline-none" />
          <span className="text-sm text-slate-700">I confirm that all the details provided above are correct to the best of my knowledge. I understand that false information may lead to rejection.</span>
        </label>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button 
          onClick={onNext}
          disabled={!confirmed}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            confirmed 
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {fee > 0 ? 'Proceed to Payment' : 'Submit Application'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
