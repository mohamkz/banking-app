import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Account } from '@/api/accounts';

interface AccountSelectorProps {
  accounts: Account[];
  selectedAccountId: number;
  onSelectAccount: (account: Account) => void;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({ 
  accounts, 
  selectedAccountId, 
  onSelectAccount 
}) => {
  const handleSelectionChange = (value: string) => {
    const selectedAccount = accounts.find(acc => acc.id.toString() === value);
    if (selectedAccount) {
      onSelectAccount(selectedAccount);
    }
  };

  return (
    <Select
      value={selectedAccountId.toString()}
      onValueChange={handleSelectionChange}
    >
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Sélectionner un compte" />
      </SelectTrigger>
      <SelectContent>
        {accounts.map(account => (
          <SelectItem key={account.id} value={account.id.toString()}>
            <div className="flex justify-between items-center">
              <span>Compte - {account.id}  {account.currency}</span>
              <span className="text-muted-foreground ml-2">●●●● {account.accountNumber.slice(-4)}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AccountSelector;