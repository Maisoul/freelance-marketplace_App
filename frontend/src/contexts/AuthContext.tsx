import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axios';
import { isAxiosError } from 'axios';
import { AuthContext, type User, type RegisterData, type AuthError } from './AuthContext.types';

interface APIErrorResponse {
  detail: string;
  field?: string;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get<User>('/api/auth/user/');
      setUser(response.data);
      setLoading(false);
  } catch {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await axiosInstance.post<{ access: string; refresh: string }>(
        '/api/token/',
        { email, password }
      );
      const { access, refresh } = response.data;
      
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Fetch user and then redirect using the fresh user state
      const me = await axiosInstance.get<User>('/api/auth/user/');
      setUser(me.data);
      if (me.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (me.data.role === 'expert') {
        navigate('/expert/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setError({
          message: (error.response?.data as APIErrorResponse).detail || 'Login failed',
          field: (error.response?.data as APIErrorResponse).field
        });
      } else {
        setError({ message: 'An unexpected error occurred' });
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/login');
  };

  const register = async (userData: RegisterData) => {
    try {
      setError(null);
      // Choose endpoint based on role in payload if provided; default to client
      const endpoint = '/api/accounts/register/client/';
      const response = await axiosInstance.post<{ access?: string; refresh?: string }>(endpoint, userData);
      const { access, refresh } = response.data;
      
      if (response.data?.access && response.data?.refresh) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
      }
      await fetchUser();
      navigate('/client/dashboard');
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setError({
          message: (error.response?.data as APIErrorResponse).detail || 'Registration failed',
          field: (error.response?.data as APIErrorResponse).field
        });
      } else {
        setError({ message: 'An unexpected error occurred' });
      }
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

