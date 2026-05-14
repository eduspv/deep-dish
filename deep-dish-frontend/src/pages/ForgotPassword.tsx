import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { httpClient } from '@/services/httpClient';
import { Loader2, MailCheck } from 'lucide-react';

interface Props {
  tipo: 'cliente' | 'restaurante';
}

const ForgotPassword: React.FC<Props> = ({ tipo }) => {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const loginHref = tipo === 'restaurante' ? '/restaurant/login' : '/login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = tipo === 'restaurante'
        ? '/restaurante/forgot-password'
        : '/cliente/forgot-password';
      await httpClient.post(endpoint, { email });
      setSent(true);
    } catch {
      setError('Erro ao processar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-6 rounded-2xl bg-card p-8 shadow-card animate-fade-in-up text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-1.5">
            <h1 className="font-display text-2xl font-bold text-foreground">Verifique seu e-mail</h1>
            <p className="text-sm text-muted-foreground">
              Se o e-mail <strong>{email}</strong> estiver cadastrado, você receberá um link para redefinir sua senha em breve.
            </p>
            <p className="text-xs text-muted-foreground">Não encontrou? Verifique a caixa de spam.</p>
          </div>
          <Link to={loginHref} className="block text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Voltar ao login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-card p-8 shadow-card animate-fade-in-up">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Esqueceu a senha?</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Informe seu e-mail e enviaremos um link para criar uma nova senha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full min-h-[44px]" disabled={loading}>
            {loading
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</>
              : 'Enviar link de recuperação'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Lembrou a senha?{' '}
          <Link to={loginHref} className="font-medium text-primary hover:text-primary/80 transition-colors">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;