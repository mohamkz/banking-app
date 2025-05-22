
import { decodeJwt, JwtPayload } from './jwt';

export interface StoredUser {
  email: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}


export const storeAuthData = (data: {
  token: string;
  user?: Partial<StoredUser> | JwtPayload;
}): void => {
  if (typeof window === 'undefined') return;

  try {
   
    localStorage.setItem('token', data.token);

    // Extraction des données utilisateur
    let userData: StoredUser | null = null;
    const decodedToken = decodeJwt(data.token);

    if (data.user) {
      userData = {
        email: (data.user as JwtPayload).sub || (data.user as StoredUser).email || '',
        roles: (data.user as JwtPayload).roles || (data.user as StoredUser).roles || [],
        firstName: (data.user as StoredUser).firstName,
        lastName: (data.user as StoredUser).lastName,
        phoneNumber: (data.user as StoredUser).phoneNumber
      };
    } else if (decodedToken) {
      userData = {
        email: decodedToken.sub,
        roles: decodedToken.roles || []
      };
    }

    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  } catch (error) {
    console.error('Erreur lors du stockage des données auth:', error);
    clearAuthData();
  }
};


export const getCurrentUser = (): StoredUser | null => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erreur lors de la lecture des données utilisateur:', error);
    return null;
  }
};


export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};


export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.roles.includes('ROLE_ADMIN') ?? false;
};


export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};


export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;

  const token = getAuthToken();
  if (!token) return false;

  const user = getCurrentUser();
  return !!user && !isTokenExpired(token);
};

/**
 * Vérifie si le token est expiré (utilise jwt.ts)
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwt(token);
  if (!payload) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
};

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 */
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.roles.includes(role) ?? false;
};

/**
 * Récupère les données utilisateur complètes depuis le token
 * (Utile pour les infos non stockées dans le localStorage)
 */
export const getFullUserData = (): (JwtPayload & StoredUser) | null => {
  const token = getAuthToken();
  if (!token) return null;

  const decoded = decodeJwt(token);
  const storedUser = getCurrentUser();

  return decoded ? { ...decoded, ...storedUser } : null;
};