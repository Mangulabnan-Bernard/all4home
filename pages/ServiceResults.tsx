
'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { ProviderProfile, User } from '../types';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Award, 
  MessageSquare, 
  ChevronRight, 
  Info,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  TrendingDown,
  Zap
} from 'lucide-react';

interface ServiceResultsProps {
  serviceName: string;
  categoryName: string;
  onNavigate: (page: string, providerId?: string) => void;
}

const ServiceResults: React.FC<ServiceResultsProps> = ({ serviceName, categoryName, onNavigate }) => {
  const [pros, setPros] = useState<ProviderProfile[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [activeFilter, setActiveFilter] = useState('relevance');

  useEffect(() => {
    const load = async () => {
      const allPros = await db.getProviders();
      const allUsers = await db.getUsers();
      
      const filtered = allPros.filter(p => p.category === categoryName || p.category === 'Cleaning'); 
      setPros(filtered);

      const userMap = allUsers.reduce((acc, u) => ({ ...acc, [u.id]: u }), {});
      setUsers(userMap);
    };
    load();
  }, [categoryName]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-500">
      
      {/* Header & Filter Bar */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black dark:text-white tracking-tighter">
                {serviceName}s in Los Angeles
              </h2>
              <p className="text-xl text-gray-500 font-medium">Verified professionals ready to start today.</p>
           </div>
           <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl border dark:border-gray-700 shadow-sm flex items-center space-x-2">
              <div className="px-4 py-2 text-xs font-black text-gray-400 uppercase tracking-widest flex items-center">
                 <Filter size={14} className="mr-2" /> Sort By
              </div>
              {[
                { id: 'relevance', label: 'Recommended' },
                { id: 'rating', label: 'Top Rated' },
                { id: 'price', label: 'Lowest Price' }
              ].map(f => (
                <button 
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeFilter === f.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  {f.label}
                </button>
              ))}
           </div>
        </div>

        {/* Dynamic Category Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { label: 'Market Average', val: '$35 - $65 / hr', icon: TrendingDown },
             { label: 'Pro Availability', val: 'High (12 Pros)', icon: Clock },
             { label: 'Satisfaction Rate', val: '4.92 / 5.0', icon: Star }
           ].map((stat, i) => (
             <div key={i} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border dark:border-gray-700 flex items-center space-x-4">
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                   <stat.icon size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                   <p className="text-sm font-black dark:text-white tracking-tight">{stat.val}</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Results List */}
      <section className="space-y-10">
        <div className="space-y-8">
          {pros.map((pro, index) => {
            const user = users[pro.userId];
            return (
              <div key={pro.id} className="group bg-white dark:bg-gray-800 rounded-[3rem] border-2 dark:border-gray-700 shadow-sm hover:shadow-2xl hover:border-blue-500/50 transition-all duration-500 p-10 flex flex-col md:flex-row gap-10">
                
                {/* Visuals */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="relative">
                    <img 
                      src={`https://i.pravatar.cc/150?u=${pro.id}`} 
                      className="w-32 h-32 rounded-[2.5rem] object-cover shadow-xl ring-8 ring-gray-50 dark:ring-gray-900 group-hover:scale-105 transition-transform duration-500" 
                      alt={user?.name} 
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-2xl shadow-xl border-4 border-white dark:border-gray-800">
                      <ShieldCheck size={20} />
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col items-center">
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em]">Verified Pro</span>
                    <div className="mt-2 flex items-center text-yellow-500 font-black">
                       <Star size={16} fill="currentColor" className="mr-1" />
                       <span>{pro.rating || '4.9'}</span>
                    </div>
                  </div>
                </div>

                {/* Information */}
                <div className="flex-1 space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                      <h4 className="text-3xl font-black dark:text-white tracking-tight">
                        {user?.name || 'Local Pro'}
                      </h4>
                      <p className="text-lg text-gray-500 dark:text-gray-400 font-medium mt-1">Specializes in {categoryName}</p>
                    </div>
                    <div className="flex flex-col items-end">
                       <p className="text-3xl font-black text-green-600 dark:text-green-500 tracking-tight">${pro.pricePerHour}<span className="text-sm text-gray-400 font-bold">/hr</span></p>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Transparent Pricing</p>
                    </div>
                  </div>

                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium line-clamp-2">
                    "{pro.description}"
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                     <button 
                       onClick={() => onNavigate('public-profile', pro.id)}
                       className="bg-blue-600 text-white px-10 py-4.5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 text-lg"
                      >
                        Check Availability
                     </button>
                     <button 
                       onClick={() => onNavigate('public-profile', pro.id)}
                       className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 dark:border-gray-700 px-10 py-4.5 rounded-2xl font-black hover:bg-gray-50 transition-all text-lg"
                      >
                        View Details
                     </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust Quote */}
      <section className="bg-slate-900 text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
             <Zap size={32} fill="white" />
          </div>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-8">
            "We check IDs so you don't have to."
          </h3>
          <p className="text-xl text-slate-400 font-medium mb-10 leading-relaxed">
            Every All4Home professional completes a rigorous 3-step verification process before they can accept a single job.
          </p>
          <div className="flex items-center space-x-6">
             <div className="flex -space-x-3">
                {[1, 2, 3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-12 h-12 rounded-full border-4 border-slate-900 shadow-xl" />)}
             </div>
             <p className="text-sm font-black uppercase tracking-widest">Join 4,000+ Verified Pros</p>
          </div>
        </div>
        <div className="absolute right-[-10%] bottom-[-10%] text-[24rem] font-black text-white/[0.03] select-none pointer-events-none">
          SAFETY
        </div>
      </section>

    </div>
  );
};

export default ServiceResults;
