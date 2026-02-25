// src/pages/RestaurantRegister.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const RestaurantRegister: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [tipo, setTipo] = useState("");
  const [endereco, setEndereco] = useState("");
  const [password, setPassword] = useState("");

  const { registerRestaurant, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ok = await registerRestaurant({
        name,
        email,
        password,
        cnpj,
        tipo,
        endereco,
      });

      if (ok) {
        navigate("/restaurant/dashboard");
      }

  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background pt-16 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-card p-8 shadow-card">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <span className="text-xl font-bold text-accent-foreground">R</span>
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            Cadastrar restaurante
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Comece a gerenciar filas e reservas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do restaurante</Label>
            <Input
              id="name"
              placeholder="Meu Restaurante"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@restaurante.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input
              id="cnpj"
              type="text"
              inputMode="numeric"
              placeholder="CNPJ da empresa"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="tipo-restaurante">Tipo do restaurante</Label>
            <Input
              id="tipo-restaurante"
              type="text"
              placeholder="Bife ou italiano..."
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              type="text"
              placeholder="American Office tower sala..."
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link
            to="/restaurant/login"
            className="font-medium !text-black hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RestaurantRegister;