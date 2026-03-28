'use client';

import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';

const Page = () => {
  const router = useRouter();

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
          onClick={() => router.push('/')}
          className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all"
        >
          Browse More Services
        </button>
      </div>
    </div>
  );
};

export default Page;
