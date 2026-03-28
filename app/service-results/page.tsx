'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import ServiceResults from '../pages/ServiceResults';

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const serviceName = searchParams.get('service') || '';
  const categoryName = searchParams.get('category') || '';

  const onNavigate = (page: string, pId?: string) => {
    if (page === 'public-profile' && pId) {
      router.push(`/public-profile/${pId}`);
    } else {
      router.push(page === 'dashboard' ? '/' : `/${page}`);
    }
  };

  return <ServiceResults serviceName={serviceName} categoryName={categoryName} onNavigate={onNavigate} />;
};

export default Page;
