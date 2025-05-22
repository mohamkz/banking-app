import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RefreshCw, Search, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatCurrency = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const AdminAccountsList = () => {
  const { adminGetAllAccounts } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = accounts.filter(account => 
        account.accountNumber.toLowerCase().includes(term) ||
        (account.userId && account.userId.toString().includes(term))
      );
      setFilteredAccounts(filtered);
    } else {
      setFilteredAccounts(accounts);
    }
  }, [searchTerm, accounts]);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await adminGetAllAccounts();
      setAccounts(data);
      setFilteredAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Impossible de charger les comptes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFreezeAccount = (accountId) => {
    // Simulation - À implémenter avec une API réelle
    toast.success(`Compte ${accountId} gelé avec succès`);
  };

  const handleCloseAccount = (accountId) => {
    // Simulation - À implémenter avec une API réelle
    toast.success(`Compte ${accountId} clôturé avec succès`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Comptes bancaires</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par numéro de compte..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchAccounts}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {filteredAccounts.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            Aucun compte trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° de compte</TableHead>
                  <TableHead>ID Client</TableHead>
                  <TableHead>Solde</TableHead>
                  <TableHead>Devise</TableHead>
                  <TableHead>Date d'ouverture</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.accountNumber}</TableCell>
                    <TableCell>{account.userId}</TableCell>
                    <TableCell className={`font-medium ${account.balance < 0 ? 'text-red-500' : ''}`}>
                      {formatCurrency(account.balance, account.currency)}
                    </TableCell>
                    <TableCell>{account.currency}</TableCell>
                    <TableCell>{formatDate(account.openingDate)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAccount(account);
                              setShowAccountDetails(true);
                            }}
                          >
                            Détails du compte
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleFreezeAccount(account.id)}
                            className="text-yellow-600"
                          >
                            Geler le compte
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleCloseAccount(account.id)}
                            className="text-red-600"
                          >
                            Clôturer le compte
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={showAccountDetails} onOpenChange={setShowAccountDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails du compte</DialogTitle>
            <DialogDescription>
              Informations détaillées sur le compte bancaire
            </DialogDescription>
          </DialogHeader>
          
          {selectedAccount && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">N° de compte</Label>
                  <p className="font-medium">{selectedAccount.accountNumber}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">ID utilisateur</Label>
                  <p className="font-medium">{selectedAccount.userId}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Solde</Label>
                  <p className={`font-medium ${selectedAccount.balance < 0 ? 'text-red-500' : ''}`}>
                    {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Devise</Label>
                  <p className="font-medium">{selectedAccount.currency}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Date d'ouverture</Label>
                  <p className="font-medium">{formatDate(selectedAccount.openingDate)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">ID interne</Label>
                  <p className="font-medium">{selectedAccount.id}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleFreezeAccount(selectedAccount?.id)}
              className="text-yellow-600"
            >
              Geler le compte
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleCloseAccount(selectedAccount?.id)}
            >
              Clôturer le compte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminAccountsList;