import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  DialogHeader, 
  DialogTitle,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';


const depositSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Veuillez entrer un montant valide' })
    .min(0.01, 'Minimum 0.01')
    .max(10000, 'Maximum 10 000'),
  description: z.string().max(100).optional(),
});

const DepositForm = ({ account, onSuccess, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: '',
      description: ''
    }
  });

  const { deposit } = useAuth();

  const onSubmit = async (data) => {
    try {
      await deposit(account.accountNumber, data.amount, data.description || '');
      toast.success('Dépôt effectué avec succès');
      reset();
      onSuccess();
    } catch (error) {
      console.error('Deposit failed:', error);
      toast.error('Échec du dépôt: Veuillez réessayer');
    }
  };

  return (
    <>
      <DialogHeader className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-6">
        <div className="absolute right-4 top-4">
          {/* <DialogClose asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose> */}
        </div>
        <DialogTitle className="text-xl font-bold">Dépôt sur votre compte</DialogTitle>
        <p className="text-emerald-100 text-sm font-medium mt-1">
          Compte se terminant par {account.accountNumber.slice(-4)}
        </p>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Montant</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">€</span>
            </div>
            <Input
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              placeholder="Ex: 100.00"
              className="pl-8 bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Description</label>
          <Textarea
            {...register('description')}
            placeholder="Description du dépôt (optionnel)"
            rows={3}
            className="bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>

        <DialogFooter className="pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto border-gray-300"
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement...
              </>
            ) : 'Effectuer le dépôt'}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default DepositForm;