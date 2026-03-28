
'use client';

import React, { useState } from 'react';
import { UserRole, User } from '../../lib/types';
import { db } from '../../lib/services/mockDb';
import { LogIn, ShieldCheck, Mail, Lock, Zap, User as UserIcon } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authRole, setAuthRole] = useState<UserRole>(UserRole.CUSTOMER);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    const users = await db.getUsers();
    const user = users.find(u => u.email === authEmail) || {
      id: Math.random().toString(36).substr(2, 9),
      name: authEmail.split('@')[0],
      email: authEmail,
      phone: '555-0199',
      role: authRole,
      darkMode: false
    };
    setTimeout(() => {
      onLogin(user as User);
      setIsAuthLoading(false);
    }, 600);
  };

  return (
    <div className="flex items-center justify-center py-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-sm w-full bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl overflow-hidden border dark:border-gray-700">
        <div className="bg-blue-600 p-8 text-white text-center">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tight">Sign In</h1>
          <p className="text-blue-100 text-xs mt-1 font-medium">Access your All4Home account</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center space-x-1.5 px-1">
              <Mail size={12} />
              <span>Email Address</span>
            </label>
            <input 
              type="email" 
              required
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm font-bold"
              placeholder="you@example.com"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center space-x-1.5 px-1">
              <Lock size={12} />
              <span>Password</span>
            </label>
            <input 
              type="password" 
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm font-bold"
              placeholder="••••••••"
              defaultValue="password"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center space-x-1.5 px-1">
              <UserIcon size={12} />
              <span>User Role</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setAuthRole(role)}
                  className={`py-2 text-[10px] font-black rounded-lg border transition-all ${authRole === role ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50'}`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isAuthLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 mt-4"
          >
            {isAuthLoading ? <Zap className="animate-spin" size={16} /> : <LogIn size={16} />}
            <span>{isAuthLoading ? 'Connecting...' : 'Sign In'}</span>
          </button>

          <div className="pt-2 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Demo Accounts</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">admin@all4home.com | sarah@pro.com</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
