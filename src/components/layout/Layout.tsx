import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50 text-slate-900">
      <Navbar />
      <main className="flex-grow flex flex-col relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
