
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Lock, TrendingUp, BellRing, CreditCard, Search, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };
  
  const features = [
    {
      icon: <Shield className="h-10 w-10 text-blue-500" />,
      title: 'Détection en temps réel',
      description: 'Notre algorithme analyse chaque transaction en temps réel pour détecter les comportements frauduleux.'
    },
    {
      icon: <Lock className="h-10 w-10 text-green-500" />,
      title: 'Sécurité renforcée',
      description: 'Protégez vos actifs bancaires avec notre système avancé de protection contre la fraude.'
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-purple-500" />,
      title: 'Analyse comportementale',
      description: 'Identifiez les schémas de fraude grâce à des analyses comportementales sophistiquées.'
    },
    {
      icon: <BellRing className="h-10 w-10 text-orange-500" />,
      title: 'Alertes instantanées',
      description: 'Recevez des notifications immédiates en cas de détection d\'activités suspectes.'
    },
    {
      icon: <Search className="h-10 w-10 text-red-500" />,
      title: 'Investigations détaillées',
      description: 'Outils d\'investigation puissants pour analyser en profondeur les transactions suspectes.'
    },
    {
      icon: <CreditCard className="h-10 w-10 text-indigo-500" />,
      title: 'Protection de compte',
      description: 'Protégez vos comptes contre les accès non autorisés et les tentatives de fraude.'
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-bank-primary to-bank-accent px-4 sm:px-6 lg:px-8 py-20 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="lg:w-1/2">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                FraudWatch
                <span className="block text-2xl sm:text-3xl mt-2 font-medium">
                  Système de détection des fraudes bancaires
                </span>
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Protégez vos clients et vos actifs bancaires contre la fraude avec notre système d'intelligence artificielle de pointe.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-bank-primary hover:bg-gray-100"
                  onClick={handleGetStarted}
                >
                  {isAuthenticated ? 'Accéder au tableau de bord' : 'Commencer'}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/register')}
                >
                  {isAuthenticated ? 'En savoir plus' : '30 jours d\'essai gratuit'}
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 sm:w-80 sm:h-80 bg-white/10 rounded-full absolute top-4 left-4 animate-pulse-alert"></div>
                <div className="w-64 h-64 sm:w-80 sm:h-80 backdrop-blur-sm bg-white/20 rounded-full relative z-10 flex items-center justify-center">
                  <Shield className="h-24 w-24 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Alert banner */}
      <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <p className="font-medium">
          Démonstration: Utilisez admin@example.com / password (admin) ou user@example.com / password (client) pour vous connecter.
        </p>
      </div>
      
      {/* Features section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Une protection complète contre la fraude bancaire
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre plateforme utilise l'intelligence artificielle pour détecter et prévenir les fraudes avant qu'elles ne causent des dommages.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-bank-primary py-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à sécuriser votre système bancaire?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez les milliers d'institutions financières qui font confiance à FraudWatch pour protéger leurs clients et leurs actifs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-bank-primary hover:bg-gray-100"
              onClick={handleGetStarted}
            >
              {isAuthenticated ? 'Accéder au tableau de bord' : 'Essai gratuit'}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10"
            >
              Démonstration
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="text-xl font-bold">FraudWatch</span>
              </div>
              <p className="text-gray-400">
                Système avancé de détection des fraudes bancaires basé sur l'intelligence artificielle.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Produit</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Fonctionnalités</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Tarifs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Démonstration</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Témoignages</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Entreprise</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">À propos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Carrières</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Légal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Conditions d'utilisation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Politique de confidentialité</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Sécurité</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} FraudWatch. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
