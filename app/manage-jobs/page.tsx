'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderApplication from './pages/ProviderApplication';

const Page = () => {
  const { currentUser, hasApplied, updateUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'PROVIDER') {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== 'PROVIDER') {
    return <div>Redirecting...</div>;
  }

  if (hasApplied) {
    return <ProviderDashboard user={currentUser} />;
  } else {
    return <ProviderApplication user={currentUser} onSuccess={() => {
      // Trigger re-check of hasApplied
      updateUser(currentUser);
    }} />;
  }
};

export default Page;
