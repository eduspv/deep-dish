import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RestaurantRegister: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { registerRestaurant, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerRestaurant(name, email, password);
    navigate('/restaurant/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background pt-16 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-card p-8 shadow-card">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent"><span className="text-xl font-bold text-accent-foreground">R</span></div>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Cadastrar restaurante</h1>
          <p className="mt-1 text-sm text-muted-foreground">Comece a gerenciar filas e reservas</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label htmlFor="name">Nome do restaurante</Label><Input id="name" placeholder="Meu Restaurante" value={name} onChange={e => setName(e.target.value)} required /></div>
          <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" placeholder="admin@restaurante.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
          <div><Label htmlFor="password">Senha</Label><Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Cadastrando...' : 'Cadastrar'}</Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Já tem conta? <Link to="/restaurant/login" className="font-medium text-primary hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
};

export default RestaurantRegister;
