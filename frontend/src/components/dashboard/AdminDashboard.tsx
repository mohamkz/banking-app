import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertTriangle, DollarSign, Users, CreditCard } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonthlyStats, DailyStats } from '@/api/admins';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    totalTransactionsAmount: 0
  });
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [activeAlerts, setActiveAlerts] = useState(0);
  
  const { addNotification } = useNotifications();
  const { 
    adminGetSystemStats, 
    adminGet12MonthStats, 
    adminGetDailyStats 
  } = useAuth();
  
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch stats from our AuthContext
        const stats = await adminGetSystemStats();
        const monthly = await adminGet12MonthStats();
        const daily = await adminGetDailyStats();
        
        setSystemStats(stats);
        setMonthlyStats(monthly);
        setDailyStats(daily);
        
        setActiveAlerts(Math.floor(Math.random() * 10) + 1);
        
        setTimeout(() => {
          addNotification({
            title: 'Alerte de fraude',
            message: 'Nouvelle transaction suspecte détectée. Vérifiez les alertes.',
            type: 'warning'
          });
        }, 5000);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminData();
  }, [adminGetSystemStats, adminGet12MonthStats, adminGetDailyStats, addNotification]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format large numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };
  
  const getFraudChartData = () => {

    return monthlyStats.map(stat => ({
      name: stat.month.substring(0, 3), 
      detected: Math.round(stat.transactionCount * 0.08), 
      prevented: Math.round(stat.transactionCount * 0.06),
    }));
  };
  
  if (isLoading) {
    return (
      <div className="grid place-items-center h-64">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-stats">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Utilisateurs</p>
              <h3 className="text-2xl font-bold mt-1">
                {formatNumber(systemStats.totalUsers)}
              </h3>
              <p className="text-xs text-green-600 mt-1">
                +{Math.floor(Math.random() * 5) + 1}% ce mois
              </p>
            </div>
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users size={20} />
            </div>
          </div>
        </Card>
        
        <Card className="card-stats">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Comptes actifs</p>
              <h3 className="text-2xl font-bold mt-1">
                {formatNumber(systemStats.totalAccounts)}
              </h3>
              <p className="text-xs text-green-600 mt-1">
                +{Math.floor(Math.random() * 7) + 2}% ce mois
              </p>
            </div>
            <div className="h-10 w-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
              <CreditCard size={20} />
            </div>
          </div>
        </Card>
        
        <Card className="card-stats">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Volume de transactions</p>
              <h3 className="text-2xl font-bold mt-1">
                {formatCurrency(systemStats.totalTransactionsAmount)}
              </h3>
              <p className="text-xs text-green-600 mt-1">
                +{Math.floor(Math.random() * 6) + 3}% ce mois
              </p>
            </div>
            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
              <DollarSign size={20} />
            </div>
          </div>
        </Card>
        
        <Card className="card-stats">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Alertes actives</p>
              <h3 className="text-2xl font-bold mt-1">
                {activeAlerts}
              </h3>
              <p className="text-xs text-red-600 mt-1">
                +{Math.floor(Math.random() * 10) + 5}% cette semaine
              </p>
            </div>
            <div className="h-10 w-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle size={20} />
            </div>
          </div>
        </Card>
      </div>
    
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité de transactions</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <Tabs defaultValue="count">
              <TabsList className="mb-4">
                <TabsTrigger value="count">Nombre</TabsTrigger>
                <TabsTrigger value="value">Valeur</TabsTrigger>
              </TabsList>
              <TabsContent value="count" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={dailyStats.slice(-7)} // Prend les 7 derniers jours
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tickFormatter={(value) => {
                      // Format the date to only show the day of week
                      const date = new Date(value);
                      return ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][date.getDay()];
                    }} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatNumber(value as number), 'Transactions']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="transactionCount" 
                      name="Transactions"
                      stroke="#3E92CC" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="value" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={dailyStats.slice(-7)} // Prend les 7 derniers jours
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tickFormatter={(value) => {
                      // Format the date to only show the day of week
                      const date = new Date(value);
                      return ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][date.getDay()];
                    }} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value as number), 'Valeur']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalAmount" 
                      name="Montant"
                      stroke="#1E5F74" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Statistiques mensuelles</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={monthlyStats.slice(-6)} // Prend les 6 derniers mois
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === "transactionCount") {
                      return [formatNumber(value as number), 'Transactions'];
                    }
                    return [formatCurrency(value as number), 'Montant'];
                  }}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="transactionCount" 
                  name="Transactions" 
                  fill="#4CAF50" 
                  radius={[4, 4, 0, 0]} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="totalAmount" 
                  name="Montant total" 
                  stroke="#D8315B"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;