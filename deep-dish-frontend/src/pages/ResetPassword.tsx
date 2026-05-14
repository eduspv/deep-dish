import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { httpClient } from '@/services/httpClient';
import { Loader2 } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();

  const token = params.get('token') ?? '';
  const email = params.get('email') ?? '';
  const tipo  = (params.get('tipo') ?? 'cliente') as 'cliente' | 'restaurante';

  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState('');

  const loginHref = tipo === 'restaurante' ? '/restaurant/login' : '/login';

  const passwordMismatch = submitAttempted && confirmPassword !== password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const endpoint = tipo === 'restaurante'
        ? '/restaurante/reset-password'
        : '/cliente/reset-password';
      await httpClient.post(endpoint, {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      navigate(loginHref + '?reset=1');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message;
      setError(msg ?? 'Erro ao redefinir senha. O link pode ter expirado.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-card text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-foreground">Link inválido</h1>
          <p className="text-sm text-muted-foreground">
            Este link de recuperação é inválido. Solicite um novo.
          </p>
          <Link to={loginHref} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
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
          <h1 className="font-display text-2xl font-bold text-foreground">Nova senha</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Escolha uma senha segura para a conta <strong>{email}</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={passwordMismatch ? 'border-destructive focus-visible:ring-destructive' : ''}
              required
            />
            {passwordMismatch && (
              <p className="text-xs text-destructive">As senhas não coincidem.</p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full min-h-[44px]" disabled={loading || passwordMismatch}>
            {loading
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
              : 'Redefinir senha'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          <Link to={loginHref} className="font-medium text-primary hover:text-primary/80 transition-colors">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;