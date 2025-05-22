import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { 
  MonthlyStats, 
  DailyStats, 
  SystemStats, 
  UserRes, 
  AccountRes 
} from '@/api/admins';
import { Transaction } from '@/api/transactions';

// Couleurs pour les graphiques
const COLORS = ['#3E92CC', '#1E5F74', '#0A2463', '#D8315B', '#FF9800'];

const Analytics = () => {
  const { 
    isAdmin, 
    adminGetSystemStats, 
    adminGet12MonthStats, 
    adminGetDailyStats,
    adminGetAllUsers,
    adminGetAllAccounts,
    adminGetAllTransactions
  } = useAuth();

  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [users, setUsers] = useState<UserRes[]>([]);
  const [accounts, setAccounts] = useState<AccountRes[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Charger toutes les données nécessaires
        const [stats, monthly, daily, usersData, accountsData, transactionsData] = await Promise.all([
          adminGetSystemStats(),
          adminGet12MonthStats(),
          adminGetDailyStats(),
          adminGetAllUsers(),
          adminGetAllAccounts(),
          adminGetAllTransactions()
        ]);
        
        setSystemStats(stats);
        setMonthlyStats(monthly);
        setDailyStats(daily);
        setUsers(usersData);
        setAccounts(accountsData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, adminGetSystemStats, adminGet12MonthStats, adminGetDailyStats, adminGetAllUsers, adminGetAllAccounts, adminGetAllTransactions]);

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Afficher un loader pendant le chargement des données
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Chargement des données...</span>
      </div>
    );
  }
  
  // Formatter les montants en euros
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Formatter les grands nombres
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  // Préparer les données pour le graphique de répartition des soldes
  const prepareBalanceDistribution = () => {
    const balanceRanges = [
      { range: '0-100', count: 0 },
      { range: '100-500', count: 0 },
      { range: '500-1000', count: 0 },
      { range: '1000-5000', count: 0 },
      { range: '5000+', count: 0 }
    ];

    accounts.forEach(account => {
      const balance = account.balance;
      if (balance < 100) balanceRanges[0].count++;
      else if (balance < 500) balanceRanges[1].count++;
      else if (balance < 1000) balanceRanges[2].count++;
      else if (balance < 5000) balanceRanges[3].count++;
      else balanceRanges[4].count++;
    });

    return balanceRanges;
  };

  // Préparer les données pour le graphique des tranches d'utilisateurs par date d'inscription
  const prepareUserGrowth = () => {
    // Convertir les dates en mois et compter les utilisateurs
    const usersByMonth: Record<string, number> = {};
    
    users.forEach(user => {
      const date = new Date(user.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!usersByMonth[monthYear]) {
        usersByMonth[monthYear] = 0;
      }
      usersByMonth[monthYear]++;
    });

    // Convertir en tableau et trier par date
    return Object.entries(usersByMonth)
      .map(([monthYear, count]) => ({ monthYear, count }))
      .sort((a, b) => {
        const [monthA, yearA] = a.monthYear.split('/').map(Number);
        const [monthB, yearB] = b.monthYear.split('/').map(Number);
        return (yearA - yearB) || (monthA - monthB);
      });
  };

  // Préparer les données pour le graphique des types de transactions
  const prepareTransactionTypes = () => {
    const types: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      if (!types[transaction.type]) {
        types[transaction.type] = 0;
      }
      types[transaction.type]++;
    });

    return Object.entries(types).map(([type, count]) => ({
      type,
      count,
      percentage: (count / transactions.length) * 100
    }));
  };
  
  // Préparer les montants de transactions par jour
  const dailyTransactionData = dailyStats.slice(-14); // Derniers 14 jours
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord analytique</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique 1: Évolution des transactions (nombre et montant) */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des transactions</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <Tabs defaultValue="count">
              <TabsList className="mb-4">
                <TabsTrigger value="count">Nombre</TabsTrigger>
                <TabsTrigger value="amount">Montant</TabsTrigger>
              </TabsList>
              <TabsContent value="count" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${formatNumber(value as number)}`, 'Transactions']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="transactionCount" 
                      name="Nombre de transactions" 
                      stroke="#3E92CC" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="amount" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value as number), 'Montant total']} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="totalAmount" 
                      name="Montant des transactions" 
                      stroke="#0A2463" 
                      fill="#0A2463" 
                      fillOpacity={0.2} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Graphique 2: Distribution des soldes de comptes */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution des soldes de comptes</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepareBalanceDistribution()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value) => [formatNumber(value as number), 'Comptes']} />
                <Legend />
                <Bar 
                  dataKey="count" 
                  name="Nombre de comptes" 
                  fill="#1E5F74" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Graphique 3: Types de transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Types de transactions</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareTransactionTypes()}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ type, percentage }) => `${type}: ${percentage.toFixed(1)}%`}
                >
                  {prepareTransactionTypes().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatNumber(value as number), 'Transactions']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Graphique 4: Évolution des inscriptions utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des inscriptions</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={prepareUserGrowth()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthYear" />
                <YAxis />
                <Tooltip formatter={(value) => [formatNumber(value as number), 'Nouveaux utilisateurs']} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Nouveaux utilisateurs" 
                  stroke="#D8315B" 
                  fill="#D8315B" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;