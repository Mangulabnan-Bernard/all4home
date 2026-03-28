'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './pages/AdminDashboard';

const Page = () => {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return <div>Redirecting...</div>;
  }

  return <AdminDashboard />;
};

export default Page;
