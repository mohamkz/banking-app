import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const CreateAccountPage = () => {
  const { createAccount, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    try {
      await createAccount();
      navigate('/user/account-selection'); 
    } catch (error) {
      console.error("Échec de la création du compte", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Créer votre premier compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p>Vous n'avez actuellement aucun compte bancaire.</p>
          <p>Veuillez créer un compte pour continuer.</p>
          
          <Button
            onClick={handleCreateAccount}
            disabled={isLoading}
            className="w-full mt-4"
            size="lg"
          >
            {isLoading ? "Création en cours..." : "Créer mon premier compte"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAccountPage;