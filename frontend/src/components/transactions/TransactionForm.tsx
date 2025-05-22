import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, CreditCard, ArrowRight, Banknote } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/sonner';
import { Separator } from '@/components/ui/separator';


interface TransactionFormProps {
  onSuccess?: () => void;
}

const TransactionForm = ({ onSuccess }: TransactionFormProps) => {
  const { 
    user, 
    accounts, 
    selectedAccount, 
    transfer,
    fetchAccounts,
  } = useAuth();
  
  const [amount, setAmount] = useState('');
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ 
    amount?: string; 
    receiverAccountNumber?: string 
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [transactionResult, setTransactionResult] = useState<{
    success: boolean;
    transaction?: any;
    error?: string;
  } | null>(null);

  const validate = () => {
    const newErrors: typeof errors = {};
    let isValid = true;
    
    if (!amount || isNaN(Number(amount))) {
      newErrors.amount = 'Montant invalide';
      isValid = false;
    } else if (Number(amount) <= 0) {
      newErrors.amount = 'Le montant doit être positif';
      isValid = false;
    } else if (selectedAccount && Number(amount) > selectedAccount.balance) {
      newErrors.amount = 'Solde insuffisant';
      isValid = false;
    }
    
    // Validation du numéro de compte
    if (!receiverAccountNumber) {
      newErrors.receiverAccountNumber = 'Numéro de compte requis';
      isValid = false;
    } else if (receiverAccountNumber.length < 5) {
      newErrors.receiverAccountNumber = 'Numéro de compte trop court';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validate()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !selectedAccount) return;

    setIsLoading(true);
    
    try {
      const transaction = await transfer(
        selectedAccount.accountNumber,
        receiverAccountNumber,
        Number(amount),
        description
      );

      setTransactionResult({ 
        success: true,
        transaction 
      });
      
      toast.success(
        `Transfert de ${amount}€ effectué`,
        { description: `Vers le compte ${receiverAccountNumber}` }
      );
      
      await fetchAccounts();
      onSuccess?.(); // Appel de la callback en cas de succès

    } catch (error: any) {
      setTransactionResult({
        success: false,
        error: error.message || "Une erreur est survenue lors du transfert"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (!transactionResult) return null;
    
    if (transactionResult.success) {
      return (
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <h3 className="text-center text-xl font-medium mb-4">Transfert réussi!</h3>
          
          <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">De</span>
              <span className="font-medium">{selectedAccount?.accountNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">À</span>
              <span className="font-medium">{receiverAccountNumber}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Montant</span>
              <span className="font-medium text-lg">{amount} {selectedAccount?.currency}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Heure</span>
              <span className="font-medium">{new Date().toLocaleTimeString()}</span>
            </div>
            {description && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <span className="text-gray-600 block mb-1">Description</span>
                <span className="text-sm">{description}</span>
              </div>
            )}
          </div>

          <Button 
            onClick={() => {
              setTransactionResult(null);
              setAmount('');
              setReceiverAccountNumber('');
              setDescription('');
              setStep(1);
            }}
            className="w-full"
            variant="outline"
          >
            Nouveau transfert
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <h3 className="text-center text-xl font-medium text-red-600">Échec du transfert</h3>
        <p className="text-center text-gray-600">{transactionResult.error}</p>
        
        <Button 
          onClick={() => {
            setTransactionResult(null);
            setStep(1);
          }}
          className="w-full"
          variant="outline"
        >
          Réessayer
        </Button>
      </div>
    );
  };

  const renderStepOne = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Montant</Label>
        <div className="relative">
          <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`pl-10 ${errors.amount ? 'border-red-500' : ''}`}
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="receiverAccount">Numéro de compte destinataire</Label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            id="receiverAccount"
            placeholder="Entrez le numéro de compte"
            value={receiverAccountNumber}
            onChange={(e) => setReceiverAccountNumber(e.target.value)}
            className={`pl-10 ${errors.receiverAccountNumber ? 'border-red-500' : ''}`}
          />
        </div>
        {errors.receiverAccountNumber && (
          <p className="text-sm text-red-500">{errors.receiverAccountNumber}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Motif (optionnel)</Label>
        <Textarea
          id="description"
          placeholder="Description du transfert..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      
      <Button
        className="w-full"
        disabled={isLoading || !selectedAccount}
        onClick={handleNextStep}
      >
        Continuer <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  const renderStepTwo = () => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-center">Vérification des informations</h3>
    <div className="p-4 bg-gray-50 rounded-lg space-y-3 border">
      <div className="flex justify-between">
        <span>Compte source :</span>
        <span className="font-medium">{selectedAccount?.accountNumber}</span>
      </div>
      <div className="flex justify-between">
        <span>Destinataire :</span>
        <span className="font-medium">{receiverAccountNumber}</span>
      </div>
      <div className="flex justify-between">
        <span>Montant :</span>
        <span className="font-medium">{amount} {selectedAccount?.currency}</span>
      </div>
      {description && (
        <div>
          <span className="text-gray-600 block mb-1">Motif :</span>
          <span>{description}</span>
        </div>
      )}
    </div>
    <div className="flex justify-between space-x-2">
      <Button variant="outline" onClick={() => setStep(1)}>Retour</Button>
      <Button onClick={handleSubmit} disabled={isLoading}>
        Confirmer le transfert
      </Button>
    </div>
  </div>
);


  return (
    <div>
      {transactionResult ? renderResult() : (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`rounded-full p-2 ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  <span className="h-5 w-5 flex items-center justify-center">1</span>
                </div>
                <span className={step >= 1 ? 'font-medium' : 'text-gray-500'}>Détails</span>
              </div>
              <div className="flex-1 h-1 mx-4 bg-gray-200">
                <div className={`h-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} style={{ width: '0%' }}></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`rounded-full p-2 ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  <span className="h-5 w-5 flex items-center justify-center">2</span>
                </div>
                <span className={step >= 2 ? 'font-medium' : 'text-gray-500'}>Confirmation</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Label className="text-sm">Compte source</Label>
              <Badge variant="outline" className="ml-2 px-2 py-0 text-xs">
                Solde: {selectedAccount?.balance} {selectedAccount?.currency}
              </Badge>
            </div>
            <Input 
              value={selectedAccount?.accountNumber || "Aucun compte sélectionné"} 
              disabled 
            />
          </div>
          
          <Separator className="my-4" />
          
          {step === 1 ? renderStepOne() : renderStepTwo()}
        </>
      )}
    </div>
  );
};

export default TransactionForm;