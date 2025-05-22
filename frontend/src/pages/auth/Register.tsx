import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export const Register = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="mb-8 text-center">
        <div className="flex justify-center items-center mb-2">
          <Shield className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FraudWatch</h1>
        <p className="text-gray-600 dark:text-gray-400">Système de détection des fraudes bancaires</p>
      </div>
      
      <RegisterForm />
      
      <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} FraudWatch | Tous droits réservés
        </p>
        <div className="mt-2 text-sm space-x-4">
          <Link to="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            Conditions d'utilisation
          </Link>
          <Link to="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            Politique de confidentialité
          </Link>
          <Link to="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            Aide
          </Link>
        </div>
      </div>
    </div>
  );
}; 