// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Cliente, Restaurante } from "@/types";
import { User } from "@/types";
import { getAuthHeaders } from "@/services/api";

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
  user: Cliente | Restaurante | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  loginRestaurant: (email: string, password: string) => Promise<void>;

  register: (name: string, email: string, cpf: string, password: string) => Promise<void>;
  registerRestaurant: (data: RestaurantRegisterData) => Promise<boolean>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // -------- Restaurar sessão ao carregar (token + /me)
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const tipo = localStorage.getItem("tipo_usuario");

    if (!token || !tipo) {
      setIsLoading(false);
      return;
    }

    const endpoint = tipo === "restaurante" ? `${BASE}/restaurante/me` : `${BASE}/cliente/me`;
    fetch(endpoint, { headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem("jwt");
          localStorage.removeItem("tipo_usuario");
          localStorage.removeItem("user");
          setUser(null);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      })
      .catch(() => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("tipo_usuario");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // -------- LOGIN CLIENTE (API real)
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE}/cliente/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.error === "Email ou senha inválidos"
          ? "Email ou senha inválidos"
          : data?.error?.email?.[0] || data?.error || "Erro ao entrar.";
        throw new Error(msg);
      }

      if (!data?.token) throw new Error("Resposta inválida do servidor.");

      localStorage.setItem("jwt", data.token);
      localStorage.setItem("tipo_usuario", "cliente");

      const meRes = await fetch(`${BASE}/cliente/me`, {
        headers: getAuthHeaders(),
      });
      if (!meRes.ok) throw new Error("Erro ao carregar dados do usuário.");
      const cliente = await meRes.json();
      setUser(cliente);
      localStorage.setItem("user", JSON.stringify(cliente));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // -------- LOGIN RESTAURANTE (API real)
  const loginRestaurant = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE}/restaurante/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.error === "Email ou senha inválidos"
          ? "Email ou senha inválidos"
          : data?.error?.email?.[0] || data?.error || "Erro ao entrar.";
        throw new Error(msg);
      }

      if (!data?.token) throw new Error("Resposta inválida do servidor.");

      localStorage.setItem("jwt", data.token);
      localStorage.setItem("tipo_usuario", "restaurante");

      const meRes = await fetch(`${BASE}/restaurante/me`, {
        headers: getAuthHeaders(),
      });
      if (!meRes.ok) throw new Error("Erro ao carregar dados do restaurante.");
      const restaurante = await meRes.json();
      setUser(restaurante);
      localStorage.setItem("user", JSON.stringify(restaurante));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // -------- REGISTER CLIENTE (API real)
  const register = useCallback(async (name: string, email: string, cpf: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE}/cliente/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, cpf, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // backend manda { error, details } (422) ou { error } (outros)
        const details = data?.details;
        const firstDetail =
          details && typeof details === "object"
            ? (Object.values(details).flat() as unknown[]).find((v) => typeof v === "string")
            : null;

        const msg =
          (typeof firstDetail === "string" && firstDetail) ||
          data?.error ||
          "Erro ao criar conta.";

        throw new Error(msg);
      }

      if (!data?.token) throw new Error("Resposta inválida do servidor.");

      localStorage.setItem("jwt", data.token);
      localStorage.setItem("tipo_usuario", data.type ?? "cliente");

      if (data?.cliente) {
        setUser(data.cliente);
        localStorage.setItem("user", JSON.stringify(data.cliente));
        return;
      }

      // fallback: buscar dados completos
      const meRes = await fetch(`${BASE}/cliente/me`, { headers: getAuthHeaders() });
      if (!meRes.ok) throw new Error("Conta criada, mas falhou ao carregar dados do usuário.");
      const cliente = await meRes.json();
      setUser(cliente);
      localStorage.setItem("user", JSON.stringify(cliente));
    } finally {
      setIsLoading(false);
    }
  }, []);

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
        localStorage.setItem("user", JSON.stringify(result.restaurante)); 
        setUser(result.restaurante); // importante pra isAuthenticated funcionar

        if (result.type) {
          localStorage.setItem("tipo_usuario", result.type);
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
    localStorage.removeItem("user");
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