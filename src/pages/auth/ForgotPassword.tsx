import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export const ForgotPassword = () => {
  const { checkUserExists, resetPassword } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkUserExists(email)) {
      setError('');
      setStep(2);
    } else {
      setError('User not found');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const result = resetPassword(email, newPassword);
    if (result.success) {
      setError('');
      setStep(4);
    } else {
      setError(result.error || 'Failed to reset password');
    }
  };

  if (step === 4) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Password Reset Successful</h1>
          <p className="text-slate-600 mb-6">Your password has been successfully updated. You can now login with your new password.</p>
          <Link to="/login" className="block w-full bg-orange-600 text-white font-medium py-2.5 rounded-lg hover:bg-orange-700 transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Forgot Password</h1>
        <p className="text-slate-600 text-sm text-center mb-6">All fields marked with * are mandatory.</p>
        {error && <div id="error-container" className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}
        
        {step === 1 && (
          <>
            <p className="text-slate-600 mb-6 text-center text-sm">Enter your registered email address or username to receive a password reset OTP.</p>
            <form onSubmit={handleSendOtp} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username / Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="Enter your username or email"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-orange-600 text-white font-medium py-2.5 rounded-lg hover:bg-orange-700 transition-colors">
                Send OTP
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-slate-600 mb-4 text-center text-sm">We've sent a 6-digit OTP to your registered email address.</p>
            <div className="mb-6 p-3 bg-orange-50 border border-orange-100 rounded-lg">
              <p className="text-xs text-orange-800 text-center font-medium">Since it's a mock website enter any random number it will work.</p>
            </div>
            <form onSubmit={handleVerifyOtp} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Enter OTP *</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    pattern="\d{6}"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => { if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) e.preventDefault(); }}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-center tracking-[0.5em] font-medium outline-none"
                    placeholder="000000"
                  />
                </div>
              </div>
              <button type="submit" disabled={otp.length !== 6} className="w-full bg-orange-600 text-white font-medium py-2.5 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Verify OTP
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-slate-600 mb-6 text-center text-sm">Please enter your new password below.</p>
            <form onSubmit={handleResetPassword} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text" style={{ WebkitTextSecurity: "disc" }} autoComplete="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text" style={{ WebkitTextSecurity: "disc" }} autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button type="submit" className="w-full bg-orange-600 text-white font-medium py-2.5 rounded-lg hover:bg-orange-700 transition-colors mt-2">
                Reset Password
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-center text-sm text-slate-600">
          Remember your password? <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};
