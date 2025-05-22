
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

export const RoleBasedRedirect: React.FC = () => {
  const { user, isLoading, refreshUser } = useAuth();

  // Try to refresh the user data when this component loads
  useEffect(() => {
    const validateSession = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error('Session validation failed:', error);
        toast.error('Session validation failed. Please login again.');
      }
    };
    
    validateSession();
  }, [refreshUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check for admin role
  if (user.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Default to user role
  return <Navigate to="/user/dashboard" replace />;
}; 
