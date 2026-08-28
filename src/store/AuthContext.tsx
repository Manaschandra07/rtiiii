import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setupDemoUser, DEMO_USERNAME } from '../utils/demoUser';

export interface User {
  id: string;
  name: string;
  number: string;
  mail: string;
  username: string;
  password?: string; // stored in local storage, but carefully handled
  gender?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  pinCode?: string;
  country?: string;
  state?: string;
  status?: string;
  educationalStatus?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (usernameOrEmail: string, pass: string, remember: boolean) => { success: boolean; error?: string };
  register: (user: Omit<User, 'id'>) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updatedUser: Partial<User>) => void;
  resetPassword: (usernameOrEmail: string, newPass: string) => { success: boolean; error?: string };
  checkUserExists: (usernameOrEmail: string) => boolean;
  resetDemoAccount?: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const sessionUserId = typeof window !== 'undefined' ? sessionStorage.getItem('activeUserId') : null;
    const localUserId = typeof window !== 'undefined' ? localStorage.getItem('activeUserId') : null;
    const activeId = sessionUserId || localUserId;
        
    if (activeId) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === activeId);
      if (user) {
        const { password, ...safeUser } = user;
        return safeUser as User;
      }
    }
    return null;
  });

  const login = (usernameOrEmail: string, pass: string, remember: boolean) => {
    if (usernameOrEmail === DEMO_USERNAME && pass === 'tony-stark') {
      setupDemoUser();
    }
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => (u.username === usernameOrEmail || u.mail === usernameOrEmail) && u.password === pass);
    
    if (user) {
      const { password, ...safeUser } = user;
      setCurrentUser(safeUser);
      
      if (remember) {
        localStorage.setItem('activeUserId', user.id);
        sessionStorage.removeItem('activeUserId'); // Clean up session
      } else {
        sessionStorage.setItem('activeUserId', user.id);
        localStorage.removeItem('activeUserId'); // Clean up local
      }

      // Legacy Data Migration
      const legacyRtis = localStorage.getItem('myRTIs');
      const legacyApps = localStorage.getItem('applications');
      if (legacyRtis || legacyApps) {
        let existingData: Record<string, any> = {};
        const currentDataStr = localStorage.getItem(`userData_${user.id}`);
        if (currentDataStr) {
          try { existingData = JSON.parse(currentDataStr); } catch (e) {}
        }
        
        let migratedApplications: any[] = [];
        try {
          if (legacyRtis) migratedApplications = JSON.parse(legacyRtis);
          else if (legacyApps) migratedApplications = JSON.parse(legacyApps);
        } catch (e) {}
        
        // Merge or set migrated applications if no current apps exist
        if (!existingData.applications || existingData.applications.length === 0) {
          existingData.applications = migratedApplications;
          localStorage.setItem(`userData_${user.id}`, JSON.stringify(existingData));
        }

        // Clean up legacy keys
        localStorage.removeItem('myRTIs');
        localStorage.removeItem('applications');
      }

      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const register = (newUser: Omit<User, 'id'>) => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.some(u => u.username === newUser.username || u.mail === newUser.mail)) {
      return { success: false, error: 'Username or email already exists' };
    }
    
    const id = Date.now().toString();
    const userWithId = { ...newUser, id };
    
    users.push(userWithId);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('activeUserId');
    sessionStorage.removeItem('activeUserId');
  };

  const updateProfile = (updatedDetails: Partial<User>) => {
    if (!currentUser) return;
    
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      // Merge updates
      users[userIndex] = { ...users[userIndex], ...updatedDetails };
      localStorage.setItem('users', JSON.stringify(users));
      
      const { password, ...safeUser } = users[userIndex];
      setCurrentUser(safeUser);
    }
  };


  const resetDemoAccount = () => {
    if (currentUser?.username === DEMO_USERNAME) {
      setupDemoUser();
      window.location.reload();
    }
  };

  const checkUserExists = (usernameOrEmail: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(u => u.username === usernameOrEmail || u.mail === usernameOrEmail);
  };

  const resetPassword = (usernameOrEmail: string, newPass: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.username === usernameOrEmail || u.mail === usernameOrEmail);
    
    if (userIndex !== -1) {
      users[userIndex].password = newPass;
      localStorage.setItem('users', JSON.stringify(users));
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, updateProfile, resetPassword, checkUserExists, resetDemoAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
