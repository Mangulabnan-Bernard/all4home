'use client';

import { useRouter } from 'next/navigation';
import CustomerDashboard from './pages/CustomerDashboard';

const Page = () => {
  const router = useRouter();

  const onNavigate = (page: string, pId?: string) => {
    if (page === 'public-profile' && pId) {
      router.push(`/public-profile/${pId}`);
    } else if (page === 'service-results') {
      // This should be handled by service select, but if called, perhaps redirect to home
      router.push('/');
    } else {
      router.push(page === 'dashboard' ? '/' : `/${page}`);
    }
  };

  return <CustomerDashboard onNavigate={onNavigate} />;
};

export default Page;
