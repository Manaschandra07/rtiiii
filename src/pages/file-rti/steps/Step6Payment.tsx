import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, CreditCard, Building, Smartphone } from 'lucide-react';
import { RtiDraft } from '../../../types';

interface Props {
  draft: RtiDraft;
  onNext: (feePaid: number) => void;
  onBack: () => void;
}

export const Step6Payment = ({ draft, onNext, onBack }: Props) => {
  const fee = draft.applicant?.isBpl ? 0 : 10;
  const [method, setMethod] = useState<string>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto skip if fee is 0
  useEffect(() => {
    if (fee === 0) {
      setIsProcessing(true);
      const timer = setTimeout(() => {
        onNext(0);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [fee, onNext]);

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate payment gateway
    setTimeout(() => {
      onNext(fee);
    }, 2000);
  };

  if (fee === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
         <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
         <h2 className="text-xl font-semibold text-slate-800">Processing BPL Exemption...</h2>
         <p className="text-slate-500 max-w-md text-center">No RTI fee is required to be paid by any citizen who is below poverty line as per RTI Rules, 2012.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Payment</h2>
        <p className="text-slate-600 mt-2">Secure payment gateway for Government of India.</p>
      </div>

      <div className="max-w-md mx-auto w-full flex-grow">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 text-center">
           <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Application Fee</p>
           <div className="text-5xl font-bold text-slate-900 mb-2">₹10</div>
           <p className="text-sm text-slate-600">As per RTI Act, 2005</p>
        </div>

        <h3 className="text-sm font-semibold text-slate-700 mb-4">Select Payment Method</h3>
        <div className="space-y-3">
           
           <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${method === 'upi' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}>
             <div className="flex items-center gap-3">
               <input type="radio" name="paymentMethod" value="upi" checked={method === 'upi'} onChange={() => setMethod('upi')} className="text-orange-500 focus:ring-orange-500" />
               <Smartphone className="w-5 h-5 text-slate-600" />
               <div>
                 <p className="font-semibold text-slate-900">UPI</p>
                 <p className="text-xs text-slate-500">Pay using any UPI app</p>
               </div>
             </div>
           </label>

           <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${method === 'card' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}>
             <div className="flex items-center gap-3">
               <input type="radio" name="paymentMethod" value="card" checked={method === 'card'} onChange={() => setMethod('card')} className="text-orange-500 focus:ring-orange-500" />
               <CreditCard className="w-5 h-5 text-slate-600" />
               <div>
                 <p className="font-semibold text-slate-900">Debit / Credit Card</p>
                 <p className="text-xs text-slate-500">Visa, MasterCard, RuPay</p>
               </div>
             </div>
           </label>

           <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${method === 'netbanking' ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}>
             <div className="flex items-center gap-3">
               <input type="radio" name="paymentMethod" value="netbanking" checked={method === 'netbanking'} onChange={() => setMethod('netbanking')} className="text-orange-500 focus:ring-orange-500" />
               <Building className="w-5 h-5 text-slate-600" />
               <div>
                 <p className="font-semibold text-slate-900">Net Banking</p>
                 <p className="text-xs text-slate-500">All major banks</p>
               </div>
             </div>
           </label>

        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
           <ShieldCheck className="w-4 h-4 text-emerald-600" />
           <span>Secure Encrypted Payment</span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
        <button onClick={onBack} disabled={isProcessing} className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button 
          onClick={handlePay}
          disabled={isProcessing}
          className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all disabled:opacity-70 disabled:cursor-wait"
        >
          {isProcessing ? 'Processing...' : `Pay ₹${fee}`} {!isProcessing && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
