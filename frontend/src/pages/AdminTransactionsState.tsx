import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import TransactionsListAdmin from "@/components/dashboard/TransactionsListAdmin";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const AdminDashboardStats = () => {
  const { adminGetSystemStats, adminGet12MonthStats, adminGetDailyStats } =
    useAuth();
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    totalTransactionsAmount: 0,
  });
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    setIsLoading(true);
    try {
      const [stats, monthly, daily] = await Promise.all([
        adminGetSystemStats(),
        adminGet12MonthStats(),
        adminGetDailyStats(),
      ]);

      setSystemStats(stats);
      setMonthlyStats(monthly);
      setDailyStats(daily);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      toast.error("Impossible de charger les statistiques");
    } finally {
      setIsLoading(false);
    }
  };

  // Préparer les données pour le graphique en camembert des comptes utilisateurs
  const pieChartData = [
    { name: "Utilisateurs", value: systemStats.totalUsers, color: "#0088FE" },
    { name: "Comptes", value: systemStats.totalAccounts, color: "#00C49F" },
  ];

  // Formater les données mensuelles pour le graphique
  const formattedMonthlyData = monthlyStats.map((stat) => ({
    ...stat,
    formattedAmount: formatCurrency(stat.totalAmount),
  }));

  if (isLoading) {
    return (
      <div className="grid place-items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Statistiques du système</h2>
        <Button variant="outline" size="sm" onClick={fetchAllStats}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Comptes bancaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStats.totalAccounts}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStats.totalTransactions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Montant total échangé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(systemStats.totalTransactionsAmount)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets pour différents graphiques */}
      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="monthly">Statistiques mensuelles</TabsTrigger>
          <TabsTrigger value="daily">Statistiques journalières</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="transactions">Dernières transactions</TabsTrigger>
        </TabsList>

        {/* Statistiques mensuelles */}
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Évolution sur 12 mois</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyStats}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(label) => `Mois: ${label}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="transactionCount"
                      name="Nombre de transactions"
                      stroke="#0088FE"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalAmount"
                      name="Montant total"
                      stroke="#00C49F"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistiques journalières */}
        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Activité journalière récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyStats}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#0088FE" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#00C49F"
                    />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "Montant total")
                          return formatCurrency(value);
                        return value;
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="transactionCount"
                      name="Nombre de transactions"
                      fill="#0088FE"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="totalAmount"
                      name="Montant total"
                      fill="#00C49F"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution */}
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des utilisateurs et comptes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Dernières transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionsListAdmin />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardStats;
