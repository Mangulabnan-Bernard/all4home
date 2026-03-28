
import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { db } from './services/mockDb';
import Layout from './components/Layout';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderApplication from './pages/ProviderApplication';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import ServiceResults from './pages/ServiceResults';
import ProfilePage from './pages/ProfilePage';
import PublicProviderProfile from './pages/PublicProviderProfile';
import { ShieldCheck, Info, Lock, Calendar } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedService, setSelectedService] = useState({ name: '', category: '' });
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  // Check provider status if logged in
  useEffect(() => {
    const checkStatus = async () => {
      if (currentUser?.role === UserRole.PROVIDER) {
        const p = await db.getProviderByUserId(currentUser.id);
        setHasApplied(!!p);
      }
    };
    checkStatus();
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === UserRole.ADMIN) setCurrentPage('admin-panel');
    else if (user.role === UserRole.PROVIDER) setCurrentPage('manage-jobs');
    else setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleServiceSelect = (name: string, category: string) => {
    setSelectedService({ name, category });
    setCurrentPage('service-results');
  };

  const navigateToPublicProfile = (providerId: string) => {
    setSelectedProviderId(providerId);
    setCurrentPage('public-profile');
  };

  const renderPage = () => {
    if (currentPage === 'dashboard' || currentPage === 'search') {
      return (
        <CustomerDashboard 
          onNavigate={(page, pId) => {
            if (page === 'public-profile' && pId) {
              navigateToPublicProfile(pId);
            } else {
              setCurrentPage(page);
            }
          }} 
        />
      );
    }

    if (currentPage === 'service-results') {
      return (
        <ServiceResults 
          serviceName={selectedService.name} 
          categoryName={selectedService.category} 
          onNavigate={(page, pId) => {
            if (page === 'public-profile' && pId) {
              navigateToPublicProfile(pId);
            } else {
              setCurrentPage(page);
            }
          }} 
        />
      );
    }

    if (currentPage === 'public-profile' && selectedProviderId) {
      return (
        <PublicProviderProfile 
          providerId={selectedProviderId} 
          onNavigate={setCurrentPage} 
        />
      );
    }

    if (currentPage === 'login') {
      return <LoginPage onLogin={handleLogin} />;
    }

    const isProtectedRoute = ['manage-jobs', 'admin-panel', 'profile', 'earnings', 'my-jobs'].includes(currentPage);
    
    if (isProtectedRoute && !currentUser) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-blue-500/10">
            <Lock size={44} />
          </div>
          <h2 className="text-3xl font-bold dark:text-white tracking-tight">Protected Area</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 mb-10 max-w-sm text-lg">
            Please sign in to access your bookings, job management, or administrative tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setCurrentPage('login')}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25"
            >
              Sign In Now
            </button>
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border dark:border-gray-700 px-10 py-4 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'manage-jobs':
        if (currentUser?.role === UserRole.PROVIDER) {
           return hasApplied ? <ProviderDashboard user={currentUser} /> : <ProviderApplication user={currentUser} onSuccess={() => setHasApplied(true)} />;
        }
        return (
          <CustomerDashboard 
            onNavigate={(page, pId) => {
              if (page === 'public-profile' && pId) navigateToPublicProfile(pId);
              else setCurrentPage(page);
            }} 
          />
        );
      case 'admin-panel':
        return currentUser?.role === UserRole.ADMIN ? <AdminDashboard /> : (
          <CustomerDashboard 
            onNavigate={(page, pId) => {
              if (page === 'public-profile' && pId) navigateToPublicProfile(pId);
              else setCurrentPage(page);
            }} 
          />
        );
      case 'my-jobs':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="bg-white dark:bg-gray-800 p-12 rounded-[3rem] text-center border dark:border-gray-700 shadow-sm">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                   <Calendar size={32} />
                </div>
                <h2 className="text-3xl font-bold dark:text-white">Your Bookings</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
                   Manage your scheduled services and track your ongoing projects with real-time GPS verification.
                </p>
                <button 
                  onClick={() => setCurrentPage('dashboard')}
                  className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all"
                >
                   Browse More Services
                </button>
             </div>
          </div>
        );
      case 'profile':
        return currentUser ? (
          <ProfilePage user={currentUser} onUpdateUser={handleUpdateUser} />
        ) : (
          <CustomerDashboard 
            onNavigate={(page, pId) => {
              if (page === 'public-profile' && pId) navigateToPublicProfile(pId);
              else setCurrentPage(page);
            }} 
          />
        );
      default:
        return (
          <CustomerDashboard 
            onNavigate={(page, pId) => {
              if (page === 'public-profile' && pId) navigateToPublicProfile(pId);
              else setCurrentPage(page);
            }} 
          />
        );
    }
  };

  return (
    <Layout 
      user={currentUser} 
      onLogout={handleLogout} 
      onNavigate={setCurrentPage}
      onServiceSelect={handleServiceSelect}
      onUpdateUser={handleUpdateUser}
      currentPage={currentPage}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
