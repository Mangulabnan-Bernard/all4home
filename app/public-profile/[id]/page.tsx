'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import PublicProviderProfile from '../../pages/PublicProviderProfile';

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = ({ params }: PageProps) => {
  const resolvedParams = React.use(params);
  const router = useRouter();

  const onNavigate = (page: string) => {
    router.push(page === 'dashboard' ? '/' : `/${page}`);
  };

  return <PublicProviderProfile providerId={resolvedParams.id} onNavigate={onNavigate} />;
};

export default Page;
