'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../../lib/types';
import { login as dbLogin, register as dbRegister, getUserById, updateUser, toggleDarkMode, getProviderByUserId } from '../../lib/actions';

interface AuthContextType {
  currentUser: User | null;
  hasApplied: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  // Check provider status if logged in
  useEffect(() => {
    const checkStatus = async () => {
      if (currentUser?.role === UserRole.PROVIDER) {
        const p = await getProviderByUserId(currentUser.id);
        setHasApplied(!!p);
      } else {
        setHasApplied(false);
      }
    };
    checkStatus();
  }, [currentUser]);

  const login = async (email: string, password: string) => {
    const user = await dbLogin(email, password);
    if (user) {
      setCurrentUser(user);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const user = await dbRegister(userData);
    setCurrentUser(user);
    setHasApplied(false);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    setHasApplied(false);
  };

  const updateUser = (user: User) => {
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, hasApplied, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
