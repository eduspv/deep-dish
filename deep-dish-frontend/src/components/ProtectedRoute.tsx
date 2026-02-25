// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Cliente, Restaurante, User } from "@/types";

type TipoUsuario = "cliente" | "restaurante";

interface Props {
  children?: React.ReactElement;
  allow: TipoUsuario[]; // quem pode acessar esse grupo de rotas
}

// ---- Type guards (diferencia pelo "formato" do objeto)
function isRestaurante(user: User): user is Restaurante {
  return !!user && typeof user === "object" && "cnpj" in user;
}

function isCliente(user: User): user is Cliente {
  return !!user && typeof user === "object" && "cpf" in user;
}

function getTipo(user: User): TipoUsuario | null {
  if (isRestaurante(user)) return "restaurante";
  if (isCliente(user)) return "cliente";
  return null;
}

const ProtectedRoute: React.FC<Props> = ({ children, allow }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // coloque um spinner se quiser

  // Não logado
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Descobre o tipo pelo objeto (cpf/cnpj)
  const tipo = getTipo(user);
  if (!tipo) {
    return <Navigate to="/login" replace />;
  }

  // Logado, mas sem permissão pra esse grupo
  if (!allow.includes(tipo)) {
    return (
      <Navigate
        to={tipo === "restaurante" ? "/restaurant/dashboard" : "/app"}
        replace
      />
    );
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;