import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { toast } from '@/components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

// Schéma de validation pour le profil
const profileSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phoneNumber: z.string().regex(/^\+?[0-9\s-]{6,}$/, "Numéro de téléphone invalide").optional(),
});

// Schéma de validation pour le mot de passe
const passwordSchema = z.object({
  currentPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  newPassword: z.string()
    .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
    .regex(/[0-9]/, "Doit contenir au moins un chiffre")
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const Profile = () => {
  const { 
    user, 
    updateProfile, 
    changePassword,
    fetchUserProfile
  } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Formulaires
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || ''
    }
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  });

  // Initialiser le formulaire avec les données utilisateur
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user, profileForm]);

  const onSubmitProfile = async (data: ProfileFormData) => {
  try {
    setIsLoading(true);
    await updateProfile(data);
    toast.success("Profil mis à jour avec succès");
    setIsEditing(false);
    await fetchUserProfile();
  } catch (error) {
    toast.error("Erreur lors de la mise à jour du profil");
  } finally {
    setIsLoading(false);
  }
};

  // Soumettre le changement de mot de passe
  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      setIsLoading(true);
      await changePassword(data.currentPassword, data.newPassword);
      toast.success("Mot de passe changé avec succès");
      passwordForm.reset();
    } catch (error) {
      toast.error("Erreur lors du changement de mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour générer les initiales de l'avatar
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  if (!user) {
  return (
    <div className="flex items-center justify-center h-64">
      <p>Chargement des informations du profil...</p>
    </div>
  );
}

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profil utilisateur</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Informations personnelles */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Mettez à jour vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input 
                    id="firstName" 
                    {...profileForm.register('firstName')} 
                    disabled={!isEditing || isLoading}
                  />
                  {profileForm.formState.errors.firstName && (
                    <p className="text-sm text-red-500">
                      {profileForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input 
                    id="lastName" 
                    {...profileForm.register('lastName')} 
                    disabled={!isEditing || isLoading}
                  />
                  {profileForm.formState.errors.lastName && (
                    <p className="text-sm text-red-500">
                      {profileForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Téléphone</Label>
                  <Input 
                    id="phoneNumber" 
                    {...profileForm.register('phoneNumber')} 
                    disabled={!isEditing || isLoading}
                  />
                  {profileForm.formState.errors.phoneNumber && (
                    <p className="text-sm text-red-500">
                      {profileForm.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    value={user?.email || ''} 
                    disabled 
                  />
                </div>
              </div>
              
              <Separator />
              
              {isEditing ? (
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Enregistrement...' : 'Sauvegarder'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                </div>
              ) : (
                <Button 
                  type="button" 
                  onClick={() => setIsEditing(true)}
                >
                  Modifier le profil
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
        
        {/* Section droite (Avatar + Sécurité) */}
        <div className="space-y-6">
          {/* Carte Avatar */}
          <Card>
            <CardHeader>
              <CardTitle>Photo de profil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl">
                  {getInitials(user?.firstName)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 w-full">
                <Button variant="outline" className="w-full" disabled>
                  Changer la photo
                </Button>
                <Button variant="ghost" className="w-full text-red-500" disabled>
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Carte Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Authentification à deux facteurs</h3>
                  <p className="text-sm text-gray-500">Ajoute une couche supplémentaire de sécurité</p>
                </div>
                <Switch disabled />
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Alertes de connexion</h3>
                  <p className="text-sm text-gray-500">Soyez notifié des nouvelles connexions</p>
                </div>
                <Switch defaultChecked disabled />
              </div>
              
              <Separator />
              
              {/* Modal de changement de mot de passe */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Changer le mot de passe
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Changer votre mot de passe</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Mot de passe actuel</Label>
                      <Input 
                        type="password" 
                        {...passwordForm.register('currentPassword')} 
                        disabled={isLoading}
                      />
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-sm text-red-500">
                          {passwordForm.formState.errors.currentPassword.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Nouveau mot de passe</Label>
                      <Input 
                        type="password" 
                        {...passwordForm.register('newPassword')} 
                        disabled={isLoading}
                      />
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-sm text-red-500">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Changement en cours...' : 'Confirmer'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        disabled={isLoading}
                        onClick={() => passwordForm.reset()}
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;