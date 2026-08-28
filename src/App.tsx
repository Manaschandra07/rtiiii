import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { FileRtiWizard } from './pages/file-rti/FileRtiWizard';
import { MyRtis } from './pages/dashboard/MyRtis';
import { RtiStatus } from './pages/dashboard/RtiStatus';
import { LearnRti } from './pages/info/LearnRti';
import { Help } from './pages/info/Help';
import { Faq } from './pages/info/Faq';
import { Policy } from './pages/info/Policy';
import { TrackRti } from './pages/track/TrackRti';
import { Appeals } from './pages/appeals/Appeals';
import { RtiProvider } from './store/RtiContext';
import { AuthProvider } from './store/AuthContext';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Profile } from './pages/auth/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';

import { ScrollToTop } from './components/ScrollToTop';

// Placeholders for other routes
const Placeholder = ({ title }: { title: string }) => <div className="p-12 text-center text-2xl font-bold">{title}</div>;

export default function App() {
  return (
    <AuthProvider>
      <RtiProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/file" element={<ProtectedRoute><FileRtiWizard /></ProtectedRoute>} />
            <Route path="/appeals" element={<ProtectedRoute><Appeals /></ProtectedRoute>} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              <Route path="track" element={<ProtectedRoute><TrackRti /></ProtectedRoute>} />
              <Route path="dashboard" element={<ProtectedRoute><MyRtis /></ProtectedRoute>} />
              <Route path="dashboard/:id" element={<ProtectedRoute><RtiStatus /></ProtectedRoute>} />
              <Route path="learn" element={<LearnRti />} />
              <Route path="faq" element={<Faq />} />
              <Route path="help" element={<Help />} />
              <Route path="policy" element={<Policy />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </RtiProvider>
    </AuthProvider>
  );
}
