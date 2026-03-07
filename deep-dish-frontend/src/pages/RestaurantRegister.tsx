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
import { TIPOS_RESTAURANTE } from "@/constants/tipos";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const formatCnpj = (digits: string) => {
  const d = onlyDigits(digits).slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
};

const formatCep = (digits: string) => {
  const d = onlyDigits(digits).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
};

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

const RestaurantRegister: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cnpjDigits, setCnpjDigits] = useState("");
  const [tipo, setTipo] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cepDigits, setCepDigits] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { registerRestaurant, isLoading } = useAuth();
  const navigate = useNavigate();

  const cepValue = formatCep(cepDigits);
  const cepRaw = onlyDigits(cepDigits);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!tipo) {
      setError("Selecione o tipo do restaurante.");
      return;
    }

    if (cepRaw.length !== 8) {
      setError("CEP deve ter 8 dígitos (ex: 12345-678).");
      return;
    }

    if (estado.length !== 2) {
      setError("Selecione o estado (UF).");
      return;
    }

    if (!logradouro.trim()) {
      setError("Preencha o logradouro.");
      return;
    }

    if (!numero.trim()) {
      setError("Preencha o número.");
      return;
    }

    if (!bairro.trim()) {
      setError("Preencha o bairro.");
      return;
    }

    if (!cidade.trim()) {
      setError("Preencha a cidade.");
      return;
    }

    try {
      await registerRestaurant({
        name,
        email,
        password,
        cnpj: cnpjDigits,
        tipo,
        logradouro: logradouro.trim(),
        numero: numero.trim(),
        complemento: complemento.trim() || undefined,
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        estado,
        cep: cepRaw.length === 8 ? formatCep(cepRaw) : cepValue,
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
                {TIPOS_RESTAURANTE.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="12345-678"
              value={cepValue}
              onChange={(e) => setCepDigits(onlyDigits(e.target.value).slice(0, 8))}
              maxLength={9}
              required
            />
          </div>

          <div>
            <Label htmlFor="logradouro">Logradouro</Label>
            <Input
              id="logradouro"
              type="text"
              placeholder="Rua, avenida..."
              value={logradouro}
              onChange={(e) => setLogradouro(e.target.value)}
              maxLength={255}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                type="text"
                placeholder="123"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                maxLength={20}
                required
              />
            </div>
            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                type="text"
                placeholder="Sala, bloco..."
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                maxLength={100}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              type="text"
              placeholder="Bairro"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                type="text"
                placeholder="Cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                maxLength={100}
                required
              />
            </div>
            <div>
              <Label htmlFor="estado">Estado (UF)</Label>
              <Select value={estado} onValueChange={setEstado} required>
                <SelectTrigger id="estado">
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {UFS.map((uf) => (
                    <SelectItem key={uf} value={uf}>
                      {uf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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