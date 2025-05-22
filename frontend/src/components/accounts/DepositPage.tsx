import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DepositModal from '@/components/accounts/DepositModal';

const DepositPage = () => {
  const { accountNumber } = useParams();
  const { accounts } = useAuth();
  const account = accounts.find((acc) => acc.accountNumber === accountNumber);
  
  if (!account) return <div className="text-center text-red-500">Compte non trouvé</div>;
  
  return (
    <div className="py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Gérer le compte se terminant par {account.accountNumber.slice(-4)}
      </h1>
      <div className="w-full max-w-md mx-auto">
        <DepositModal account={account} />
      </div>
    </div>
  );
};

export default DepositPage;