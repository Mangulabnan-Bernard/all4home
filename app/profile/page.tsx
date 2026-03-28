'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import ProfilePage from './pages/ProfilePage';

const Page = () => {
  const { currentUser, updateUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return <div>Redirecting...</div>;
  }

  return <ProfilePage user={currentUser} onUpdateUser={updateUser} />;
};

export default Page;
