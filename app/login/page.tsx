'use client';

import { useAuth } from '../contexts/AuthContext';
import LoginPage from './pages/LoginPage';

const Page = () => {
  const { login } = useAuth();

  return <LoginPage onLogin={login} />;
};

export default Page;
