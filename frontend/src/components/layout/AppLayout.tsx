
import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  
  useEffect(() => {
    // Auto-collapse sidebar on mobile
    setSidebarCollapsed(isMobile);
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };
  
  // Show loading state
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
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : isMobile ? 'ml-0' : 'ml-64'}`}>
        <Header toggleSidebar={toggleSidebar} />
        
        <main className={`px-4 md:px-6 py-20 ${isMobile && !sidebarCollapsed ? 'opacity-30' : 'opacity-100'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
