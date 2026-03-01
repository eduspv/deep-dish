// src/pages/RestaurantRegister.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const formatCnpj = (digits: string) => {
  const d = onlyDigits(digits).slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
};

const RestaurantRegister: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cnpjDigits, setCnpjDigits] = useState("");
  const [tipo, setTipo] = useState("");
  const [endereco, setEndereco] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { registerRestaurant, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    if (!tipo) {
      setError("Selecione o tipo do restaurante.");
      return;
    }

    try {
      await registerRestaurant({
        name,
        email,
        password,
        cnpj: cnpjDigits,
        tipo,
        endereco,
      });
      navigate("/restaurant/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar restaurante. Tente novamente.");
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
              autoComplete="off"
              placeholder="00.000.000/0000-00"
              value={formatCnpj(cnpjDigits)}
              onChange={(e) => {
                const nextDigits = onlyDigits(e.target.value).slice(0, 14);
                setCnpjDigits(nextDigits);
              }}
              required
            />
          </div>

          <div>
            <Label htmlFor="tipo-restaurante">Tipo do restaurante</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger id="tipo-restaurante">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bifes">Bifes</SelectItem>
                <SelectItem value="vegetariano">Vegetariano</SelectItem>
                <SelectItem value="churrasco">Churrasco</SelectItem>
                <SelectItem value="frutos do mar">Frutos do mar</SelectItem>
                <SelectItem value="comida caseira">Comida caseira</SelectItem>
              </SelectContent>
            </Select>
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

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

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