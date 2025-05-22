
import axiosInstance from './axios';

export type UserRole = 'ROLE_ADMIN' | 'ROLE_USER';

export interface User {
  id: number;
  email: string;
  roles: UserRole[];
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}


export interface AuthResponse {
  token: string;
  user: User;
}

function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const authService = {
 login: async (email: string, password: string): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<{ token: string }>('/auth/login', {
    email,
    password,
  });

  const payload = parseJwt(data.token);
  if (!payload) throw new Error('Invalid token format');

  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

  const profile = await authService.getProfile();
  if (!profile) throw new Error('Impossible de récupérer le profil');

  const user: User = {
    ...profile,
    roles: payload.roles || [],
  };

  return {
    token: data.token,
    user,
  };
},


  register: async (data: RegisterData): Promise<boolean> => {
    await axiosInstance.post('/auth/register', data);
    return true; 
  }, 

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      clearAuthData(); 
    }
  },

  async getProfile(): Promise<User> {
    const { data } = await axiosInstance.get('/users/me');
    if (!data.roles || !Array.isArray(data.roles)) {
      data.roles = [];
    }
    return data;
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const { data } = await axiosInstance.put<User>('/users/me', profileData);
    return data;
  },

  changePassword: async (currentPassword:  string, newPassword: string): Promise<void> => {
    await axiosInstance.patch('/users/me/password', {
      currentPassword,
      newPassword
    });
  },
};


export const initializeAuth = (): void => {
  const token = localStorage.getItem('token');
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp - 300 < now;
}

export const storeAuthData = (data: AuthResponse): void => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
};

export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axiosInstance.defaults.headers.common['Authorization'];
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;

  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
};


export const updateProfile = async (user: User): Promise<User> => {
  const {data} = await axiosInstance.put<User>('/auth/profile', user);
  return data;
}

