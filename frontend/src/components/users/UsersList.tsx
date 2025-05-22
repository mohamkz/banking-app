import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RefreshCw, User, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const UsersList = () => {
  const { adminGetAllUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminGetAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Impossible de charger les utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cette fonction devrait être implémentée dans votre API réelle
  const handleUpdateStatus = async (userId, status) => {
    try {
      // Simulation de mise à jour - à remplacer par un appel API réel
      toast.success(`Le statut de l'utilisateur a été mis à jour avec succès`);
      
      // Mise à jour locale 
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, status } 
            : user
        )
      );
      
      // Mise à jour de l'utilisateur sélectionné si nécessaire
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Une erreur est survenue lors de la mise à jour du statut');
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get initials from firstName and lastName
  const getInitials = (user) => {
    if (!user || (!user.firstName && !user.lastName)) return '??';
    return `${user.firstName ? user.firstName.charAt(0) : ''}${user.lastName ? user.lastName.charAt(0) : ''}`.toUpperCase();
  };
  
  // Get status badge (adapté à votre structure actuelle)
  const getStatusBadge = (user) => {
    // Comme vous n'avez pas de champ status dans votre API, on utilise une valeur par défaut "active"
    const status = user.status || 'active';
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspendu</Badge>;
      case 'deleted':
        return <Badge className="bg-red-100 text-red-800">Supprimé</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    }
  };
  
  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter(user => 
    (user.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  
  // Obtenir le nom complet de l'utilisateur
  const getFullName = (user) => {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur sans nom';
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={fetchUsers} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Date de mise à jour</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(user)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{getFullName(user)}</p>
                          <p className="text-sm text-gray-500">{user.phoneNumber || 'Pas de téléphone'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getStatusBadge(user)}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>{formatDate(user.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserDetails(true);
                            }}
                          >
                            <User className="h-4 w-4 mr-2" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {!user.status || user.status === 'active' ? (
                            <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(user.id, 'suspended')}
                              className="text-yellow-600"
                            >
                              Suspendre le compte
                            </DropdownMenuItem>
                          ) : user.status === 'suspended' ? (
                            <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(user.id, 'active')}
                              className="text-green-600"
                            >
                              Réactiver le compte
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuItem 
                            onClick={() => handleUpdateStatus(user.id, 'deleted')}
                            className="text-red-600"
                          >
                            Supprimer le compte
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
            <DialogDescription>
              Informations détaillées sur l'utilisateur
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">
                    {getInitials(selectedUser)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Prénom</Label>
                  <p className="font-medium">{selectedUser.firstName || 'Non renseigné'}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Nom</Label>
                  <p className="font-medium">{selectedUser.lastName || 'Non renseigné'}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Téléphone</Label>
                  <p className="font-medium">{selectedUser.phoneNumber || 'Non renseigné'}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Statut</Label>
                  <p>{getStatusBadge(selectedUser)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">ID</Label>
                  <p className="font-medium">{selectedUser.id}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Date de création</Label>
                  <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Date de mise à jour</Label>
                  <p className="font-medium">{formatDate(selectedUser.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            {(!selectedUser?.status || selectedUser?.status === 'active') ? (
              <Button 
                variant="outline" 
                onClick={() => handleUpdateStatus(selectedUser.id, 'suspended')}
                className="text-yellow-600"
              >
                Suspendre le compte
              </Button>
            ) : selectedUser?.status === 'suspended' ? (
              <Button 
                variant="outline" 
                onClick={() => handleUpdateStatus(selectedUser.id, 'active')}
                className="text-green-600"
              >
                Réactiver le compte
              </Button>
            ) : null}
            <Button 
              variant="destructive" 
              onClick={() => selectedUser && handleUpdateStatus(selectedUser.id, 'deleted')}
            >
              Supprimer le compte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersList;