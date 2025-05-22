import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/api/transactions';
import { formatTransactionDate } from '@/lib/utils';

interface TransactionsListProps {
  transactions: Transaction[];
  accountNumber?: string;
}

const getStatusBadge = (status: string) => {
  const statusMap = {
    COMPLETED: { label: 'Complété', variant: 'success' },
    PENDING: { label: 'En attente', variant: 'warning' },
    FAILED: { label: 'Échoué', variant: 'destructive' }
  };

  return statusMap[status] || { label: 'Inconnu', variant: 'default' };
};

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions, 
  accountNumber 
}) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Aucune transaction trouvée
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          {!accountNumber && <TableHead>Compte</TableHead>}
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          const isIncoming = accountNumber
            ? transaction.receiverAccountNumber === accountNumber
            : transaction.amount >= 0;

          const { label, variant } = getStatusBadge(transaction.status);

          return (
            <TableRow key={`${transaction.timestamp}-${transaction.senderAccountNumber}`}>
              <TableCell>{formatTransactionDate(transaction.timestamp)}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {transaction.description}
              </TableCell>
              
              {!accountNumber && (
                <TableCell>
                  {isIncoming 
                    ? `De: ${transaction.senderAccountNumber}`
                    : `À: ${transaction.receiverAccountNumber}`}
                </TableCell>
              )}

              <TableCell 
                className={`font-medium ${
                  isIncoming ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {isIncoming ? '+' : '-'}
                {Math.abs(transaction.amount).toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </TableCell>

              <TableCell>
                <Badge variant={variant}>
                  {label}
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TransactionsList;