import React, { useState } from 'react';
import { Phone, Mail, Clock, HelpCircle, X, Check } from 'lucide-react';

export const Help = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reconcileStatus, setReconcileStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleReconcileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReconcileStatus('submitting');
    setTimeout(() => {
      setReconcileStatus('success');
    }, 1500);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setReconcileStatus('idle'), 300);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Reconcile Payment</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {reconcileStatus === 'success' ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Request Submitted</h4>
                  <p className="text-slate-600 mb-6">We have received your payment reconciliation request. If a match is found, your registration number will be emailed to you within 24 hours.</p>
                  <button 
                    onClick={closeModal}
                    className="w-full bg-[#06038D] text-white py-2.5 rounded-lg font-medium hover:bg-blue-900 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReconcileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Transaction/Reference Number *</label>
                    <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#06038D]" placeholder="e.g. IGALQABCD123" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Payment *</label>
                    <input type="date" required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#06038D]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email ID used *</label>
                    <input type="email" required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#06038D]" placeholder="Email address" />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={reconcileStatus === 'submitting'}
                      className="flex-1 bg-[#06038D] text-white py-2.5 rounded-lg font-medium hover:bg-blue-900 transition-colors disabled:opacity-70"
                    >
                      {reconcileStatus === 'submitting' ? 'Submitting...' : 'Reconcile'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Help & Support</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex flex-col items-center text-center">
           <Phone className="w-8 h-8 text-orange-600 mb-3" />
           <h3 className="font-bold text-slate-900 mb-1">Call Us</h3>
           <p className="text-sm text-slate-600 mb-2">011-24010690 / 691</p>
           <p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> 9:00 AM - 5:30 PM (Mon-Fri)</p>
        </div>
        <div className="bg-[#06038D]/10 border border-[#06038D]/20 p-6 rounded-2xl flex flex-col items-center text-center">
           <Mail className="w-8 h-8 text-[#06038D] mb-3" />
           <h3 className="font-bold text-slate-900 mb-1">Email Us</h3>
           <p className="text-sm text-slate-600 mb-2">helprtionline-dopt@nic.in</p>
           <p className="text-xs text-slate-500">We aim to reply within 24 hours.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col items-center text-center">
           <HelpCircle className="w-8 h-8 text-emerald-600 mb-3" />
           <h3 className="font-bold text-slate-900 mb-1">Payment Issues?</h3>
           <p className="text-sm text-slate-600 mb-2">Payment deducted but no registration generated?</p>
           <button 
            onClick={() => setIsModalOpen(true)}
            className="text-sm font-medium bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-4 py-2 rounded-lg transition-colors mt-2"
          >
            Reconcile Payment
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm mt-8">
        <p className="text-slate-700 mb-6 leading-relaxed">
          If an applicant's query is not resolved through the primary helpdesk channels, they may escalate the issue by reaching out to the official listed below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Primary Helpdesk</h3>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center gap-2"><Mail className="w-5 h-5 text-slate-400" /> <strong>Email:</strong> <a href="mailto:helprtionline-dopt@nic.in" className="text-orange-600 hover:underline">helprtionline-dopt@nic.in</a></li>
              <li className="flex items-center gap-2"><Phone className="w-5 h-5 text-slate-400" /> <strong>Phone:</strong> 011-24010690 / 011-24010691</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Escalation Contact</h3>
            <ul className="space-y-3 text-slate-600">
              <li><strong>Designation:</strong> Under Secretary (IR-1)</li>
              <li><strong>Office Address:</strong> W/H 31049, Kartavya Bhavan 3, New Delhi - 110001</li>
              <li className="flex items-center gap-2 mt-2"><Mail className="w-5 h-5 text-slate-400" /> <strong>Email:</strong> <a href="mailto:usir-dopt@nic.in" className="text-orange-600 hover:underline">usir-dopt@nic.in</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
