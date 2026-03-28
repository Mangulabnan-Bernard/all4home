
'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { ServiceCategory, ProviderProfile, User } from '../types';
import Carousel from '../components/Carousel';
import { 
  Star, 
  MapPin, 
  Zap, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Award,
  Users,
  TrendingUp,
  Clock,
  Navigation,
  Check,
  ChevronRight,
  Shield,
  PhoneCall,
  Activity
} from 'lucide-react';

interface CustomerDashboardProps {
  onNavigate: (page: string, providerId?: string) => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [featuredPro, setFeaturedPro] = useState<{pro: ProviderProfile, user: User} | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [onlineCount, setOnlineCount] = useState(124);

  useEffect(() => {
    const fetchData = async () => {
      const cats = await db.getCategories();
      setCategories(cats);
      
      const pros = await db.getProviders();
      const users = await db.getUsers();
      if (pros.length > 0) {
        const pro = pros[0];
        const user = users.find(u => u.id === pro.userId);
        if (user) setFeaturedPro({ pro, user });
      }
    };
    fetchData();

    const interval = setInterval(() => {
      setOnlineCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAiAsk = async () => {
    if (!searchQuery) return;
    setIsAiLoading(true);
    // Simple recommendation logic without AI
    const rec = `Based on your search for "${searchQuery}", I recommend looking through our ${categories.length > 0 ? categories.map(c => c.name).join(', ') : 'available'} categories for the best match!`;
    setAiRecommendation(rec);
    setIsAiLoading(false);
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      
      {/* 1. Dynamic Hero Section */}
      <section className="relative rounded-[3rem] overflow-hidden bg-slate-900 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-transparent" />
          <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Background" />
        </div>
        
        <div className="relative z-10 p-10 md:p-16 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest">{onlineCount} Verified Pros Nearby</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black leading-[1] mb-6 tracking-tight">
              Maintain your home <span className="text-blue-400">smarter.</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 leading-relaxed font-medium">
              Find, book, and pay verified professionals for any home task. Secure escrow & GPS tracking built-in.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <input 
                  type="text" 
                  placeholder="What service do you need today?" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white text-slate-900 rounded-2xl px-6 py-5 outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-bold shadow-2xl text-lg"
                />
                <button 
                  onClick={handleAiAsk}
                  disabled={isAiLoading}
                  className="absolute right-3 top-3 bg-blue-600 p-3.5 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {isAiLoading ? <Zap className="animate-pulse text-white" size={24} /> : <Sparkles className="text-white" size={24} />}
                </button>
              </div>
            </div>

            {aiRecommendation && (
              <div className="mt-8 bg-blue-600/30 backdrop-blur-md border border-blue-400/40 p-6 rounded-3xl flex items-start space-x-4 animate-in slide-in-from-top-4 duration-500">
                <div className="p-2.5 bg-blue-500 rounded-xl text-white shadow-lg">
                  <Zap size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="text-sm font-black text-blue-100 uppercase tracking-widest">Instant Recommendation</p>
                  <p className="text-lg text-white mt-1 leading-relaxed font-bold">{aiRecommendation}</p>
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block w-80 shrink-0">
             <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem] space-y-8">
                <div className="flex items-center space-x-3 mb-2">
                   <Activity size={18} className="text-blue-400" />
                   <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Market Feed</h4>
                </div>
                <div className="space-y-6">
                   {[
                     { label: 'Booking Success', val: '99.2%', color: 'text-green-400' },
                     { label: 'Avg. Rating', val: '4.88', color: 'text-yellow-400' },
                     { label: 'Verified Pros', val: '2,840', color: 'text-blue-400' }
                   ].map((item, i) => (
                     <div key={i} className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                        <span className={`text-2xl font-black ${item.color}`}>{item.val}</span>
                     </div>
                   ))}
                </div>
                <div className="pt-6 border-t border-white/10">
                   <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Recent Activity</p>
                   <div className="space-y-3">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center space-x-3">
                         <div className="w-2 h-2 rounded-full bg-green-500"></div>
                         <p className="text-[10px] font-bold text-slate-300">Cleaning Job #1024 Finished</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center space-x-3">
                         <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                         <p className="text-[10px] font-bold text-slate-300">Pro verified in Los Angeles</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. ENLARGED TRUST SECTION */}
      <section className="py-10">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-black dark:text-white tracking-tighter mb-4">Built on Absolute Trust</h2>
           <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-2xl mx-auto">
              We've reinvented home services by putting your safety and satisfaction at the core of every transaction.
           </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { title: 'Verified Pros', desc: 'Strict ID & background checks', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
             { title: 'Safe Payments', desc: 'Secure Escrow protection', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
             { title: 'GPS Check-in', desc: 'Track arrivals in real-time', icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
             { title: '24/7 Support', desc: 'Dedicated resolution team', icon: PhoneCall, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' }
           ].map((item, i) => (
             <div key={i} className="group flex flex-col items-center text-center p-12 bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-transparent hover:border-blue-500/50 hover:shadow-2xl transition-all duration-500">
                <div className={`w-24 h-24 ${item.bg} ${item.color} rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 shadow-lg`}>
                  <item.icon size={48} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-2xl font-black dark:text-white mb-3 tracking-tight">{item.title}</h4>
                  <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed font-bold">{item.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* 3. Featured Pro Spotlight */}
      {featuredPro && (
        <section className="bg-blue-50 dark:bg-blue-900/10 rounded-[4rem] border border-blue-100 dark:border-blue-800 p-10 md:p-16">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="relative flex-shrink-0">
               <div className="w-56 h-56 rounded-[3rem] overflow-hidden shadow-2xl ring-8 ring-white dark:ring-gray-800 cursor-pointer" onClick={() => onNavigate('public-profile', featuredPro.pro.id)}>
                  <img src={`https://i.pravatar.cc/400?u=${featuredPro.pro.id}`} className="w-full h-full object-cover" alt={featuredPro.user.name} />
               </div>
               <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-2xl flex items-center space-x-3 border dark:border-gray-700">
                  <div className="bg-yellow-100 p-1.5 rounded-lg">
                    <Star size={20} className="text-yellow-500 fill-yellow-500" />
                  </div>
                  <span className="text-xl font-black dark:text-white">{featuredPro.pro.rating}</span>
               </div>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
                 <TrendingUp size={24} />
                 <span className="text-sm font-black uppercase tracking-[0.3em]">Professional Spotlight</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black dark:text-white tracking-tighter">{featuredPro.user.name}</h2>
              <div className="flex flex-wrap gap-3">
                 <span className="bg-white dark:bg-gray-800 px-6 py-2 rounded-2xl text-sm font-bold border dark:border-gray-700 shadow-md">{featuredPro.pro.category}</span>
                 <span className="bg-green-600 text-white px-6 py-2 rounded-2xl text-sm font-black flex items-center shadow-lg">
                    <ShieldCheck size={16} className="mr-2" /> Verified & Insured
                 </span>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed italic border-l-4 border-blue-500 pl-6">
                 "{featuredPro.pro.description}"
              </p>
              <div className="pt-8 flex flex-col sm:flex-row gap-5">
                 <button 
                  onClick={() => onNavigate('public-profile', featuredPro.pro.id)}
                  className="flex-1 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 text-lg"
                 >
                    Book {featuredPro.user.name.split(' ')[0]} Now
                 </button>
                 <button 
                  onClick={() => onNavigate('public-profile', featuredPro.pro.id)}
                  className="flex-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 dark:border-gray-700 px-10 py-5 rounded-2xl font-black hover:bg-gray-50 transition-all text-lg"
                 >
                    View Portfolio
                 </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Category Grid */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div>
            <h2 className="text-3xl font-black dark:text-white tracking-tighter">Most Popular Right Now</h2>
            <p className="text-gray-500 font-medium text-lg">Trending services in your local neighborhood</p>
          </div>
          <button 
            onClick={() => onNavigate('search')}
            className="text-blue-600 font-black text-sm uppercase tracking-widest hover:underline flex items-center space-x-2"
          >
            <span>Browse Catalog</span>
            <ArrowRight size={18} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <div key={cat.id} className="group bg-white dark:bg-gray-800 rounded-[3rem] overflow-hidden shadow-sm border-2 dark:border-gray-700 hover:shadow-2xl hover:border-blue-500/50 transition-all duration-500">
              <div className="h-56 relative overflow-hidden">
                <Carousel images={cat.images} />
                {i === 0 && (
                  <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center z-20 shadow-xl">
                    <Zap size={12} className="mr-2 fill-white" /> Fastest Pro Arrival
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-black dark:text-white">{cat.name}</h3>
                  <div className="flex items-center text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-lg">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-black ml-1 text-yellow-700 dark:text-yellow-500">4.9</span>
                  </div>
                </div>
                <p className="text-base text-gray-500 dark:text-gray-400 line-clamp-1 mb-8 font-medium">{cat.description}</p>
                <div className="flex items-center justify-between pt-6 border-t dark:border-gray-700">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing From</span>
                    <span className="text-lg font-black dark:text-white">$35/hr</span>
                  </div>
                  <button 
                    onClick={() => onNavigate('search')}
                    className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-[1.25rem] flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default CustomerDashboard;
