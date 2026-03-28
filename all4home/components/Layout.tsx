
import React, { useState, useEffect, useRef } from 'react';
import { UserRole, User } from '../types';
import { db } from '../services/mockDb';
import ServiceMenu from './ServiceMenu';
import { 
  Home, 
  Search, 
  Calendar, 
  User as UserIcon, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Bell,
  ShieldCheck,
  Briefcase,
  BarChart2,
  LogIn,
  ChevronRight,
  Info,
  HelpCircle,
  Users,
  ChevronDown,
  Instagram,
  Twitter,
  Facebook,
  Shield,
  PhoneCall,
  MessageSquare,
  Compass
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onServiceSelect?: (name: string, category: string) => void;
  onUpdateUser?: (user: User) => void;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onNavigate, onServiceSelect, onUpdateUser, currentPage }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const [guestDarkMode, setGuestDarkMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDarkMode = user ? user.darkMode : guestDarkMode;

  const toggleTheme = async () => {
    if (user) {
      const newState = await db.toggleDarkMode(user.id);
      if (onUpdateUser) onUpdateUser({ ...user, darkMode: newState });
    } else {
      setGuestDarkMode(!guestDarkMode);
    }
  };

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsServiceMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Marketplace', icon: Home, roles: ['GUEST', UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN] },
    { id: 'search', label: 'Find a Pro', icon: Search, roles: ['GUEST', UserRole.CUSTOMER] },
    { id: 'my-jobs', label: 'My Bookings', icon: Calendar, roles: [UserRole.CUSTOMER] },
    { id: 'manage-jobs', label: 'Manage Jobs', icon: Briefcase, roles: [UserRole.PROVIDER] },
    { id: 'earnings', label: 'Business Insights', icon: BarChart2, roles: [UserRole.PROVIDER] },
    { id: 'admin-panel', label: 'Admin Hub', icon: ShieldCheck, roles: [UserRole.ADMIN] },
    { id: 'profile', label: 'Account Settings', icon: UserIcon, roles: [UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN] },
  ];

  const filteredNav = navItems.filter(item => {
    if (!user) return item.roles.includes('GUEST');
    return item.roles.includes(user.role);
  });

  const mobileNavItems = [
    { id: 'dashboard', label: 'Explore', icon: Compass },
    { id: 'my-jobs', label: 'Bookings', icon: Calendar, role: UserRole.CUSTOMER },
    { id: 'manage-jobs', label: 'Jobs', icon: Briefcase, role: UserRole.PROVIDER },
    { id: 'admin-panel', label: 'Admin', icon: ShieldCheck, role: UserRole.ADMIN },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ].filter(item => !item.role || (user && user.role === item.role));

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative pb-20 md:pb-0`}>
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[45]" onClick={() => setSidebarOpen(false)} />
      )}

      {/* 3-Side Straight Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 border-r dark:border-gray-700 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => { onNavigate('dashboard'); setSidebarOpen(false); }}>
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/30">A</div>
              <span className="font-black text-2xl tracking-tighter dark:text-white">All4Home</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 px-6 space-y-8 mt-4 overflow-y-auto no-scrollbar">
            <nav className="space-y-2">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-4">Navigation</p>
              {filteredNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                  className={`
                    w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group
                    ${currentPage === item.id 
                      ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/30 translate-x-1' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400'}
                  `}
                >
                  <div className="flex items-center space-x-4">
                      <item.icon size={20} className={currentPage === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                      <span className="font-black text-sm tracking-tight">{item.label}</span>
                  </div>
                  {currentPage === item.id && <ChevronRight size={16} />}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8 border-t dark:border-gray-700 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white dark:bg-gray-800 border dark:border-gray-700 text-sm font-black dark:text-gray-300 shadow-sm"
            >
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>
            
            {user ? (
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center space-x-2 py-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl font-black transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
              >
                <span>Sign Out</span>
              </button>
            ) : (
              <button 
                onClick={() => { onNavigate('login'); setSidebarOpen(false); }}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
              >
                Sign In to All4Home
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Sticky Header */}
      <header className={`
        fixed top-0 inset-x-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b dark:border-gray-800 transition-transform duration-500 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      `}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 hover:border-blue-500 transition-all text-gray-700 dark:text-gray-300"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">A</div>
              <span className="hidden sm:inline-block font-black text-2xl tracking-tighter dark:text-white">All4Home</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
             <div className="relative hidden sm:block" ref={menuRef}>
                <button 
                  onClick={() => setIsServiceMenuOpen(!isServiceMenuOpen)}
                  className="flex items-center space-x-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black shadow-2xl shadow-blue-500/20 transition-all"
                >
                  <Search size={18} />
                  <span>Browse Services</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isServiceMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <ServiceMenu isOpen={isServiceMenuOpen} onSelect={(name, category) => { onServiceSelect?.(name, category); setIsServiceMenuOpen(false); }} onClose={() => setIsServiceMenuOpen(false)} />
             </div>
             
             <button className="p-3 rounded-2xl text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
               <Bell size={24} />
             </button>

             {user ? (
               <div className="flex items-center space-x-4 pl-4 border-l dark:border-gray-800 cursor-pointer" onClick={() => onNavigate('profile')}>
                 <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-black shadow-lg">
                   {user.name.charAt(0)}
                 </div>
                 <div className="hidden md:flex flex-col items-start leading-none">
                    <span className="text-xs font-black dark:text-white">{user.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{user.role}</span>
                 </div>
               </div>
             ) : (
                <button onClick={() => onNavigate('login')} className="text-sm font-black text-blue-600 dark:text-blue-400 px-6 py-3 border-2 border-transparent hover:border-blue-600 rounded-2xl transition-all">Sign In</button>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-[60] bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-t dark:border-gray-800 px-6 h-20 flex items-center justify-between">
         {mobileNavItems.map((item) => (
           <button 
             key={item.id}
             onClick={() => onNavigate(item.id)}
             className={`flex flex-col items-center space-y-1 ${currentPage === item.id ? 'text-blue-600' : 'text-gray-400'}`}
           >
              <item.icon size={24} />
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
           </button>
         ))}
      </div>

      {/* Modern Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 pt-20 pb-10 hidden md:block">
         <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
               <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">A</div>
                    <span className="font-black text-2xl tracking-tighter dark:text-white">All4Home</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    Connecting homeowners with background-checked professionals for a safer, smarter home maintenance experience.
                  </p>
                  <div className="flex items-center space-x-4">
                     <button className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors shadow-sm">
                        <Instagram size={20} />
                     </button>
                     <button className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors shadow-sm">
                        <Twitter size={20} />
                     </button>
                     <button className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors shadow-sm">
                        <Facebook size={20} />
                     </button>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <h5 className="font-black dark:text-white text-lg tracking-tight">Services</h5>
                  <nav className="flex flex-col space-y-4">
                     {['Cleaning', 'Plumbing', 'Electrical', 'Gardening', 'Handyman'].map(link => (
                       <button key={link} className="text-gray-500 hover:text-blue-600 transition-colors text-sm font-bold text-left">{link} Services</button>
                     ))}
                  </nav>
               </div>

               <div className="space-y-6">
                  <h5 className="font-black dark:text-white text-lg tracking-tight">Trust & Safety</h5>
                  <nav className="flex flex-col space-y-4">
                     <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm font-bold text-left">
                        <Shield size={16} className="mr-2" /> Verified Pros
                     </button>
                     <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm font-bold text-left">
                        <ShieldCheck size={16} className="mr-2" /> Escrow Payments
                     </button>
                     <button className="flex items-center text-gray-500 hover:text-blue-600 transition-colors text-sm font-bold text-left">
                        <PhoneCall size={16} className="mr-2" /> 24/7 Support
                     </button>
                  </nav>
               </div>

               <div className="space-y-6">
                  <h5 className="font-black dark:text-white text-lg tracking-tight">Professional?</h5>
                  <p className="text-gray-500 text-sm font-bold">Earn more and manage your business on your terms.</p>
                  <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
                     List Your Business
                  </button>
               </div>
            </div>
            
            <div className="pt-10 border-t dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">© 2024 All4Home Marketplace Inc. All rights reserved.</p>
               <div className="flex items-center space-x-8">
                  {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(link => (
                    <button key={link} className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest">{link}</button>
                  ))}
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Layout;
