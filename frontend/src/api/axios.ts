
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { isTokenExpired as checkTokenExpired } from '../utils/jwt';


interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8001/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
  timeout: 10000, 
});

const getAuthToken = () => localStorage.getItem('token');

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      if (config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      if (checkTokenExpired(token)) {
        clearAuthStorage();
        redirectToLogin(getRedirectParam());
        return Promise.reject(new Error('Token expired'));
      }

      if (config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const redirectToLogin = (params: string = '') => {
  window.location.href = `/login${params ? `?${params}` : ''}`;
};

const getRedirectParam = () => {
  const currentPath = window.location.pathname;
  return currentPath !== '/login' 
    ? `redirect=${encodeURIComponent(currentPath)}` 
    : '';
};

export default axiosInstance;
