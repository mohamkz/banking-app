import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

const SuccessView = ({ account, onClose }) => {
  return (
    <div className="text-center p-8 space-y-4">
      <div className="mx-auto rounded-full bg-emerald-100 p-3 w-16 h-16 flex items-center justify-center mb-2">
        <CreditCard className="h-8 w-8 text-emerald-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-800">Dépôt effectué avec succès</h3>
      <p className="text-gray-600">
        Votre dépôt sur le compte se terminant par {account.accountNumber.slice(-4)} a été traité correctement.
      </p>
      <Button 
        onClick={onClose} 
        className="mt-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
      >
        Fermer
      </Button>
    </div>
  );
};

export default SuccessView;