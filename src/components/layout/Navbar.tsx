import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../store/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, resetDemoAccount } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const links = [
    { name: 'Home', path: '/' },
    { name: 'File an RTI', path: '/file' },
    { name: 'Track RTI', path: '/track' },
    { name: 'Appeals', path: '/appeals' },
    { name: 'My RTIs', path: '/dashboard' },
    { name: 'Learn More', path: '/learn' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Help', path: '/help' },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex flex-col">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="National Emblem of India" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-xl font-bold text-slate-900 tracking-tight leading-tight block">RTI Online</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Government of India</span>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {links.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === link.path 
                    ? "text-orange-600 bg-orange-50" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="ml-4 pl-4 border-l border-slate-200 flex items-center gap-3">
              {currentUser ? (
                <>
                  {currentUser?.username === 'tony-stark' && (
                    <button
                      onClick={() => resetDemoAccount?.()}
                      className="hidden md:flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md shadow-sm transition-colors mr-2"
                    >
                      Reset Demo Account
                    </button>
                  )}
                  <div className="relative">
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center justify-center text-slate-700 hover:text-orange-600 p-2 rounded-full hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      title="Account"
                    >
                      <User size={20} />
                    </button>
                    
                    {isProfileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-slate-200">
                          <div className="px-4 py-2 border-b border-slate-100">
                            <p className="text-sm font-medium text-slate-900 truncate">{currentUser.name}</p>
                            <p className="text-xs text-slate-500 truncate">{currentUser.username}</p>
                          </div>
                          <Link 
                            to="/profile" 
                            onClick={() => setIsProfileOpen(false)}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-colors"
                          >
                            My Profile
                          </Link>
                          <button 
                            onClick={() => {
                              handleLogout();
                              setIsProfileOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                  <User size={16} />
                  Login
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-slate-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map(link => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-slate-100 mt-2 pt-2">
              {currentUser ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-orange-600 hover:bg-slate-50">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-orange-600 hover:bg-orange-50">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}




    </nav>
  );
};
