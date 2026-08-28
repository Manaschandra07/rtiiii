import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(username, password, rememberMe);
    if (result.success) {
      setIsSuccess(true);
      setError('');
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Login Successful</h1>
          <p className="text-slate-600 mb-6">You have successfully logged into your account.</p>
          <button onClick={() => navigate(from)} className="block w-full bg-orange-600 text-white font-medium py-2.5 rounded-lg hover:bg-orange-700 transition-colors">
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Login to your account</h1>
        <p className="text-slate-600 text-sm text-center mb-6">All fields marked with * are mandatory.</p>
        {error && <div id="error-container" className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username / Email *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="Enter your username"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text" style={{ WebkitTextSecurity: "disc" }} autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 outline-none" />
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-600">Remember me</label>
            </div>
            <Link to="/forgot-password" className="text-sm font-medium text-orange-600 hover:text-orange-500">Forgot password?</Link>
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white font-medium py-2.5 rounded-lg hover:bg-orange-700 transition-colors">
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-600">
          Don't have an account? <Link to="/register" state={{ from: location.state?.from }} className="font-medium text-orange-600 hover:text-orange-500">Create new account</Link>
        </div>
      </div>
    </div>
  );
};
