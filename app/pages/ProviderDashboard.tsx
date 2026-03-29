
'use client';

import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus, ProviderProfile, User } from '../../lib/types';
import { getBookings, getProviderByUserId, getUsers, updateBooking } from '../../lib/actions';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Navigation, 
  Camera, 
  DollarSign, 
  ArrowUpRight, 
  MessageSquare,
  MoreVertical,
  Check,
  Calendar,
  ShieldCheck,
  History,
  Filter,
  ChevronDown,
  XCircle,
  Search
} from 'lucide-react';

interface ProviderDashboardProps {
  user: User;
}

const ProviderDashboard: React.FC<ProviderDashboardProps> = ({ user }) => {
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [stats, setStats] = useState({ earnings: 0, completed: 0, pending: 0 });
  
  // History filters
  const [historyFilterStatus, setHistoryFilterStatus] = useState<'ALL' | 'COMPLETED' | 'CANCELED'>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const p = await getProviderByUserId(user.id);
      if (p) {
        setProvider(p);
        const b = await getBookings();
        const userBookings = b.filter(booking => booking.providerId === p.id);
        setBookings(userBookings);
        setStats({
          earnings: userBookings.filter(x => x.status === BookingStatus.COMPLETED).reduce((acc, curr) => acc + (curr.totalAmount || 0), 0),
          completed: userBookings.filter(x => x.status === BookingStatus.COMPLETED).length,
          pending: userBookings.filter(x => x.status === BookingStatus.PENDING).length
        });
      }
    };
    loadData();
  }, [user]);

  const handleAction = async (id: string, status: BookingStatus) => {
    await updateBooking(id, { status });
    const b = await getBookings();
    const userBookings = b.filter(booking => booking.providerId === provider?.id);
    setBookings(userBookings);
  };

  const handleCheckIn = async (id: string) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        await updateBooking(id, {
          status: BookingStatus.IN_PROGRESS,
          gpsCheckIn: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            timestamp: new Date().toISOString()
          }
        });
        const b = await getBookings();
        const userBookings = b.filter(booking => booking.providerId === provider?.id);
        setBookings(userBookings);
      });
    }
  };

  const activeBookings = bookings.filter(b => 
    b.status !== BookingStatus.COMPLETED && 
    b.status !== BookingStatus.CANCELED
  );

  const filteredHistory = bookings.filter(b => {
    const isHistory = b.status === BookingStatus.COMPLETED || b.status === BookingStatus.CANCELED;
    if (!isHistory) return false;

    const matchesStatus = historyFilterStatus === 'ALL' || b.status === historyFilterStatus;
    
    const bookingDate = new Date(b.scheduledTime).getTime();
    const from = dateFrom ? new Date(dateFrom).getTime() : 0;
    const to = dateTo ? new Date(dateTo).getTime() : Infinity;
    
    return matchesStatus && bookingDate >= from && bookingDate <= to;
  }).sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <ArrowUpRight className="text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-black uppercase tracking-widest">Total Earnings</p>
          <h3 className="text-2xl font-black dark:text-white mt-1 tracking-tight">${stats.earnings.toLocaleString()}</h3>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-black uppercase tracking-widest">Completed Jobs</p>
          <h3 className="text-2xl font-black dark:text-white mt-1 tracking-tight">{stats.completed}</h3>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-2xl flex items-center justify-center">
              <Clock size={24} />
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-black uppercase tracking-widest">New Requests</p>
          <h3 className="text-2xl font-black dark:text-white mt-1 tracking-tight">{stats.pending}</h3>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b dark:border-gray-700">
        <button 
          onClick={() => setActiveTab('active')}
          className={`px-8 py-4 font-black text-sm uppercase tracking-widest transition-all border-b-4 ${activeTab === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Active Jobs
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-8 py-4 font-black text-sm uppercase tracking-widest transition-all border-b-4 ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Job History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'active' ? (
            <>
              <h2 className="text-xl font-black dark:text-white flex items-center space-x-2 tracking-tight">
                <Clock size={20} className="text-blue-600" />
                <span>Active Bookings</span>
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black ml-2 uppercase">{activeBookings.length}</span>
              </h2>

              {activeBookings.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-100 dark:border-gray-700 p-16 rounded-[2.5rem] text-center">
                  <div className="bg-gray-50 dark:bg-gray-700/50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Calendar className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-black text-lg">No active jobs right now.</p>
                  <p className="text-sm text-gray-400 font-bold mt-1">Requests from customers will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeBookings.map((booking) => (
                    <div key={booking.id} className="group bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border-2 dark:border-gray-700 shadow-sm hover:border-blue-500 transition-all duration-300">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center font-black text-xl">
                            {booking.customerId.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-lg font-black dark:text-white tracking-tight">Job #{booking.id.toUpperCase()}</h4>
                            <div className="flex items-center space-x-3 text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                              <span className="flex items-center space-x-1.5"><Clock size={12} /> <span>{new Date(booking.scheduledTime).toLocaleDateString()}</span></span>
                              <span>•</span>
                              <span className="flex items-center space-x-1.5"><MapPin size={12} /> <span>Main St, CA</span></span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                          {booking.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b dark:border-gray-700 my-6">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Service</p>
                          <p className="text-sm font-black dark:text-white tracking-tight">General Cleaning</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Price</p>
                          <p className="text-sm font-black text-green-600 dark:text-green-500 tracking-tight">${booking.totalAmount}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">GPS Verified</p>
                          <p className="text-sm font-black dark:text-white tracking-tight">{booking.gpsCheckIn ? '✓ YES' : '— PENDING'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Customer</p>
                          <p className="text-sm font-black dark:text-white tracking-tight">John Doe</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        {booking.status === BookingStatus.PENDING && (
                          <>
                            <button onClick={() => handleAction(booking.id, BookingStatus.ACCEPTED)} className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">Accept Job</button>
                            <button onClick={() => handleAction(booking.id, BookingStatus.CANCELED)} className="flex-1 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-6 py-4 rounded-2xl font-black hover:bg-red-50 dark:hover:bg-red-900/10 transition-all border dark:border-gray-600">Decline</button>
                          </>
                        )}
                        
                        {booking.status === BookingStatus.ACCEPTED && (
                          <button onClick={() => handleCheckIn(booking.id)} className="flex-1 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3 shadow-lg shadow-indigo-500/20">
                            <Navigation size={20} />
                            <span>Arrived & Start Job</span>
                          </button>
                        )}

                        {booking.status === BookingStatus.IN_PROGRESS && (
                          <>
                            <div className="flex-1 relative">
                              <input type="file" className="hidden" id={`upload-${booking.id}`} />
                              <label htmlFor={`upload-${booking.id}`} className="w-full flex items-center justify-center space-x-3 border-2 border-dashed border-gray-200 dark:border-gray-700 py-4 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group/label">
                                <Camera size={20} className="text-gray-400 group-hover/label:text-blue-600" />
                                <span className="text-sm font-black text-gray-500 group-hover/label:text-blue-600">Add Evidence</span>
                              </label>
                            </div>
                            <button onClick={() => handleAction(booking.id, BookingStatus.COMPLETED)} className="flex-1 bg-green-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-green-700 transition-all flex items-center justify-center space-x-3 shadow-lg shadow-green-500/20">
                              <Check size={20} />
                              <span>Request Completion</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* History View */}
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-xl font-black dark:text-white flex items-center space-x-2 tracking-tight">
                    <History size={20} className="text-blue-600" />
                    <span>Job History</span>
                  </h2>
                  
                  {/* Filter Bar */}
                  <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-2xl border dark:border-gray-700 shadow-sm">
                    <div className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
                      <Filter size={12} className="mr-2" /> Filters
                    </div>
                    <select 
                      value={historyFilterStatus}
                      onChange={(e) => setHistoryFilterStatus(e.target.value as any)}
                      className="bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-xs font-black px-4 py-2 outline-none dark:text-white"
                    >
                      <option value="ALL">All Status</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELED">Canceled</option>
                    </select>
                    <div className="flex items-center space-x-2 px-2">
                       <input 
                        type="date" 
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-[10px] font-black px-2 py-1.5 dark:text-white"
                       />
                       <span className="text-gray-400 text-xs">—</span>
                       <input 
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-[10px] font-black px-2 py-1.5 dark:text-white"
                       />
                    </div>
                    {(historyFilterStatus !== 'ALL' || dateFrom || dateTo) && (
                       <button 
                        onClick={() => { setHistoryFilterStatus('ALL'); setDateFrom(''); setDateTo(''); }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                       >
                         <XCircle size={16} />
                       </button>
                    )}
                  </div>
                </div>

                {filteredHistory.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-100 dark:border-gray-700 p-16 rounded-[2.5rem] text-center">
                    <div className="bg-gray-50 dark:bg-gray-700/50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Search className="text-gray-400" size={32} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-black text-lg">No records found matching your filters.</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border dark:border-gray-700 overflow-hidden shadow-sm">
                     <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700">
                                 <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Job ID</th>
                                 <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                 <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Service</th>
                                 <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                 <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y dark:divide-gray-700">
                              {filteredHistory.map((h) => (
                                 <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors">
                                    <td className="px-8 py-6 font-black dark:text-white text-sm">#{h.id.toUpperCase()}</td>
                                    <td className="px-8 py-6 text-sm text-gray-500 dark:text-gray-400 font-bold">{new Date(h.scheduledTime).toLocaleDateString()}</td>
                                    <td className="px-8 py-6 text-sm font-black dark:text-white tracking-tight">Home Cleaning</td>
                                    <td className="px-8 py-6 text-sm font-black text-green-600 dark:text-green-500">${h.totalAmount}</td>
                                    <td className="px-8 py-6 text-center">
                                       <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                          h.status === BookingStatus.COMPLETED 
                                          ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-100 dark:border-green-800' 
                                          : 'bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-100 dark:border-red-800'
                                       }`}>
                                          {h.status}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-black dark:text-white mb-6 tracking-tight">Professional Profile</h3>
            <div className="flex items-center space-x-4 mb-8">
              <div className="relative">
                <img src={`https://picsum.photos/seed/${user.id}/200`} className="w-20 h-20 rounded-3xl object-cover shadow-xl" />
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-lg border-2 border-white dark:border-gray-800">
                  <ShieldCheck size={14} />
                </div>
              </div>
              <div>
                <p className="font-black text-xl dark:text-white tracking-tight leading-none">{user.name}</p>
                <div className="flex items-center text-blue-600 text-[10px] font-black uppercase tracking-widest mt-2">
                  <span>Elite Provider</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Area</span>
                <span className="text-xs dark:text-white font-black">Los Angeles, CA</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Member Since</span>
                <span className="text-xs dark:text-white font-black">Jan 2024</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Response Rate</span>
                <span className="text-xs text-green-600 font-black">98.5%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <MessageSquare size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
            <h3 className="text-xl font-black mb-4 tracking-tight relative z-10">Provider Support</h3>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed font-bold relative z-10">
              Need help with a payout or a complex job? Our dedicated pro support team is here for you 24/7.
            </p>
            <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center space-x-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 relative z-10">
              <MessageSquare size={20} />
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
