import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from '../components/ui/sonner';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotifications: () => {}
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage safely
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const stored = localStorage.getItem('fraudwatch_notifications');
        if (stored) {
          const parsed = JSON.parse(stored) as Array<Omit<Notification, 'date'> & { date: string }>;
          setNotifications(parsed.map(n => ({
            ...n,
            date: new Date(n.date)
          })));
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
        localStorage.removeItem('fraudwatch_notifications');
      }
    };

    loadNotifications();
  }, []);

  // Persist notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fraudwatch_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(), // More reliable than Date.now()
      date: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 99)]); // Limit to 100 notifications

    // Show toast with proper typing
    toast[notification.type](notification.title, {
      description: notification.message,
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};