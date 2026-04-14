import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RestaurantLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginRestaurant } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginRestaurant(email, password);
      navigate('/restaurant/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background pt-16 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-card p-8 shadow-card animate-fade-in-up">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <span className="text-xl font-bold text-accent-foreground font-display">R</span>
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-foreground">Painel do Restaurante</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Acesse o gerenciamento do seu restaurante</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="admin@restaurante.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive animate-fade-in" role="alert">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full min-h-[44px]" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <div className="space-y-1.5 text-center text-sm text-muted-foreground">
          <p>
            Não tem conta?{' '}
            <Link to="/restaurant/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Cadastrar restaurante
            </Link>
          </p>
          <p>
            É cliente?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Acesse aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLogin;
