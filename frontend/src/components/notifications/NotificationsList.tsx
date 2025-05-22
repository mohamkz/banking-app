
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/context/NotificationContext';
import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle, Trash2 } from 'lucide-react';

const NotificationsList = () => {
  const { notifications, markAllAsRead, markAsRead, clearNotifications } = useNotifications();
  const [filter, setFilter] = useState<string | null>(null);
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get icon by type
  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <InfoIcon className="h-5 w-5 text-blue-500" />;
    }
  };
  
  // Filter notifications
  const filteredNotifications = filter
    ? notifications.filter(n => n.type === filter)
    : notifications;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(null)}
          >
            Toutes ({notifications.length})
          </Button>
          <Button
            variant={filter === 'info' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('info')}
          >
            <InfoIcon className="h-4 w-4 mr-1" />
            Info
          </Button>
          <Button
            variant={filter === 'success' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('success')}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Succès
          </Button>
          <Button
            variant={filter === 'warning' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('warning')}
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Alertes
          </Button>
          <Button
            variant={filter === 'error' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('error')}
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            Erreurs
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Tout marquer comme lu
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="text-red-500" onClick={clearNotifications}>
          <Trash2 className="h-4 w-4 mr-1" />
          Effacer tout
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Historique des notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <InfoIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg flex gap-4 ${
                    notification.read ? 'bg-white' : 'bg-blue-50'
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.date)}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsList;
