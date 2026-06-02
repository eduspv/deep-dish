import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2, CheckCircle, LayoutDashboard, CalendarCheck, Users } from 'lucide-react';
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

const features = [
  { icon: LayoutDashboard, label: 'Dashboard em tempo real' },
  { icon: CalendarCheck, label: 'Gestão de reservas' },
  { icon: Users, label: 'Controle de fila e mesas' },
];

// Planta baixa abstrata de mesas — identidade visual exclusiva do portal
const FloorPlanSVG = () => (
  <svg width="220" height="172" viewBox="0 0 220 172" fill="none" aria-hidden="true">
    {/* Linha de grade sutil */}
    <line x1="76" y1="0" x2="76" y2="172" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    <line x1="142" y1="0" x2="142" y2="172" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    <line x1="0" y1="56" x2="220" y2="56" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    <line x1="0" y1="112" x2="220" y2="112" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

    {/* Mesa 1 — ocupada */}
    <rect x="8" y="8" width="52" height="36" rx="6" fill="rgba(218,27,27,0.18)" stroke="rgba(218,27,27,0.55)" strokeWidth="1.5" />
    <circle cx="34" cy="3" r="3.5" fill="rgba(218,27,27,0.45)" />
    <circle cx="34" cy="49" r="3.5" fill="rgba(218,27,27,0.45)" />
    <circle cx="3" cy="26" r="3.5" fill="rgba(218,27,27,0.45)" />
    <circle cx="65" cy="26" r="3.5" fill="rgba(218,27,27,0.45)" />
    <circle cx="34" cy="26" r="5" fill="rgba(218,27,27,0.35)" />

    {/* Mesa 2 — livre */}
    <rect x="84" y="8" width="52" height="36" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.13)" strokeWidth="1" />
    <circle cx="110" cy="3" r="3.5" fill="rgba(255,255,255,0.1)" />
    <circle cx="110" cy="49" r="3.5" fill="rgba(255,255,255,0.1)" />
    <circle cx="79" cy="26" r="3.5" fill="rgba(255,255,255,0.1)" />
    <circle cx="141" cy="26" r="3.5" fill="rgba(255,255,255,0.1)" />

    {/* Mesa 3 — ocupada */}
    <rect x="160" y="8" width="52" height="36" rx="6" fill="rgba(218,27,27,0.12)" stroke="rgba(218,27,27,0.35)" strokeWidth="1" />
    <circle cx="186" cy="3" r="3.5" fill="rgba(218,27,27,0.3)" />
    <circle cx="186" cy="49" r="3.5" fill="rgba(218,27,27,0.3)" />
    <circle cx="186" cy="26" r="4" fill="rgba(218,27,27,0.2)" />

    {/* Mesa 4 — livre */}
    <rect x="8" y="64" width="52" height="36" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.13)" strokeWidth="1" />
    <circle cx="34" cy="59" r="3.5" fill="rgba(255,255,255,0.1)" />
    <circle cx="34" cy="105" r="3.5" fill="rgba(255,255,255,0.1)" />
    <circle cx="3" cy="82" r="3.5" fill="rgba(255,255,255,0.1)" />

    {/* Mesa 5 — ocupada, destaque */}
    <rect x="84" y="64" width="52" height="36" rx="6" fill="rgba(218,27,27,0.22)" stroke="rgba(218,27,27,0.65)" strokeWidth="1.5" />
    <circle cx="110" cy="59" r="3.5" fill="rgba(218,27,27,0.55)" />
    <circle cx="110" cy="105" r="3.5" fill="rgba(218,27,27,0.55)" />
    <circle cx="79" cy="82" r="3.5" fill="rgba(218,27,27,0.55)" />
    <circle cx="141" cy="82" r="3.5" fill="rgba(218,27,27,0.55)" />
    <circle cx="110" cy="82" r="5.5" fill="rgba(218,27,27,0.4)" />

    {/* Mesa 6 — livre */}
    <rect x="160" y="64" width="52" height="36" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.13)" strokeWidth="1" />
    <circle cx="186" cy="59" r="3.5" fill="rgba(255,255,255,0.1)" />
    <circle cx="186" cy="105" r="3.5" fill="rgba(255,255,255,0.1)" />
    <circle cx="155" cy="82" r="3.5" fill="rgba(255,255,255,0.1)" />
    <circle cx="217" cy="82" r="3.5" fill="rgba(255,255,255,0.1)" />

    {/* Linha 3 — parcialmente cortada (profundidade) */}
    <rect x="8" y="120" width="52" height="36" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    <rect x="84" y="120" width="52" height="36" rx="6" fill="rgba(218,27,27,0.1)" stroke="rgba(218,27,27,0.25)" strokeWidth="1" />
    <rect x="160" y="120" width="52" height="36" rx="6" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
  </svg>
);

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
    <div className="flex min-h-screen">
      {/* Painel esquerdo — identidade operacional */}
      <motion.div
        className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between bg-dark-surface p-12 relative overflow-hidden"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Textura de fundo */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />

        {/* Brilhos decorativos */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
        <div className="absolute top-1/3 -right-16 w-64 h-64 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />

        {/* Linha de acento no topo */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, hsl(0 78% 48% / 0.6), transparent)' }}
          aria-hidden="true"
        />

        {/* Planta baixa de mesas — elemento gráfico exclusivo */}
        <motion.div
          className="absolute bottom-12 right-0 opacity-0"
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
          aria-hidden="true"
        >
          <FloorPlanSVG />
        </motion.div>

        {/* Logo */}
        <div className="relative z-10">
          <span className="font-display text-4xl font-bold text-dark-surface-foreground">Deep Dish</span>
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-5xl font-display font-bold leading-tight text-dark-surface-foreground text-balance">
              Controle total do<br />
              <span className="text-primary">seu negócio.</span>
            </p>
            <p className="mt-4 text-base text-dark-surface-foreground/60 leading-relaxed max-w-xs">
              Visibilidade completa sobre filas, reservas e mesas — tudo em um só lugar.
            </p>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-dark-surface-foreground/70">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/15">
                  <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                </div>
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Rodapé */}
        <div className="relative z-10">
          <p className="text-xs text-dark-surface-foreground/30">© 2025 Deep Dish · UniCEUB PI3</p>
        </div>
      </motion.div>

      {/* Painel direito — formulário */}
      <div className="flex flex-1 flex-col bg-background">

        {/* Área do formulário centralizada */}
        <div className="flex flex-1 items-center justify-center px-8 py-8">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Logo mobile */}
            <div className="mb-6 lg:hidden">
              <span className="font-display text-3xl font-bold text-foreground">Deep Dish</span>
            </div>

            {/* Header com eyebrow dourado */}
            <div className="mb-6">
              <p className="mb-2 text-[18px] font-bold tracking-[0.1em] uppercase text-primary">
                Restaurante
              </p>
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
      </div>
    </div>
  );
};

export default RestaurantLogin;
