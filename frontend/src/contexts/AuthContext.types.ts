import { createContext } from 'react';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'client' | 'expert';
  firstName: string;
  lastName: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  firstName: string;
  lastName: string;
}

export interface AuthError {
  message: string;
  field?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);