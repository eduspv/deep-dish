// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useCallback } from "react";
import { User } from "@/types";
import { mockUser, mockRestaurantUser } from "@/mocks/user";

const BASE = import.meta.env.VITE_API_URL;

type RestaurantRegisterData = {
  name: string;
  email: string;
  password: string;
  cnpj: string;
  tipo: string;
  endereco: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  loginRestaurant: (email: string, password: string) => Promise<void>;

  register: (name: string, email: string, password: string) => Promise<void>;
  registerRestaurant: (data: RestaurantRegisterData) => Promise<boolean>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // -------- LOGIN NORMAL (mock)
  const login = useCallback(async (_email: string, _password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setUser(mockUser);
    setIsLoading(false);
  }, []);

  // -------- LOGIN RESTAURANTE (mock)
  const loginRestaurant = useCallback(async (_email: string, _password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setUser(mockRestaurantUser);
    setIsLoading(false);
  }, []);

  // -------- REGISTER NORMAL (mock)
  const register = useCallback(
    async (name: string, email: string, _password: string) => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 700));
      setUser({ ...mockUser, name, email });
      setIsLoading(false);
    },
    []
  );

  // -------- REGISTER RESTAURANTE (REAL API)
  const registerRestaurant = useCallback(
    async (data: RestaurantRegisterData): Promise<boolean> => {
      setIsLoading(true);

      try {
        const response = await fetch(`${BASE}/restaurante/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          console.error("Status:", response.status);
          console.error("Body:", result);
          return false;
        }

        if (!result?.token) {
          console.error("Resposta inválida do servidor (token ausente)");
          return false;
        }

        // ✅ salva dados no localStorage
        localStorage.setItem("jwt", result.token);

        if (result.tipo_usuario) {
          localStorage.setItem("tipo_usuario", result.tipo_usuario);
        }

        console.log("Restaurante registrado com sucesso:", result);

        return true;
      } catch (error) {
        console.error("Erro ao registrar restaurante:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("jwt");
    localStorage.removeItem("tipo_usuario");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginRestaurant,
        register,
        registerRestaurant,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};