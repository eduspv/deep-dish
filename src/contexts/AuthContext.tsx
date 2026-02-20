import React, { createContext, useContext, useState, useCallback } from 'react';
import { User } from '@/types';
import { mockUser, mockRestaurantUser } from '@/mocks/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginRestaurant: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  registerRestaurant: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (_email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setUser(mockUser);
    setIsLoading(false);
  }, []);

  const loginRestaurant = useCallback(async (_email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setUser(mockRestaurantUser);
    setIsLoading(false);
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setUser({ ...mockUser, name, email });
    setIsLoading(false);
  }, []);

  const registerRestaurant = useCallback(async (name: string, email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setUser({ ...mockRestaurantUser, name, email });
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, loginRestaurant, register, registerRestaurant, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
