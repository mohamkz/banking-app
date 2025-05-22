import { useAuth } from '@/context/AuthContext';
import AlertsList from '@/components/alerts/AlertsList';
import { Navigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Alerts = () => {
  const { isAdmin } = useAuth();
  const isMobile = useIsMobile();
  
  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="space-y-4">
      <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>Alertes de fraude</h1>
      <div className={isMobile ? '-mx-4' : 'mx-0'}>
        <AlertsList />
      </div>
    </div>
  );
};

export default Alerts;
