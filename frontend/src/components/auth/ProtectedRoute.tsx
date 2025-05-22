import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * @deprecated Utiliser requiredRoles à la place pour supporter les multi-rôles
   */
  requiredRole?: 'ROLE_ADMIN' | 'ROLE_USER'; // Ancienne version
  requiredRoles?: Array<'ROLE_ADMIN' | 'ROLE_USER'>; // Nouvelle version
  strict?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole, // Ancienne prop (conservée pour compatibilité)
  requiredRoles = requiredRole ? [requiredRole] : undefined, // Conversion automatique
  strict = false
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Vérification de l'authentification
  if (!user || !user.roles) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Vérification des rôles (nouvelle version)
  if (requiredRoles) {
    const hasRoles = strict
      ? requiredRoles.every(role => user.roles.includes(role)) // Tous les rôles requis
      : requiredRoles.some(role => user.roles.includes(role)); // Au moins un rôle

    if (!hasRoles) {
      return (
        <Navigate
          to="/unauthorized"
          state={{
            requiredRoles,
            userRoles: user.roles,
            from: location
          }}
          replace
        />
      );
    }
  }

  return <>{children}</>;
};

// Composants spécialisés (meilleure pratique)
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>{children}</ProtectedRoute>
);