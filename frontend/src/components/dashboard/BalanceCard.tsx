import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CopyIcon, Banknote, CalendarDays, EuroIcon, ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import  DepositModal  from '@/components/accounts/DepositModal';

interface BalanceCardProps {
  account: {
    accountNumber: string;
    balance: number;
    currency: string;
    status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
    type: string;
    openingDate: string;
  };
}

const BalanceCard: React.FC<BalanceCardProps> = ({ account }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: account.currency || 'EUR',
    }).format(amount);
  };

  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account.accountNumber);
    toast.success('Numéro de compte copié dans le presse-papiers');
  };

  const statusColor = {
    ACTIVE: 'bg-green-100 text-green-700',
    FROZEN: 'bg-yellow-100 text-yellow-700',
    CLOSED: 'bg-red-100 text-red-700',
  };

  return (
    <Card className="w-full max-w-3xl shadow-md rounded-2xl">
      <CardHeader className="border-b bg-muted/50 rounded-t-2xl px-6 py-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-primary">
            Détails du compte
          </CardTitle>
          <Badge className={`capitalize px-2 py-1 text-sm bg-green-100 text-green-700 `}>
            Actif
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Solde */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-4 bg-muted rounded-xl shadow-sm gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Solde disponible</p>
            <p className="text-4xl font-bold text-green-600">{formatCurrency(account.balance)}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-muted-foreground">Type de compte</p>
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium capitalize">Cheque</p>
            </div>
          </div>
        </div>

        {/* Numéro de compte */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Numéro de compte</p>
          <div className="flex items-center justify-between flex-wrap bg-gray-100 p-3 rounded-lg">
            <p className="font-mono tracking-wider text-base">
              {account.accountNumber.match(/.{1,4}/g)?.join(' ')}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="h-8 w-8"
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <EuroIcon className="h-4 w-4" /> Devise
            </p>
            <p className="font-medium text-lg">{account.currency}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <CalendarDays className="h-4 w-4" /> Date d'ouverture
            </p>
            <p className="font-medium text-lg">{formatDate(account.openingDate)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            to={`/user/transactions`}
            className="flex-1 text-white font-medium rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 transition-all flex items-center justify-center gap-2">
              Consulter l'historique
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <DepositModal account={account} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
