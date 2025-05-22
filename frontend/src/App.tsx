
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleBasedRedirect } from '@/components/auth/RoleBasedRedirect';
import Dashboard from './pages/Dashboard';
import AppLayout from './components/layout/AppLayout';
import { Toaster } from "@/components/ui/sonner";
import Profile from './pages/Profile';
import Alerts from './pages/Alerts';
import Transactions from './pages/Transactions';
import Users from './pages/Users';
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import { initializeAuth } from './api/auth';
import SelectAccountPage from './components/accounts/SelectAccountPage';
import CreateAccountPage from './components/accounts/CreateAccountPage';
import DepositPage from './components/accounts/DepositPage';
import AdminTransactionsState from './pages/AdminTransactionsState';
import AdminAccoutnsState from './pages/AdminAccountsState';


function App() {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Auto redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Role-based routing */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />
          
          {/* Protected Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="transactions" element={<AdminTransactionsState />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="accounts" element={<AdminAccoutnsState />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          
          {/* Protected User routes */}
          <Route path="/user" element={
            <ProtectedRoute requiredRoles={['ROLE_USER']}>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard/:accountNumber" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
            <Route path="account-selection" element={<SelectAccountPage />} />
            <Route path="create-account" element={<CreateAccountPage />} />
            <Route path=":accountNumber/deposit" element={<DepositPage />} />
            <Route path='accounts' element={<SelectAccountPage />} />
          </Route>
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster position="bottom-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
