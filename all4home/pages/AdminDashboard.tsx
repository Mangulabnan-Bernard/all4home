
import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { ProviderProfile, VerificationStatus, BookingStatus, UserRole, User } from '../types';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle, 
  XCircle,
  Shield,
  Search,
  ExternalLink,
  Info,
  ChevronDown,
  ChevronUp,
  Award,
  FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', bookings: 40 },
  { name: 'Tue', bookings: 30 },
  { name: 'Wed', bookings: 65 },
  { name: 'Thu', bookings: 45 },
  { name: 'Fri', bookings: 90 },
  { name: 'Sat', bookings: 75 },
  { name: 'Sun', bookings: 55 },
];

const AdminDashboard: React.FC = () => {
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [activeTab, setActiveTab] = useState<'approvals' | 'disputes'>('approvals');
  const [expandedPro, setExpandedPro] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const p = await db.getProviders();
      setProviders(p);
      const u = await db.getUsers();
      setUsers(u.reduce((acc, user) => ({ ...acc, [user.id]: user }), {}));
    };
    load();
  }, []);

  const handleApprove = async (id: string) => {
    await db.approveProvider(id);
    const p = await db.getProviders();
    setProviders(p);
    // Note: In real app, we'd trigger a notification service here
  };

  const pendingProviders = providers.filter(p => p.verificationStatus === VerificationStatus.PENDING);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', val: '$12,450', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
          { label: 'Total Users', val: '1,284', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Active Disputes', val: '4', icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
          { label: 'Pending Pros', val: pendingProviders.length.toString(), icon: Shield, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest leading-none">{stat.label}</p>
            <h4 className="text-2xl font-black dark:text-white mt-2 tracking-tight">{stat.val}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] border dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black dark:text-white tracking-tight">Booking Velocity</h3>
              <p className="text-sm text-gray-500 font-medium">Platform activity trends</p>
            </div>
            <div className="flex bg-gray-50 dark:bg-gray-900/50 p-1 rounded-2xl border dark:border-gray-700">
               <button className="px-6 py-2 bg-white dark:bg-gray-700 shadow-sm rounded-xl text-xs font-bold dark:text-white">WEEK</button>
               <button className="px-6 py-2 text-xs font-bold text-gray-400">MONTH</button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 700}} />
                <Tooltip cursor={{fill: 'rgba(59, 130, 246, 0.05)'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="bookings" fill="#2563EB" radius={[8, 8, 8, 8]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-8 tracking-tight">Audit Log</h3>
            <div className="space-y-8">
              {[
                { title: 'Sarah Johnson Applied', desc: 'New Cleaning dossier received.', time: '2m ago', color: 'bg-blue-500' },
                { title: 'Escrow Release', desc: 'Job #7432 completed by John D.', time: '45m ago', color: 'bg-green-500' },
                { title: 'ID Verification Fault', desc: 'Invalid document on Application #912.', time: '2h ago', color: 'bg-red-500' },
              ].map((alert, i) => (
                <div key={i} className="flex space-x-6">
                  <div className={`w-3 h-3 rounded-full mt-2 ring-8 ring-white/5 ${alert.color}`} />
                  <div className="flex-1">
                    <h5 className="font-black text-sm">{alert.title}</h5>
                    <p className="text-gray-400 text-xs mt-1 font-medium leading-relaxed">{alert.desc}</p>
                    <p className="text-[10px] text-gray-500 mt-2 font-black uppercase tracking-widest">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-12 py-4 bg-white/10 hover:bg-white/20 transition-all rounded-2xl font-black text-xs uppercase tracking-widest">
              Full System Monitor
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[3rem] border dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="flex border-b dark:border-gray-700">
          <button 
            onClick={() => setActiveTab('approvals')}
            className={`px-10 py-8 font-black text-sm transition-all border-b-4 ${activeTab === 'approvals' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
          >
            Review Queue ({pendingProviders.length})
          </button>
          <button 
            onClick={() => setActiveTab('disputes')}
            className={`px-10 py-8 font-black text-sm transition-all border-b-4 ${activeTab === 'disputes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
          >
            Resolution Center (4)
          </button>
        </div>

        <div className="p-10">
          {activeTab === 'approvals' ? (
            <div className="space-y-6">
              {pendingProviders.length === 0 ? (
                <div className="text-center py-20">
                  <CheckCircle size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-500 font-bold">Queue is empty. All pros are verified!</p>
                </div>
              ) : (
                pendingProviders.map((pro) => {
                  const user = users[pro.userId];
                  const isExpanded = expandedPro === pro.id;
                  return (
                    <div key={pro.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] border dark:border-gray-700 transition-all overflow-hidden group">
                      <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
                            {user?.name.charAt(0)}
                          </div>
                          <div>
                            <h5 className="text-xl font-black dark:text-white leading-none mb-2">{user?.name}</h5>
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{pro.category} • ${pro.pricePerHour}/hr</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => setExpandedPro(isExpanded ? null : pro.id)}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl border dark:border-gray-600 text-gray-500 hover:text-blue-600 transition-all"
                          >
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                          <button 
                            onClick={() => handleApprove(pro.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-black shadow-lg shadow-blue-500/20"
                          >
                            Approve Pro
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-8 pb-8 pt-4 space-y-8 animate-in slide-in-from-top-4 duration-300">
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                              <div className="space-y-4">
                                 <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Professional Dossier</h6>
                                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium bg-white dark:bg-gray-800 p-6 rounded-2xl border dark:border-gray-700 italic">
                                    "{pro.description}"
                                 </p>
                              </div>
                              <div className="space-y-4">
                                 <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification Assets</h6>
                                 <div className="flex flex-wrap gap-3">
                                    <a href={pro.idDocumentUrl} target="_blank" className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border dark:border-gray-700 flex items-center space-x-2 text-xs font-bold hover:border-blue-500 transition-all">
                                       <FileText size={16} className="text-blue-600" />
                                       <span>Government ID</span>
                                       <ExternalLink size={12} className="opacity-50" />
                                    </a>
                                    {pro.certificateUrls.map((cert, i) => (
                                       <a key={i} href={cert} target="_blank" className="bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border dark:border-gray-700 flex items-center space-x-2 text-xs font-bold hover:border-blue-500 transition-all">
                                          <Award size={16} className="text-blue-600" />
                                          <span>Certificate #{i+1}</span>
                                          <ExternalLink size={12} className="opacity-50" />
                                       </a>
                                    ))}
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex justify-end pt-4 space-x-4">
                              <button className="flex items-center space-x-2 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 px-6 py-3 rounded-xl transition-all">
                                 <XCircle size={16} />
                                 <span>Flag & Reject</span>
                              </button>
                           </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          ) : (
            <div className="text-center py-20 space-y-6">
              <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900/40 rounded-[2rem] flex items-center justify-center mx-auto text-gray-300">
                <AlertTriangle size={48} />
              </div>
              <h4 className="font-black dark:text-white text-3xl tracking-tight">Zero Disputes</h4>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-lg leading-relaxed font-medium">
                The platform is currently operating smoothly. All escrow release conditions are being met via dual-confirmation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
