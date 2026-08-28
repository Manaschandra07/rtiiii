
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { User, Mail, Phone, Save, CheckCircle2, Lock, MapPin } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { CustomSelect } from '../../components/ui/CustomSelect';

export const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
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
  
  const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    mail: '',
    username: '',
    gender: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    pinCode: '',
    country: 'India',
    state: '',
    status: '',
    educationalStatus: ''
  });

  const [initialNumber, setInitialNumber] = useState('');
  const [initialMail, setInitialMail] = useState('');

  const [isMobileVerifying, setIsMobileVerifying] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(true);
  const [otpMobile, setOtpMobile] = useState('');

  const [isEmailVerifying, setIsEmailVerifying] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [otpEmail, setOtpEmail] = useState('');

  const [initialFormData, setInitialFormData] = useState<any>(null);

  useEffect(() => {
    if (currentUser) {
      const initData = {
        name: currentUser.name || '',
        number: currentUser.number || '',
        mail: currentUser.mail || '',
        username: currentUser.username || '',
        gender: currentUser.gender || '',
        addressLine1: currentUser.addressLine1 || '',
        addressLine2: currentUser.addressLine2 || '',
        addressLine3: currentUser.addressLine3 || '',
        pinCode: currentUser.pinCode || '',
        country: currentUser.country || 'India',
        state: currentUser.state || '',
        status: currentUser.status || '',
        educationalStatus: currentUser.educationalStatus || ''
      };
      setFormData(initData);
      setInitialFormData(initData);
      setInitialNumber(currentUser.number || '');
      setInitialMail(currentUser.mail || '');
    }
  }, [currentUser]);

  const hasChanges = initialFormData ? JSON.stringify(formData) !== JSON.stringify(initialFormData) : false;

  useEffect(() => {
    if (formData.number !== initialNumber) {
      setIsMobileVerified(false);
      setIsMobileVerifying(false);
    } else {
      setIsMobileVerified(true);
      setIsMobileVerifying(false);
    }
  }, [formData.number, initialNumber]);

  useEffect(() => {
    if (formData.mail !== initialMail) {
      setIsEmailVerified(false);
      setIsEmailVerifying(false);
    } else {
      setIsEmailVerified(true);
      setIsEmailVerifying(false);
    }
  }, [formData.mail, initialMail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gender || !formData.status || !formData.educationalStatus || !formData.state) {
      setError('Please fill all the required fields and select options.');
      return;
    }
    if (!isMobileVerified || !isEmailVerified) {
      setError('Please verify both Mobile Number and Email ID to continue.');
      return;
    }
    updateProfile(formData);
    setInitialNumber(formData.number);
    setInitialMail(formData.mail);
    setInitialFormData(formData);
    setIsSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setError('');
    setTimeout(() => setIsSuccess(false), 3000);
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">My Profile</h1>
        <p className="text-slate-600 text-sm text-center mb-6">All fields marked with * are mandatory.</p>
        
        {error && <div id="error-container" className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
        {isSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-sm font-medium">Profile Updated Successfully</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 border-b pb-2">Basic Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
                <CustomSelect 
    name="gender" 
    value={formData.gender} 
    onChange={(e: any) => setFormData({...formData, gender: e.target.value})} 
    placeholder="Select Gender" 
    required 
    options={[{label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}, {label: 'Transgender', value: 'Transgender'}, {label: 'Prefer not to say', value: 'Prefer not to say'}]} 
  />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Educational Status *</label>
                <CustomSelect 
    name="educationalStatus" 
    value={formData.educationalStatus} 
    onChange={(e: any) => setFormData({...formData, educationalStatus: e.target.value})} 
    placeholder="Select Educational Status" 
    required 
    options={[{label: 'Literate', value: 'Literate'}, {label: 'Illiterate', value: 'Illiterate'}]} 
  />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" disabled value={formData.username} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed outline-none" title="Username cannot be changed" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number *</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="tel" required pattern="\d{10}" maxLength={10} value={formData.number} disabled={isMobileVerified} onChange={e => { const val = e.target.value.replace(/\D/g, ''); setFormData({...formData, number: val}); }} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-50 disabled:text-slate-500 outline-none" placeholder="10-digit mobile number" />
                  </div>
                  {isMobileVerified ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-lg border border-green-200">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <button type="button" onClick={() => { setIsMobileVerified(false); setIsMobileVerifying(false); setOtpMobile(''); }} className="text-sm text-orange-600 hover:underline font-medium">Change</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => formData.number.length === 10 && setIsMobileVerifying(true)} disabled={formData.number.length !== 10} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors outline-none">
                      Verify
                    </button>
                  )}
                </div>
                {isMobileVerifying && !isMobileVerified && (
                  <div className="mt-3 p-4 bg-orange-50 border border-orange-100 rounded-lg">
                    <p className="text-xs text-orange-800 mb-2 font-medium">Since it's a mock website enter any random number it will work.</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input type="text" inputMode="numeric" pattern="\d{6}" maxLength={6} value={otpMobile} onChange={e => setOtpMobile(e.target.value.replace(/\D/g, ''))} className="flex-1 px-3 py-2 text-center tracking-widest border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="6-digit OTP" />
                      <button type="button" onClick={() => otpMobile.length === 6 && setIsMobileVerified(true)} disabled={otpMobile.length !== 6} className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors">Confirm</button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email ID *</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" value={formData.mail} disabled={isEmailVerified} onChange={e => setFormData({...formData, mail: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-slate-50 disabled:text-slate-500 outline-none" placeholder="Email address" />
                  </div>
                  {isEmailVerified ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center px-3 py-2 bg-green-50 text-green-600 rounded-lg border border-green-200">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <button type="button" onClick={() => { setIsEmailVerified(false); setIsEmailVerifying(false); setOtpEmail(''); }} className="text-sm text-orange-600 hover:underline font-medium">Change</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.mail) && setIsEmailVerifying(true)} disabled={!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.mail)} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors outline-none">
                      Verify
                    </button>
                  )}
                </div>
                {isEmailVerifying && !isEmailVerified && (
                  <div className="mt-3 p-4 bg-orange-50 border border-orange-100 rounded-lg">
                    <p className="text-xs text-orange-800 mb-2 font-medium">Since it's a mock website enter any random number it will work.</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input type="text" inputMode="numeric" pattern="\d{6}" maxLength={6} value={otpEmail} onChange={e => setOtpEmail(e.target.value.replace(/\D/g, ''))} className="flex-1 px-3 py-2 text-center tracking-widest border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" placeholder="6-digit OTP" />
                      <button type="button" onClick={() => otpEmail.length === 6 && setIsEmailVerified(true)} disabled={otpEmail.length !== 6} className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors">Confirm</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 border-b pb-2">Address Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1 *</label>
                <input type="text" required value={formData.addressLine1} onChange={e => setFormData({...formData, addressLine1: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="Flat/House No., Building" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 2</label>
                <input type="text" value={formData.addressLine2} onChange={e => setFormData({...formData, addressLine2: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="Street, Locality" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 3</label>
                <input type="text" value={formData.addressLine3} onChange={e => setFormData({...formData, addressLine3: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="Landmark, Area" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Pin Code *</label>
                <input type="text" inputMode="numeric" required pattern="\d{6}" maxLength={6} value={formData.pinCode} onKeyDown={(e) => { if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) e.preventDefault(); }} onChange={e => setFormData({...formData, pinCode: e.target.value.replace(/\D/g, '')})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" placeholder="6-digit Pin Code" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country *</label>
                <div>
                  <input type="text" value="India" disabled className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed outline-none" />
                  
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                <CustomSelect 
                  name="state" 
                  value={formData.state} 
                  onChange={(e: any) => setFormData({...formData, state: e.target.value})} 
                  placeholder="Select State" 
                  required 
                  options={INDIAN_STATES.map(s => ({label: s, value: s}))} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                <CustomSelect 
    name="status" 
    value={formData.status} 
    onChange={(e: any) => setFormData({...formData, status: e.target.value})} 
    placeholder="Select Status" 
    required 
    options={[{label: 'Rural', value: 'Rural'}, {label: 'Urban', value: 'Urban'}]} 
  />
              </div>
            </div>
          </div>
          
          <button type="submit" disabled={!isMobileVerified || !isEmailVerified || !hasChanges} className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-medium py-3 rounded-lg hover:bg-orange-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};
