
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, X, AlertTriangle, RefreshCw } from 'lucide-react';
import api from '@/services/api';
import { useNotifications } from '@/context/NotificationContext';

interface FraudAlert {
  id: string;
  date: string;
  userId: string;
  userName: string;
  transactionId: string;
  amount: number;
  merchant: string;
  riskScore: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'rejected';
  alertLevel: 'low' | 'medium' | 'high';
}

const AlertsList = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  
  useEffect(() => {
    fetchAlerts();
  }, []);
  
  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await api.admin.getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      addNotification({
        title: 'Erreur',
        message: 'Impossible de charger les alertes',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAction = async (alertId: string, action: 'confirm' | 'reject') => {
    setProcessing(alertId);
    try {
      const response = await api.admin.processAlert(alertId, action);
      
      if (response.success) {
        // Update alerts locally
        setAlerts(prevAlerts => 
          prevAlerts.map(alert => 
            alert.id === alertId 
              ? { ...alert, status: response.alert.status } 
              : alert
          )
        );
        
        addNotification({
          title: 'Alerte traitée',
          message: `L'alerte a été ${action === 'confirm' ? 'confirmée' : 'rejetée'} avec succès`,
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error processing alert:', error);
      addNotification({
        title: 'Erreur',
        message: 'Une erreur est survenue lors du traitement de l\'alerte',
        type: 'error'
      });
    } finally {
      setProcessing(null);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get alert badge by level
  const getAlertBadge = (level: string) => {
    switch (level) {
      case 'low':
        return <Badge className="bg-yellow-100 text-yellow-800">Faible</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Moyen</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800 animate-pulse-alert">Élevé</Badge>;
      default:
        return null;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">En attente</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Confirmée</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-gray-50 text-gray-800 border-gray-200">Rejetée</Badge>;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (alerts.length === 0) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-4 w-4" />
        <AlertTitle>Aucune alerte</AlertTitle>
        <AlertDescription>
          Toutes les alertes ont été traitées. Aucune action n'est requise pour le moment.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Alertes de fraude</h2>
        <Button onClick={fetchAlerts} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>
      
      <div className="space-y-4">
        {alerts.map(alert => (
          <Card key={alert.id} className={`border-l-4 ${
            alert.alertLevel === 'high' 
              ? 'border-l-red-500' 
              : alert.alertLevel === 'medium' 
              ? 'border-l-orange-500' 
              : 'border-l-yellow-500'
          }`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className={`h-5 w-5 ${
                      alert.alertLevel === 'high' 
                        ? 'text-red-500' 
                        : alert.alertLevel === 'medium' 
                        ? 'text-orange-500' 
                        : 'text-yellow-500'
                    }`} />
                    Transaction suspecte {getAlertBadge(alert.alertLevel)}
                  </CardTitle>
                  <CardDescription>
                    {formatDate(alert.date)} • ID: {alert.transactionId.substring(0, 8)}
                  </CardDescription>
                </div>
                {getStatusBadge(alert.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Client</h4>
                  <p className="font-medium">{alert.userName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Montant</h4>
                  <p className="font-medium">{formatCurrency(alert.amount)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Marchand</h4>
                  <p className="font-medium">{alert.merchant}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Score de risque</h4>
                  <p className="font-medium">{parseFloat(alert.riskScore) * 100}%</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500">Motif de l'alerte</h4>
                <p className="mt-1">{alert.reason}</p>
              </div>
            </CardContent>
            {alert.status === 'pending' && (
              <CardFooter className="pt-2">
                <div className="flex gap-3 w-full">
                  <Button 
                    onClick={() => handleAction(alert.id, 'confirm')} 
                    variant="default"
                    className="flex-1"
                    disabled={!!processing}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Confirmer la fraude
                  </Button>
                  <Button 
                    onClick={() => handleAction(alert.id, 'reject')} 
                    variant="outline"
                    className="flex-1" 
                    disabled={!!processing}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rejeter l'alerte
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AlertsList;
