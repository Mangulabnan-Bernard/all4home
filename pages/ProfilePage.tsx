
'use client';

import React, { useState, useEffect } from 'react';
import { User, UserRole, ProviderProfile, VerificationStatus } from '../types';
import { db } from '../services/mockDb';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Briefcase, 
  DollarSign, 
  FileText, 
  Camera, 
  CheckCircle2, 
  Lock, 
  ChevronRight,
  ExternalLink,
  CreditCard,
  AlertCircle
} from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [activeSection, setActiveSection] = useState<'personal' | 'business' | 'security' | 'payouts'>('personal');
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    description: '',
    pricePerHour: 0,
    category: ''
  });

  useEffect(() => {
    const loadProvider = async () => {
      if (user.role === UserRole.PROVIDER) {
        const profile = await db.getProviderByUserId(user.id);
        if (profile) {
          setProviderProfile(profile);
          setFormData(prev => ({
            ...prev,
            description: profile.description,
            pricePerHour: profile.pricePerHour,
            category: profile.category
          }));
        }
      }
    };
    loadProvider();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Update basic user info
      const updatedUser = await db.updateUser(user.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });

      if (updatedUser) {
        onUpdateUser(updatedUser);
      }

      // Update provider profile if applicable
      if (user.role === UserRole.PROVIDER) {
        await db.updateProviderProfile(user.id, {
          description: formData.description,
          pricePerHour: formData.pricePerHour,
          category: formData.category
        });
      }

      setSaveMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const navItems = [
    { id: 'personal', label: 'Personal Details', icon: UserIcon },
    { id: 'security', label: 'Security', icon: Lock },
    ...(user.role === UserRole.PROVIDER ? [
      { id: 'business', label: 'Business Profile', icon: Briefcase },
      { id: 'payouts', label: 'Payouts & Banking', icon: DollarSign }
    ] : [])
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Nav */}
        <div className="lg:w-1/3 space-y-8">
          <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] border dark:border-gray-700 shadow-sm text-center">
            <div className="relative inline-block mb-6">
              <div className="w-28 h-28 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-500/30">
                {user.name.charAt(0)}
              </div>
              <button className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-700 p-2.5 rounded-xl border dark:border-gray-600 shadow-lg text-blue-600 hover:scale-110 transition-transform">
                <Camera size={18} />
              </button>
            </div>
            <h2 className="text-2xl font-black dark:text-white leading-tight">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">{user.role}</p>
            
            {user.role === UserRole.PROVIDER && providerProfile && (
              <div className="mt-6 flex items-center justify-center space-x-2">
                {providerProfile.verified ? (
                  <span className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-xs font-black flex items-center">
                    <ShieldCheck size={14} className="mr-1.5" /> Verified Professional
                  </span>
                ) : (
                  <span className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-full text-xs font-black flex items-center">
                    <AlertCircle size={14} className="mr-1.5" /> Pending Verification
                  </span>
                )}
              </div>
            )}
          </div>

          <nav className="bg-white dark:bg-gray-800 p-4 rounded-[2.5rem] border dark:border-gray-700 shadow-sm space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`
                  w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold
                  ${activeSection === item.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}
                `}
              >
                <div className="flex items-center space-x-4">
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={16} className={activeSection === item.id ? 'opacity-100' : 'opacity-0'} />
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-10 md:p-12 rounded-[3rem] border dark:border-gray-700 shadow-sm">
          <form onSubmit={handleSave} className="space-y-10">
            {activeSection === 'personal' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-2xl font-black dark:text-white mb-2">Personal Information</h3>
                  <p className="text-gray-500">Manage your basic profile details and contact information.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={18} />
                      <input 
                        type="text" 
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white font-bold transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={18} />
                      <input 
                        type="email" 
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white font-bold transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={18} />
                      <input 
                        type="tel" 
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white font-bold transition-all"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl flex items-start space-x-4">
                  <CheckCircle2 className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h5 className="font-bold text-blue-900 dark:text-blue-100">Identity Verified</h5>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Your identity was verified on Jan 12, 2024. Any changes to your name may require re-verification.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-2xl font-black dark:text-white mb-2">Security & Privacy</h3>
                  <p className="text-gray-500">Update your credentials and manage account security settings.</p>
                </div>
                
                <div className="space-y-4">
                  <button type="button" className="w-full flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-2xl hover:border-blue-600 transition-all text-left">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                        <Lock size={20} />
                      </div>
                      <div>
                        <p className="font-bold dark:text-white">Change Password</p>
                        <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </button>
                  
                  <button type="button" className="w-full flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-2xl hover:border-blue-600 transition-all text-left">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="font-bold dark:text-white">Two-Factor Authentication</p>
                        <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Active</p>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'business' && user.role === UserRole.PROVIDER && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-2xl font-black dark:text-white mb-2">Business Profile</h3>
                  <p className="text-gray-500">Showcase your expertise and set your professional rates.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Business Category</label>
                    <select 
                      className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white font-bold transition-all"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="Cleaning">Cleaning & Organization</option>
                      <option value="Plumbing">Plumbing Services</option>
                      <option value="Electrician">Electrical Engineering</option>
                      <option value="Handyman">Handyman & Repairs</option>
                      <option value="Locksmith">Locksmith Services</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Hourly Rate ($)</label>
                    <div className="relative group">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={18} />
                      <input 
                        type="number" 
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white font-bold transition-all"
                        value={formData.pricePerHour}
                        onChange={(e) => setFormData({...formData, pricePerHour: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Professional Bio</label>
                    <textarea 
                      rows={5}
                      className="w-full p-6 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-3xl outline-none focus:ring-2 focus:ring-blue-600 dark:text-white font-bold transition-all resize-none"
                      placeholder="Tell customers about your skills and experience..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="p-10 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-[2.5rem] text-center">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <FileText size={24} />
                  </div>
                  <h4 className="font-bold dark:text-white">Certificates & Licenses</h4>
                  <p className="text-sm text-gray-500 mb-6">Upload your trade licenses to show the "Certified Pro" badge on your profile.</p>
                  <button type="button" className="bg-white dark:bg-gray-700 border dark:border-gray-600 px-8 py-3 rounded-2xl font-bold text-sm hover:border-blue-600 transition-all flex items-center space-x-2 mx-auto">
                    <Camera size={16} />
                    <span>Upload New Doc</span>
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'payouts' && user.role === UserRole.PROVIDER && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-2xl font-black dark:text-white mb-2">Payouts & Banking</h3>
                  <p className="text-gray-500">Securely manage your earnings and connect your bank account via Stripe.</p>
                </div>

                <div className="bg-indigo-600 text-white p-10 rounded-[2.5rem] shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                   <div className="relative z-10">
                      <p className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-2">Available for Withdrawal</p>
                      <h4 className="text-5xl font-black leading-none">$1,248.00</h4>
                      <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button type="button" className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-lg flex items-center justify-center space-x-2">
                           <CreditCard size={18} />
                           <span>Withdraw Funds</span>
                        </button>
                        <button type="button" className="bg-indigo-500/50 backdrop-blur-md text-white border border-indigo-400/50 px-10 py-4 rounded-2xl font-black hover:bg-indigo-500/70 transition-all">
                           View Statement
                        </button>
                      </div>
                   </div>
                   <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 opacity-10 rotate-12">
                      <DollarSign size={240} strokeWidth={3} />
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900/50 border dark:border-gray-700 rounded-3xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center">
                         <img src="https://stripe.com/favicon.ico" className="w-6 h-6" alt="Stripe" />
                      </div>
                      <div>
                        <p className="font-bold dark:text-white">Stripe Connect Status</p>
                        <p className="text-xs text-green-600 font-bold uppercase tracking-widest flex items-center">
                          <CheckCircle2 size={12} className="mr-1" /> Active & Verified
                        </p>
                      </div>
                    </div>
                    <button type="button" className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline flex items-center">
                      Stripe Dashboard <ExternalLink size={14} className="ml-1.5" />
                    </button>
                  </div>

                  <div className="p-6 border dark:border-gray-700 rounded-3xl border-dashed">
                     <p className="text-sm text-gray-500 text-center">Your funds are automatically released from escrow 48 hours after customer confirmation. Bank transfers typically settle in 2-3 business days.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Buttons & Status Messages */}
            <div className="pt-10 border-t dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                {saveMessage && (
                  <div className={`flex items-center space-x-2 font-bold text-sm animate-in slide-in-from-left-4 duration-300 ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {saveMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <span>{saveMessage.text}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <button 
                  type="button"
                  className="px-10 py-4 font-bold text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Update Profile</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
