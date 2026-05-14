import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const formatCpf = (digits: string) => {
  const d = onlyDigits(digits).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpfDigits, setCpfDigits] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitAttempted(true);
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, cpfDigits, password);
      navigate('/verify-email?tipo=cliente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background pt-16 px-4 pb-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-card p-8 shadow-card animate-fade-in-up">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <span className="text-xl font-bold text-primary-foreground font-display">D</span>
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-foreground">Crie sua conta</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Comece a usar o Deep Dish agora</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              inputMode="numeric"
              autoComplete="off"
              value={formatCpf(cpfDigits)}
              onChange={(e) => {
                const nextDigits = onlyDigits(e.target.value).slice(0, 11);
                setCpfDigits(nextDigits);
              }}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={submitAttempted && confirmPassword !== password ? 'border-destructive focus-visible:ring-destructive' : ''}
              required
            />
            {submitAttempted && confirmPassword !== password && (
              <p className="text-xs text-destructive">As senhas não coincidem.</p>
            )}
          </div>
          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive animate-fade-in" role="alert">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full min-h-[44px]" disabled={loading}>
            {loading ? 'Criando...' : 'Criar conta'}
          </Button>
        </form>
        <div className="space-y-1.5 text-center text-sm text-muted-foreground">
          <p>
            Já tem conta?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Entrar
            </Link>
          </p>
          <p>
            É um restaurante?{' '}
            <Link to="/restaurant/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Cadastrar restaurante
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
