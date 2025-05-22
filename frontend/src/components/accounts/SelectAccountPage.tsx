import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const SelectAccountPage = () => {
  const { accounts, selectAccount, createAccount, isLoading } = useAuth();

  const handleCreateAccount = async () => {
    try {
      const newAccount = await createAccount();
      selectAccount(newAccount);
    } catch (error) {
      console.error('Failed to create account', error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Sélectionnez un compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {accounts.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Vous n'avez pas encore de compte bancaire.
            </p>
          ) : (
            accounts.map(account => (
              <Button
                key={account.id}
                variant="outline"
                className="w-full flex justify-between items-center py-6"
                onClick={() => selectAccount(account)}
              >
                <div className="text-left">
                  <p className="font-medium">Compte - {account.id} - {account.currency}</p>
                  <p className="text-sm text-muted-foreground">
                    ●●●● {account.accountNumber.slice(-4)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {account.balance.toLocaleString()} {account.currency}
                  </p>
                </div>
              </Button>
            ))
          )}

          <Button
            onClick={handleCreateAccount}
            disabled={isLoading}
            className="w-full mt-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              "+ Ouvrir un nouveau compte"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectAccountPage;