'use client';

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../../components/Layout';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { currentUser, logout, updateUser } = useAuth();

  return (
    <Layout
      user={currentUser}
      onLogout={logout}
      onUpdateUser={updateUser}
    >
      {children}
    </Layout>
  );
};

export default ClientLayout;
