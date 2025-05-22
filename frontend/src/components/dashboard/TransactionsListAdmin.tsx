// Nouveau composant à ajouter dans le même fichier ou dans un fichier séparé
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import toast from 'sonner';
import { RefreshCw } from 'lucide-react';



const TransactionsListAdmin = () => {
  const { adminGetAllTransactions } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await adminGetAllTransactions();
        setTransactions(data.slice(0, 50)); // Limite à 50 transactions
      } catch (error) {
        console.error('Error loading transactions:', error);

      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Expéditeur</TableHead>
              <TableHead>Destinataire</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Aucune transaction trouvée
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={`${transaction.timestamp}-${transaction.amount}`}>
                  <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                  <TableCell className="font-medium">
                    {transaction.senderAccountNumber}
                  </TableCell>
                  <TableCell className="font-medium">
                    {transaction.receiverAccountNumber}
                  </TableCell>
                  <TableCell className={transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {formatCurrency(Math.abs(transaction.amount))}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {transaction.type.toLowerCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {transactions.length >= 50 && (
        <div className="text-sm text-muted-foreground text-center">
          Affichage des 50 dernières transactions
        </div>
      )}
    </div>
  );
};

export default TransactionsListAdmin;