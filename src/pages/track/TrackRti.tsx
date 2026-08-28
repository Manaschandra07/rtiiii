import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRtiContext } from '../../store/RtiContext';
import { Search, ArrowRight, AlertCircle } from 'lucide-react';

export const TrackRti = () => {
  const [regNumber, setRegNumber] = useState('');
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
  const navigate = useNavigate();
  const { applications } = useRtiContext();

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
      // Format ID for URL by replacing slashes with dashes (e.g. HIGHE-R-E-26-04821)
      const urlId = foundRti.id.replace(/\//g, '-');
      navigate(`/dashboard/${urlId}`);
    } else {
      setError('No RTI application found with this registration number.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col min-h-[60vh] justify-center">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[#06038D] px-8 py-10 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Search className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Track RTI Application</h1>
          <p className="text-blue-50">Enter your Registration Number to check the current status.</p>
        </div>

        <div className="p-8 md:p-12">
          <form onSubmit={handleTrack} className="max-w-md mx-auto">
            {error && (
              <div id="error-container" className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start text-sm border border-red-100">
                <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="regNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                Registration Number
              </label>
              <input
                type="text"
                id="regNumber"
                value={regNumber}
                onChange={(e) => {
                  setRegNumber(e.target.value.toUpperCase());
                  if (error) setError('');
                }}
                className="w-full border-slate-300 rounded-lg shadow-sm focus:border-[#06038D] focus:ring focus:ring-[#06038D]/30 focus:ring-opacity-50 px-4 py-3 outline-none"
                placeholder="e.g. HIGHE/R/E/26/04821"
              />
              <p className="mt-2 text-xs text-slate-500">
                Format: <span className="font-mono">AAAAA/B/C/DD/EEEEE</span> (e.g., HIGHE/R/E/26/04821)
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#06038D] hover:bg-[#06038D]/90 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors focus:ring-4 focus:ring-[#06038D]/30"
            >
              Check Status
            </button>
            
            <p className="text-xs text-center text-slate-500 mt-6">
              Note: You can also track and manage all your applications from the <button type="button" onClick={() => navigate('/dashboard')} className="text-[#06038D] hover:underline font-medium">My RTIs</button> dashboard.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
