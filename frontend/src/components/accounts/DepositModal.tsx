import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import DepositForm from './DepositForm';
import SuccessView from './SuccessView';

const DepositModal = ({ account }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Réinitialiser l'état de succès quand le modal se ferme
  const handleOpenChange = (open) => {
    if (!open) {
      setTimeout(() => {
        setIsSuccess(false);
      }, 300);
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full rounded-xl h-12 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300 transition-all font-medium flex items-center justify-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Déposer
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
        {isSuccess ? (
          <SuccessView 
            account={account} 
            onClose={() => setIsOpen(false)}
          />
        ) : (
          <DepositForm 
            account={account} 
            onSuccess={() => setIsSuccess(true)} 
            onClose={() => setIsOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;