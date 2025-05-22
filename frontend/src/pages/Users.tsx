
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import UsersList from '@/components/users/UsersList';
import { useIsMobile } from '@/hooks/use-mobile';

const Users = () => {
  const { isAdmin } = useAuth();
  const isMobile = useIsMobile();
  
  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="space-y-4">
      <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>Gestion des utilisateurs</h1>
      <div className={isMobile ? '-mx-4' : 'mx-0'}>
        <UsersList />
      </div>
    </div>
  );
};

export default Users;
