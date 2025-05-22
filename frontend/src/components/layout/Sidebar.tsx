
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, CreditCard, Home, LogOut, PieChart, Shield, User, Users , Landmark} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/context/NotificationContext';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const { unreadCount } = useNotifications();
  
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  // Check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <aside 
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-sidebar transition-all duration-300 h-screen flex flex-col fixed left-0 top-0 z-30`}
    >
      <div className="flex justify-between items-center p-4">
        {!collapsed && (
          <div className="text-white font-bold text-xl">FraudWatch</div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-white hover:bg-sidebar-accent"
        >
          {collapsed ? '→' : '←'}
        </Button>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="flex flex-col p-4">
        {user && (
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} mb-6`}>
            <Avatar>
              
              <AvatarFallback>{getInitials(user.firstName)}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div>
                <p className="text-white font-medium">{user.lastName}</p>
                <p className="text-xs text-gray-300 capitalize">{user.roles[0] == 'ROLE_ADMIN' ? "Admin" : "Client"}</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          <li>
            <Link
              to={user.roles.includes('ROLE_USER') ?"/user/dashboard/:accountNumber" : "/admin/dashboard"}
              className={`sidebar-link ${
                isActive('/dashboard') ? 'sidebar-link-active' : ''
              }`}
            >
              <Home size={20} />
              {!collapsed && <span>Tableau de bord</span>}
            </Link>
          </li>
          
          <li>
            <Link
              to = {user.roles[0] == "ROLE_ADMIN" ? "/admin/transactions" : "/user/transactions"}
              className={`sidebar-link ${
                isActive('/transactions') ? 'sidebar-link-active' : ''
              }`}
            >
              <CreditCard size={20} />
              {!collapsed && <span>Transactions</span>}
            </Link>
          </li>
          
          <li>
            <Link
              to={user.roles[0] == "ROLE_ADMIN" ? "/admin/accounts" : "/user/accounts"}
              className={`sidebar-link ${
                isActive('/alerts') ? 'sidebar-link-active' : ''
              } relative`}
            >
              <Shield size={20} />
              {!collapsed && <span>Comptes</span>}
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          </li>
          
          {isAdmin && (
            <>
              <li>
                <Link
                  to="/admin/analytics"
                  className={`sidebar-link ${
                    isActive('/analytics') ? 'sidebar-link-active' : ''
                  }`}
                >
                  <PieChart size={20} />
                  {!collapsed && <span>Analyses</span>}
                </Link>
              </li>
              
              <li>
                <Link
                  to="/admin/users"
                  className={`sidebar-link ${
                    isActive('/users') ? 'sidebar-link-active' : ''
                  }`}
                >
                  <Users size={20} />
                  {!collapsed && <span>Utilisateurs</span>}
                </Link>
              </li>
            </>
          )}
          
          <li>
            <Link
              to={user.roles[0] == "ROLE_ADMIN" ? "/admin/profile" : "/user/profile"}
              className={`sidebar-link ${
                isActive('/profile') ? 'sidebar-link-active' : ''
              }`}
            >
              <User size={20} />
              {!collapsed && <span>Profil</span>}
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4">
        <Button 
          variant="ghost" 
          onClick={logout} 
          className="sidebar-link w-full justify-start"
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Déconnexion</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
