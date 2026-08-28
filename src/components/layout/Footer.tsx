import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const [showCicModal, setShowCicModal] = useState(false);

  return (
    <>
      <footer className="bg-slate-900 text-slate-300 py-12 mt-auto border-t-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="National Emblem of India" className="w-full h-full object-contain opacity-90" style={{ filter: "brightness(0) invert(1)" }} />
                </div>
                 <div>
                   <span className="text-xl font-bold tracking-tight leading-tight block text-white">RTI Online</span>
                   <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Government of India</span>
                 </div>
              </div>
              <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                An initiative of the Department of Personnel & Training, Government of India, to facilitate citizens for filing RTI applications online.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">About RTI</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/learn" className="hover:text-white transition-colors">What is RTI?</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">National Portal of India</a></li>
                <li>
                  <button onClick={() => setShowCicModal(true)} className="hover:text-white transition-colors text-left">
                    Complaint & Second Appeal to CIC
                  </button>
                </li>
                <li><a href="https://rtionline.gov.in/request/allpa.php?pageid=8f14e45fceea167a5a36dedd4bea2543" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Public Authorities Directory</a></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link to="/policy" className="hover:text-white transition-colors">Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 tracking-wide text-sm uppercase">Help Desk</h3>
              <ul className="space-y-2 text-sm">
                <li>Phone: <span className="text-white font-medium">011-24010690</span></li>
                <li>Phone: <span className="text-white font-medium">011-24010691</span></li>
                <li className="text-slate-500 text-xs mt-1">(9:00 AM to 5:30 PM, Mon-Fri)</li>
                <li className="mt-2">Email: <a href="mailto:helprtionline-dopt@nic.in" className="text-blue-400 hover:text-blue-300">helprtionline-dopt@nic.in</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col items-center text-xs text-slate-500">
            <p>Mock Prototype for BuildWhatMovesIndia. Not a real government site.</p>
          </div>
        </div>
      </footer>

      {showCicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Important Notice</h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              The Central Information Commission (CIC) has integrated its Second Appeal Filing Portal with the Department of Personnel and Training (DoPT) RTI Online Portal. Now, while submitting a Second Appeal, appellants can input the First Appeal Registration Number, Email ID and Date of Filing the First Appeal, thereafter, the system will automatically retrieve related details of the RTI Application and First Appeal from the RTI Online Portal. This will ensure a smooth and more streamlined Second Appeal filing process.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCicModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <a 
                href="https://dsscic.nic.in/online-appeal-application/onlineappealapplication/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowCicModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Continue to CIC
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
