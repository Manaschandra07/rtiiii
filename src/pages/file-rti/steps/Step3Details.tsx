import React, { useState, useEffect, useRef } from 'react';
import { useSessionStorage } from '../../../hooks/useSessionStorage';
import { ArrowLeft, ArrowRight, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { CustomSelect } from '../../../components/ui/CustomSelect';
import { RtiDraft, UserDetails } from '../../../types';
import { useAuth } from '../../../store/AuthContext';

interface Props {
  draft: RtiDraft;
  updateDraft: (data: Partial<RtiDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}


export const Step3Details = ({ draft, updateDraft, onNext, onBack }: Props) => {
  const { currentUser } = useAuth();
  const [details, setDetails] = useState<UserDetails>(draft.applicant || {
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    state: '',
    pinCode: '',
    isBpl: false,
    gender: '',
    country: '',
    status: '',
    educationalStatus: ''
  });

    const [isMobileVerifying, setIsMobileVerifying] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useSessionStorage('rti_wizard_mob_verified', !!draft.applicant?.mobile);
  const [otpMobile, setOtpMobile] = useState('');

  const [isEmailVerifying, setIsEmailVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useSessionStorage('rti_wizard_email_verified', !!draft.applicant?.email);
  const [otpEmail, setOtpEmail] = useState('');

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
  
  const [promptAutofill, setPromptAutofill] = useState(!!currentUser && !draft.applicant);

  const autofillTimeRef = useRef<number>(0);

  const handleAutofill = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentUser) {
      setDetails({
        fullName: currentUser.name || '',
        email: currentUser.mail || '',
        mobile: currentUser.number || '',
        address: [currentUser.addressLine1, currentUser.addressLine2, currentUser.addressLine3].filter(Boolean).join(', ') || '',
        state: currentUser.state || '',
        pinCode: currentUser.pinCode || '',
        isBpl: false,
        gender: currentUser.gender || '',
        country: currentUser.country || '',
        status: currentUser.status || '',
        educationalStatus: currentUser.educationalStatus || ''
      });
      setIsMobileVerified(false);
      setIsEmailVerified(false);
    }
    autofillTimeRef.current = Date.now();
    setPromptAutofill(false);
  };

  const handleManual = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    autofillTimeRef.current = Date.now();
    setPromptAutofill(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleBack = () => {
    updateDraft({ applicant: details });
    onBack();
  };

    useEffect(() => {
    updateDraft({ applicant: details });
  }, [details]);
  const handleNext = () => {
    if (Date.now() - autofillTimeRef.current < 1000) {
      return;
    }
    if (!isMobileVerified || !isEmailVerified) {
      setError('Please verify both Mobile Number and Email Address to continue.');
      return;
    }
    setError('');
    updateDraft({ applicant: details });
    onNext();
  };

  if (promptAutofill) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6">
          <RefreshCw className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">Autofill your details?</h2>
        <p className="text-slate-600 mb-8 max-w-md">
          We noticed you are logged in. Would you like to fetch data from your account and autofill the form, or enter all the data manually?
        </p>
        <div className="flex gap-4">
          <button type="button" onClick={handleManual} className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors outline-none">
            Enter Manually
          </button>
          <button type="button" onClick={handleAutofill} className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 shadow-sm transition-colors">
            Autofill Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Tell us about yourself</h2>
        <p className="text-slate-600 mt-2">All fields marked with * are mandatory. Must be an Indian Citizen.</p>
      </div>
      {error && <div id="error-container" className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

      <form id="step3form" onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="flex-grow space-y-6 pb-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
            <input type="text" name="fullName" value={details.fullName} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number *</label>
              <>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input type="tel" name="mobile" pattern="\d{10}" maxLength={10} value={details.mobile} disabled={isMobileVerified} onChange={(e) => { e.target.value = e.target.value.replace(/\D/g, ""); handleChange(e); }} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none disabled:bg-slate-50 disabled:text-slate-500" placeholder="10-digit mobile number" required />
                  {isMobileVerified ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-lg border border-green-200">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <button type="button" onClick={() => { setIsMobileVerified(false); setIsMobileVerifying(false); setOtpMobile(''); }} className="text-sm text-orange-600 hover:underline font-medium">Change</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => { setOtpMobile(''); if (details.mobile.length === 10) setIsMobileVerifying(true); }} disabled={details.mobile.length !== 10} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors outline-none">
                      Verify
                    </button>
                  )}
                </div>
                {isMobileVerifying && !isMobileVerified && (
                  <div className="mt-3 p-4 bg-orange-50 border border-orange-100 rounded-lg">
                    <p className="text-xs text-orange-800 mb-2 font-medium">Since it's a mock website enter any random number it will work.</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input type="text" inputMode="numeric" pattern="\d{6}" maxLength={6} value={otpMobile} onKeyDown={(e) => { if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) e.preventDefault(); }} onChange={e => setOtpMobile(e.target.value.replace(/\D/g, ''))} className="flex-1 px-3 py-2 text-center tracking-widest border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="6-digit OTP" />
                      <button type="button" onClick={() => otpMobile.length === 6 && setIsMobileVerified(true)} disabled={otpMobile.length !== 6} className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors">Confirm</button>
                    </div>
                  </div>
                )}
              </>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
            <>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="email" name="email" pattern=".*@.*\.com$" value={details.email} disabled={isEmailVerified} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none disabled:bg-slate-50 disabled:text-slate-500" required />
                {isEmailVerified ? (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-lg border border-green-200">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <button type="button" onClick={() => { setIsEmailVerified(false); setIsEmailVerifying(false); setOtpEmail(''); }} className="text-sm text-orange-600 hover:underline font-medium">Change</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => { setOtpEmail(''); if (details.email.includes('@') && details.email.endsWith('.com')) setIsEmailVerifying(true); }} disabled={!details.email.includes('@') || !details.email.endsWith('.com')} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors outline-none">
                    Verify
                  </button>
                )}
              </div>
              {isEmailVerifying && !isEmailVerified && (
                <div className="mt-3 p-4 bg-orange-50 border border-orange-100 rounded-lg">
                  <p className="text-xs text-orange-800 mb-2 font-medium">Since it's a mock website enter any random number it will work.</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                                        <input type="text" inputMode="numeric" pattern="\d{6}" maxLength={6} value={otpEmail} onKeyDown={(e) => { if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) e.preventDefault(); }} onChange={e => setOtpEmail(e.target.value.replace(/\D/g, ''))} className="flex-1 px-3 py-2 text-center tracking-widest border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="6-digit OTP" />
                    <button type="button" onClick={() => otpEmail.length === 6 && setIsEmailVerified(true)} disabled={otpEmail.length !== 6} className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors">Confirm</button>
                    </div>
                </div>
              )}
            </>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Gender *</label>
            <CustomSelect name="gender" value={details.gender} onChange={handleChange} placeholder="Select Gender" required options={[{label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}, {label: 'Transgender', value: 'Transgender'}, {label: 'Prefer not to say', value: 'Prefer not to say'}]} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Educational Status *</label>
            <CustomSelect name="educationalStatus" value={details.educationalStatus} onChange={handleChange} placeholder="Select Educational Status" required options={[{label: 'Literate', value: 'Literate'}, {label: 'Illiterate', value: 'Illiterate'}]} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Complete Address *</label>
          <input type="text" name="address" value={details.address} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
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
            <CustomSelect name="state" value={details.state} onChange={handleChange} placeholder="Select State" required options={[{"label":"Andhra Pradesh","value":"Andhra Pradesh"},{"label":"Arunachal Pradesh","value":"Arunachal Pradesh"},{"label":"Assam","value":"Assam"},{"label":"Bihar","value":"Bihar"},{"label":"Chhattisgarh","value":"Chhattisgarh"},{"label":"Goa","value":"Goa"},{"label":"Gujarat","value":"Gujarat"},{"label":"Haryana","value":"Haryana"},{"label":"Himachal Pradesh","value":"Himachal Pradesh"},{"label":"Jharkhand","value":"Jharkhand"},{"label":"Karnataka","value":"Karnataka"},{"label":"Kerala","value":"Kerala"},{"label":"Madhya Pradesh","value":"Madhya Pradesh"},{"label":"Maharashtra","value":"Maharashtra"},{"label":"Manipur","value":"Manipur"},{"label":"Meghalaya","value":"Meghalaya"},{"label":"Mizoram","value":"Mizoram"},{"label":"Nagaland","value":"Nagaland"},{"label":"Odisha","value":"Odisha"},{"label":"Punjab","value":"Punjab"},{"label":"Rajasthan","value":"Rajasthan"},{"label":"Sikkim","value":"Sikkim"},{"label":"Tamil Nadu","value":"Tamil Nadu"},{"label":"Telangana","value":"Telangana"},{"label":"Tripura","value":"Tripura"},{"label":"Uttar Pradesh","value":"Uttar Pradesh"},{"label":"Uttarakhand","value":"Uttarakhand"},{"label":"West Bengal","value":"West Bengal"},{"label":"Andaman and Nicobar Islands","value":"Andaman and Nicobar Islands"},{"label":"Chandigarh","value":"Chandigarh"},{"label":"Dadra and Nagar Haveli and Daman and Diu","value":"Dadra and Nagar Haveli and Daman and Diu"},{"label":"Delhi","value":"Delhi"},{"label":"Jammu and Kashmir","value":"Jammu and Kashmir"},{"label":"Ladakh","value":"Ladakh"},{"label":"Lakshadweep","value":"Lakshadweep"},{"label":"Puducherry","value":"Puducherry"}]} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">PIN Code *</label>
            <input type="text" name="pinCode" pattern="\d{6}" maxLength={6} value={details.pinCode} onChange={(e) => { e.target.value = e.target.value.replace(/\D/g, ""); handleChange(e); }} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="6-digit PIN code" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Status (Rural/Urban) *</label>
            <CustomSelect name="status" value={details.status} onChange={handleChange} placeholder="Select Status" required options={[{label: 'Rural', value: 'Rural'}, {label: 'Urban', value: 'Urban'}]} />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
           <label className="flex items-start gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <input type="checkbox" name="isBpl" checked={details.isBpl} onChange={handleChange} className="mt-1 w-5 h-5 text-orange-500 focus:ring-orange-500 border-slate-300 rounded outline-none" />
              <div>
                <span className="block font-semibold text-slate-900">I am a Below Poverty Line (BPL) applicant</span>
                <span className="block text-sm text-slate-500 mt-1">No RTI fee is required to be paid by any citizen who is below poverty line as per RTI Rules, 2012. You will be required to upload a valid BPL certificate in the next step.</span>
              </div>
           </label>
        </div>

      </form>
      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
        <button onClick={handleBack} type="button" className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button type="submit" form="step3form" className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all">
          Save & Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
