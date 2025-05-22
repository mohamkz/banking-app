// components/dashboard/RecentTransactions.tsx
import React from 'react';
import { Transaction } from '@/api/transactions';
import { formatTransactionDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const { selectedAccount } = useAuth();

  if (!transactions.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Aucune transaction récente
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => {
        const isCredit = transaction.receiverAccountNumber === selectedAccount?.accountNumber;
        
        return (
          <div key={`${transaction.timestamp}-${transaction.amount}`} 
               className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">
                {formatTransactionDate(transaction.timestamp)}
              </p>
            </div>
            <span className={`font-medium ${isCredit ? 'text-green-500' : 'text-red-500'}`}>
              {isCredit ? '+' : '-'}
              {Math.abs(transaction.amount).toFixed(2)} €
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default RecentTransactions;