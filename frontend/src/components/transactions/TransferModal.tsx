import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import TransactionForm from '@/components/transactions/TransactionForm';
import { Button } from '@/components/ui/button';
import { ArrowRight, Banknote, ArrowLeftRight } from 'lucide-react';

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransferModal = ({ open, onOpenChange }: TransferModalProps) => {
  const handleSuccess = () => {
    onOpenChange(false); // Ferme la modal après un transfert réussi
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] p-0 overflow-hidden bg-white rounded-lg shadow-lg border-0">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar / Visual Element */}
          <div className="bg-gradient-to-br from-blue-600 to-violet-600 p-6 text-white md:w-1/3 flex flex-col justify-between">
            <div>
              <ArrowLeftRight className="h-12 w-12 mb-6 text-white/80" />
              <h3 className="text-xl font-semibold mb-2">Transfert rapide</h3>
              <p className="text-sm text-white/80">
                Envoyez de l'argent en toute sécurité vers n'importe quel compte bancaire.
              </p>
            </div>
            <div className="hidden md:block mt-6">
              <div className="flex items-center space-x-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-white/80"></div>
                <span>Transfert instantané</span>
              </div>
              <div className="flex items-center space-x-2 text-sm mt-2">
                <div className="h-2 w-2 rounded-full bg-white/80"></div>
                <span>Sans frais supplémentaires</span>
              </div>
              <div className="flex items-center space-x-2 text-sm mt-2">
                <div className="h-2 w-2 rounded-full bg-white/80"></div>
                <span>100% sécurisé</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 md:w-2/3">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold flex items-center">
                <Banknote className="mr-2 h-6 w-6 text-blue-600" />
                Nouveau transfert
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Complétez les informations ci-dessous pour effectuer votre virement.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2">
              <TransactionForm onSuccess={handleSuccess} />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-gray-50 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferModal;