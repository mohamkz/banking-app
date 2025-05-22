import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import BalanceCard from '@/components/dashboard/BalanceCard';
import TransactionsList from '@/components/dashboard/TransactionsList';
import SpendingChart from '@/components/dashboard/SpendingChart';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import AccountSelector from '@/components/accounts/AccountSelector';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { accountNumber } = useParams<{ accountNumber: string }>();
  const navigate = useNavigate();

  const {
    user,
    isAdmin,
    accounts,
    selectedAccount,
    selectAccount,
    getAllTransfersForAccount
  } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin && accounts.length > 0 && !accountNumber) {
      navigate(`/user/dashboard/${accounts[0].accountNumber}`, { replace: true });
    }
  }, [isAdmin, accounts, accountNumber, navigate]);

  useEffect(() => {
    const loadTransactions = async () => {
      if (!selectedAccount?.accountNumber || isAdmin) return;
      
      setIsLoading(true);
      try {
        const data = await getAllTransfersForAccount(selectedAccount.accountNumber);
        setTransactions(data);
      } catch (error) {
        console.error("Erreur lors du chargement des transactions :", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [selectedAccount, isAdmin, getAllTransfersForAccount]);

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isLoading || !selectedAccount) {
    return (
      <div className="flex justify-center items-center h-64">
        <Skeleton className="w-12 h-12 rounded-full animate-spin border-4 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        {accounts.length > 1 && (
          <AccountSelector
            accounts={accounts}
            selectedAccountId={selectedAccount.id}
            onSelectAccount={(acc) => navigate(`/user/dashboard/${acc.accountNumber}`)}
          />
        )}
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <BalanceCard account={selectedAccount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionsList 
          transactions={transactions} 
          accountNumber={selectedAccount.accountNumber} 
        />
        <SpendingChart transactions={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;