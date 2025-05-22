
import React from 'react';
import NotificationsList from '@/components/notifications/NotificationsList';
import { useIsMobile } from '@/hooks/use-mobile';

const Notifications = () => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>Notifications</h1>
      <div className={isMobile ? 'px-0' : 'px-2'}>
        <NotificationsList />
      </div>
    </div>
  );
};

export default Notifications;
