import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe sua senha'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const RestaurantLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);
  const { loginRestaurant } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const passwordReset = params.get('reset') === '1';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (serverError && errorRef.current) {
      errorRef.current.focus();
    }
  }, [serverError]);

  const onSubmit = async (values: LoginFormValues) => {
    setServerError('');
    try {
      await loginRestaurant(values.email, values.password);
      navigate('/restaurant/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erro ao entrar. Tente novamente.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo + badge de portal */}
        <div className="mb-6 flex items-center justify-between">
          <span className="font-display text-3xl font-bold text-foreground">Deep Dish</span>
          <span className="rounded-full border border-primary/30 bg-primary/8 px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] uppercase text-primary">
            Restaurante
          </span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-4xl font-bold text-foreground text-balance leading-tight">
            Acesse o painel
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Entre com as credenciais do seu restaurante
          </p>
        </div>

        {/* Sucesso de redefinição de senha */}
        {passwordReset && (
          <motion.div
            className="mb-6 flex items-center gap-2.5 rounded-lg bg-emerald-500/10 px-3.5 py-3 text-sm text-emerald-700 dark:text-emerald-400"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            role="status"
          >
            <CheckCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            Senha redefinida com sucesso. Faça login com a nova senha.
          </motion.div>
        )}

        {/* Erro do servidor */}
        {serverError && (
          <motion.div
            ref={errorRef}
            className="mb-6 rounded-lg bg-destructive/10 px-3.5 py-3 text-sm text-destructive"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            role="alert"
            tabIndex={-1}
          >
            {serverError}
          </motion.div>
        )}

        {/* Formulário */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      name="email"
                      placeholder="admin@restaurante.com"
                      autoComplete="email"
                      spellCheck={false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Senha</FormLabel>
                    <Link
                      to="/restaurant/forgot-password"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword
                          ? <EyeOff className="h-4 w-4" aria-hidden="true" />
                          : <Eye className="h-4 w-4" aria-hidden="true" />
                        }
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full min-h-[44px]"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Entrando…
                </>
              ) : (
                'Entrar no painel'
              )}
            </Button>
          </form>
        </Form>

        {/* Links de navegação */}
        <div className="mt-5 space-y-2 text-center text-sm text-muted-foreground">
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
      </motion.div>
    </div>
  );
};

export default RestaurantLogin;
