import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface GuidelinesModalProps {
  onAccept: () => void;
}

export const GuidelinesModal: React.FC<GuidelinesModalProps> = ({ onAccept }) => {
  const [showFull, setShowFull] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Lock body scroll when modal mounts
    document.body.style.overflow = 'hidden';
    
    // Restore body scroll when modal unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col my-8 overflow-hidden max-h-[70vh] sm:max-h-[500px]"
      >
        <div className="p-6 border-b border-slate-200 flex-shrink-0 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle className="text-orange-500 w-6 h-6" />
            Guidelines for using RTI Portal
          </h2>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-slate-700 text-sm">
          <div className="space-y-4 font-medium">
            <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">1.</span><span><span className="font-bold text-slate-900">Only Indian citizens</span> can file RTI applications through this portal.</span></div>
            <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">2.</span><span><span className="font-bold text-slate-900">Application fee must be paid online</span>, except for <span className="font-bold text-slate-900">BPL (Below Poverty Line) applicants</span>, who must attach a valid BPL certificate.</span></div>
            <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">3.</span><span><span className="font-bold text-slate-900">First Appeal is free</span> (no fee), and you need the <span className="font-bold text-slate-900">original RTI application's registration number</span>.</span></div>
            <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">4.</span><span>The normal <span className="font-bold text-slate-900">RTI Act, 2005 rules, time limits, and exemptions still apply</span> even though you're filing online.</span></div>

            <AnimatePresence>
              {showFull && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 font-medium pt-2 text-slate-700">
                  <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">5.</span><span><strong>The portal is specifically for RTI requests to Ministries/Departments of the Government of India.</strong></span></div>
                  <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">6.</span><span><strong>Fields marked with (*) are mandatory</strong>; other fields are optional.</span></div>
                  <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">7.</span><span><strong>The RTI application text is limited to 3,000 characters.</strong></span></div>
                  <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">8.</span><span><strong>Only specific characters are allowed</strong> in the application text: A-Z, a-z, 0-9 and `, . - _ ( ) / @ : & ? \ %`.</span></div>
                  <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">9.</span><span><strong>If the application exceeds 3,000 characters</strong>, it can be uploaded as a <strong>Supporting Document</strong>.</span></div>
                  <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">10.</span><span><strong>Do not upload Aadhaar, PAN, or other personal identification documents</strong>; only a BPL certificate may be attached when applicable.</span></div>
                  <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">11.</span><span><strong>PDF file names must not contain spaces.</strong></span></div>
                  <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">12.</span><span><strong>Payment can be made using Internet Banking, Master/Visa cards, UPI, or RuPay cards.</strong></span></div>
                  <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">13.</span><span><strong>If you don't receive a registration number after payment, wait 24–48 working hours and do not pay again.</strong></span></div>
                  <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">14.</span><span><strong>A unique registration number is issued after successful submission</strong> and should be kept safely for future reference.</span></div>
                  <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">15.</span><span><strong>If additional fees are required</strong>, the CPIO will notify you through the portal or email.</span></div>
                  <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">16.</span><span><strong>You can check the status</strong> of your RTI application or First Appeal using <strong>"View Status."</strong></span></div>
                  <div className="flex gap-2 items-start"><span className="shrink-0 min-w-[1.25rem]">17.</span><span><strong>You can provide your mobile number to receive SMS alerts</strong> about your application.</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          <button 
            onClick={() => setShowFull(!showFull)}
            className="flex items-center gap-1 text-orange-600 font-medium hover:text-orange-700 mt-4 transition-colors text-sm"
          >
            {showFull ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showFull ? "Hide full guidelines" : "View full guidelines"}
          </button>
        </div>
        
        <div className="p-6 border-t border-slate-200 bg-white flex-shrink-0">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="mt-0.5 flex-shrink-0">
              <input 
                type="checkbox" 
                checked={checked}
                onChange={() => setChecked(!checked)}
                className="w-5 h-5 text-orange-600 focus:ring-orange-500 border-slate-300 rounded cursor-pointer outline-none"
              />
            </div>
            <span className="text-sm font-medium text-slate-700 select-none">
              I have read and understood the above guidelines, terms and conditions.
            </span>
          </label>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onAccept}
              disabled={!checked}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
