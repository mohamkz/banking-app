import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Transaction } from '@/api/transactions';
import { formatTransactionDate } from '@/lib/utils';

interface SpendingChartProps {
  transactions: Transaction[];
}

const SpendingChart: React.FC<SpendingChartProps> = ({ transactions }) => {
  const [view, setView] = React.useState('monthly');
  
  // Formatage des données mensuelles
  const monthlyData = React.useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      name: new Date(2023, i, 1).toLocaleString('fr-FR', { month: 'short' }),
      amount: 0
    }));

    transactions.forEach(transaction => {
      const month = new Date(transaction.timestamp).getMonth();
      if (month >= 0 && month < 12) {
        months[month].amount += Math.abs(transaction.amount);
      }
    });

    return months;
  }, [transactions]);

  // Formatage des données par catégorie (ajuster selon vos données)
  const categoryData = React.useMemo(() => {
    const categories: Record<string, number> = {};

    transactions.forEach(transaction => {
      const category = transaction.description.split(' ')[0] || 'Autre';
      categories[category] = (categories[category] || 0) + Math.abs(transaction.amount);
    });

    return Object.entries(categories).map(([name, value], index) => ({
      name,
      value,
      color: `hsl(${index * 137 % 360}, 70%, 50%)` // Génération de couleurs
    }));
  }, [transactions]);

  // Formatage monétaire
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  // Tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow rounded border border-gray-100">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse des dépenses</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" onValueChange={setView}>
          <TabsList className="mb-4">
            <TabsTrigger value="monthly">Par mois</TabsTrigger>
            <TabsTrigger value="category">Par catégorie</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  fill="#3E92CC" 
                  radius={[4, 4, 0, 0]} 
                  name="Dépenses"
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="category" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SpendingChart;