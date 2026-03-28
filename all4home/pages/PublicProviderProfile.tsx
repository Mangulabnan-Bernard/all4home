
import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { ProviderProfile, User, Review } from '../types';
import BookingModal from '../components/BookingModal';
import { 
  Star, 
  ShieldCheck, 
  Shield,
  MapPin, 
  Award, 
  MessageSquare, 
  ChevronRight, 
  Info,
  CheckCircle2,
  Clock,
  Navigation,
  Check,
  Calendar,
  Image as ImageIcon,
  Heart,
  Share2,
  Flag,
  Globe,
  Zap,
  ArrowLeft
} from 'lucide-react';

interface PublicProviderProfileProps {
  providerId: string;
  onNavigate: (page: string) => void;
}

const PublicProviderProfile: React.FC<PublicProviderProfileProps> = ({ providerId, onNavigate }) => {
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews'>('about');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const p = await db.getProviderById(providerId);
      if (p) {
        setProvider(p);
        const u = await db.getUserById(p.userId);
        if (u) setUser(u);
        const r = await db.getReviewsByProviderId(p.id);
        setReviews(r);
      }
      setLoading(false);
    };
    loadData();
  }, [providerId]);

  if (loading) return <div className="py-20 text-center font-black dark:text-white animate-pulse">Loading Profile...</div>;
  if (!provider || !user) return <div className="py-20 text-center">Provider not found</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        providerName={user.name}
        pricePerHour={provider.pricePerHour}
      />

      {/* Back Button */}
      <button 
        onClick={() => onNavigate('dashboard')}
        className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Marketplace</span>
      </button>

      {/* Hero Header */}
      <section className="bg-white dark:bg-gray-800 rounded-[3rem] border-2 dark:border-gray-700 p-8 md:p-12 shadow-sm overflow-hidden relative">
        <div className="flex flex-col lg:flex-row gap-12 items-start lg:items-center relative z-10">
          <div className="relative shrink-0">
             <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden shadow-2xl ring-8 ring-gray-50 dark:ring-gray-900">
                <img src={`https://i.pravatar.cc/400?u=${provider.id}`} className="w-full h-full object-cover" alt={user.name} />
             </div>
             {provider.verified && (
               <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-3xl shadow-xl border-4 border-white dark:border-gray-800">
                  <ShieldCheck size={24} />
               </div>
             )}
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                 <h1 className="text-4xl md:text-5xl font-black dark:text-white tracking-tighter">{user.name}</h1>
                 <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-yellow-500 font-black">
                       <Star size={20} fill="currentColor" className="mr-1.5" />
                       <span className="text-xl">{provider.rating}</span>
                       <span className="text-gray-400 text-sm ml-2">({provider.reviewCount} Reviews)</span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                       {provider.category} Expert
                    </span>
                 </div>
              </div>
              <div className="flex items-center space-x-3">
                 <button className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl hover:text-blue-600 transition-colors">
                    <Heart size={20} />
                 </button>
                 <button className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl hover:text-blue-600 transition-colors">
                    <Share2 size={20} />
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t dark:border-gray-700">
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate</p>
                  <p className="text-xl font-black text-green-600 dark:text-green-500 mt-1">${provider.pricePerHour}/hr</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Response</p>
                  <p className="text-xl font-black dark:text-white mt-1">~15 min</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completed</p>
                  <p className="text-xl font-black dark:text-white mt-1">450+ Jobs</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                  <p className="text-xl font-black dark:text-white mt-1">{provider.location?.address.split(',')[0] || 'LA'}</p>
               </div>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details & Content */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Tabs */}
          <div className="flex border-b-2 dark:border-gray-700 overflow-x-auto no-scrollbar">
             {[
               { id: 'about', label: 'Overview', icon: Info },
               { id: 'portfolio', label: 'Portfolio Gallery', icon: ImageIcon },
               { id: 'reviews', label: `Client Reviews (${provider.reviewCount})`, icon: MessageSquare }
             ].map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`
                    flex items-center space-x-2 px-8 py-6 font-black text-sm uppercase tracking-widest transition-all whitespace-nowrap border-b-4 -mb-[2px]
                    ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}
                 `}
               >
                 <tab.icon size={18} />
                 <span>{tab.label}</span>
               </button>
             ))}
          </div>

          <div className="space-y-12 min-h-[400px]">
            {activeTab === 'about' && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="space-y-6">
                   <h3 className="text-2xl font-black dark:text-white tracking-tight">Professional Background</h3>
                   <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium italic border-l-4 border-blue-500 pl-8">
                     "{provider.description}"
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-[2.5rem] space-y-6">
                      <h4 className="font-black dark:text-white flex items-center space-x-2">
                        <CheckCircle2 size={18} className="text-blue-600" />
                        <span>Included Specialties</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                         {['Deep Cleaning', 'Eco-friendly Products', 'Organizing', 'Post-Event Cleaning', 'Sanitization'].map(s => (
                           <span key={s} className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl text-xs font-bold shadow-sm border dark:border-gray-700">{s}</span>
                         ))}
                      </div>
                   </div>
                   
                   <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-[2.5rem] space-y-6">
                      <h4 className="font-black dark:text-white flex items-center space-x-2">
                        <ShieldCheck size={18} className="text-blue-600" />
                        <span>Platform Badges</span>
                      </h4>
                      <div className="space-y-4">
                         <div className="flex items-center space-x-3 text-sm font-bold">
                            <Zap size={16} className="text-yellow-500" />
                            <span className="dark:text-white">Elite Pro 2024</span>
                         </div>
                         <div className="flex items-center space-x-3 text-sm font-bold">
                            <Clock size={16} className="text-blue-500" />
                            <span className="dark:text-white">100% On-Time Completion</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Service Area Map */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black dark:text-white tracking-tight">Service Coverage</h3>
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{provider.serviceRadiusKm}km Radius from Downtown</span>
                   </div>
                   <div className="h-72 bg-blue-50 dark:bg-blue-900/20 rounded-[3rem] relative overflow-hidden flex items-center justify-center group border dark:border-gray-700">
                      {/* Stylized CSS Map representation */}
                      <div className="absolute inset-0 opacity-20">
                         <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
                            {Array.from({length: 144}).map((_, i) => (
                              <div key={i} className="border-[0.5px] border-blue-200 dark:border-blue-800"></div>
                            ))}
                         </div>
                      </div>
                      <div className="relative z-10 flex flex-col items-center">
                         <div className="w-40 h-40 bg-blue-600/10 rounded-full border-2 border-dashed border-blue-500 animate-pulse flex items-center justify-center">
                            <div className="w-4 h-4 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.8)]"></div>
                         </div>
                         <p className="mt-6 font-black dark:text-white text-sm">Serving {provider.location?.address}</p>
                      </div>
                      <div className="absolute bottom-6 right-8 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl flex items-center space-x-3 border dark:border-gray-700">
                         <MapPin size={18} className="text-blue-600" />
                         <span className="text-xs font-black dark:text-white">Verified Coverage</span>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {provider.portfolioImages.map((img, i) => (
                    <div key={i} className="group relative rounded-[2.5rem] overflow-hidden aspect-video shadow-lg hover:shadow-2xl transition-all duration-500 border-2 dark:border-gray-700">
                      <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Work portfolio" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                        <div>
                           <p className="text-white font-black text-lg">Deep Cleaning Project</p>
                           <p className="text-blue-200 text-sm font-bold">San Francisco, CA</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-in fade-in duration-500 space-y-10">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-10 rounded-[3rem] border dark:border-gray-700 flex flex-col md:flex-row items-center gap-12">
                   <div className="text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Overall Score</p>
                      <h4 className="text-6xl font-black dark:text-white leading-none tracking-tighter">{provider.rating}</h4>
                      <div className="flex items-center text-yellow-400 justify-center mt-4">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill={i <= Math.floor(provider.rating) ? "currentColor" : "none"} />)}
                      </div>
                   </div>
                   <div className="flex-1 space-y-4 w-full">
                      {[
                        { label: '5 Stars', pct: 92 },
                        { label: '4 Stars', pct: 6 },
                        { label: '3 Stars', pct: 2 },
                        { label: '2 Stars', pct: 0 },
                        { label: '1 Star', pct: 0 }
                      ].map(bar => (
                        <div key={bar.label} className="flex items-center space-x-4">
                           <span className="text-xs font-black text-gray-500 w-16 text-right whitespace-nowrap">{bar.label}</span>
                           <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${bar.pct}%` }}></div>
                           </div>
                           <span className="text-xs font-black dark:text-white w-8">{bar.pct}%</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border-2 dark:border-gray-700 shadow-sm">
                      <div className="flex items-start justify-between mb-6">
                         <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-black text-xl">
                               {review.customerName.charAt(0)}
                            </div>
                            <div>
                               <h5 className="font-black dark:text-white">{review.customerName}</h5>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Verified Client • {new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <div className="flex items-center text-yellow-500 font-black">
                            <Star size={16} fill="currentColor" className="mr-1.5" />
                            <span>{review.rating}.0</span>
                         </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed italic">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="space-y-8">
           <div className="sticky top-28 space-y-8">
              <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border-2 border-blue-600 shadow-2xl space-y-8">
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Starts At</p>
                       <p className="text-3xl font-black dark:text-white tracking-tighter">${provider.pricePerHour}<span className="text-sm font-bold text-gray-400">/hr</span></p>
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center">
                       <Zap size={12} className="mr-2 fill-white" /> Low Price Guarantee
                    </div>
                 </div>

                 <div className="space-y-4">
                    <button 
                      onClick={() => setIsBookingModalOpen(true)}
                      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center space-x-3 group"
                    >
                       <Calendar size={20} className="group-hover:scale-110 transition-transform" />
                       <span>Select Date & Time</span>
                    </button>
                    <button className="w-full bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 dark:border-blue-800 py-5 rounded-2xl font-black hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all">
                       Ask a Question
                    </button>
                    {/* View Portfolio button inside Profile Hero switches tab */}
                    <button 
                      onClick={() => setActiveTab('portfolio')}
                      className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-5 rounded-2xl font-black hover:bg-gray-200 dark:hover:bg-gray-600 transition-all mt-2"
                    >
                      View Portfolio Gallery
                    </button>
                 </div>

                 <div className="pt-8 border-t dark:border-gray-700 space-y-4">
                    <div className="flex items-center space-x-3 text-xs font-bold text-gray-500">
                       <ShieldCheck size={16} className="text-green-600" />
                       <span>Safe Escrow Payments</span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs font-bold text-gray-500">
                       <CheckCircle2 size={16} className="text-green-600" />
                       <span>All4Home Satisfaction Promise</span>
                    </div>
                 </div>
              </div>

              {/* Safety Banner */}
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-4 relative overflow-hidden">
                 <Shield size={64} className="absolute -right-4 -bottom-4 text-white/5 rotate-12" />
                 <h4 className="font-black text-lg tracking-tight relative z-10">Our Protection Guarantee</h4>
                 <p className="text-xs text-gray-400 leading-relaxed font-bold relative z-10">
                    Your money stays in our secure escrow vault until you confirm the job is 100% finished and you are satisfied.
                 </p>
                 <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline relative z-10">Learn about safety</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProviderProfile;
