import { useRef, useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TIPOS_RESTAURANTE } from '@/constants/tipos';

const onlyDigits = (value: string) => value.replace(/\D/g, '');

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
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

const schema = z
  .object({
    email: z.string().email('Informe um e-mail válido'),
    cnpj: z.string().refine((v) => onlyDigits(v).length === 14, 'CNPJ inválido'),
    name: z.string().min(2, 'Informe o nome do restaurante'),
    tipo: z.string().min(1, 'Selecione o tipo do restaurante'),
    cep: z.string().refine((v) => onlyDigits(v).length === 8, 'CEP inválido'),
    logradouro: z.string().min(1, 'Preencha o logradouro'),
    numero: z.string().min(1, 'Preencha o número'),
    complemento: z.string().optional(),
    bairro: z.string().min(1, 'Preencha o bairro'),
    cidade: z.string().min(1, 'Preencha a cidade'),
    estado: z.string().length(2, 'Selecione o estado'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

const RestaurantRegister: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [cnpjWarning, setCnpjWarning] = useState('');
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const { registerRestaurant } = useAuth();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '', cnpj: '', name: '', tipo: '',
      cep: '', logradouro: '', numero: '', complemento: '',
      bairro: '', cidade: '', estado: '',
      password: '', confirmPassword: '',
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (serverError && errorRef.current) errorRef.current.focus();
  }, [serverError]);

  const handleCnpjBlur = useCallback(async () => {
    const raw = onlyDigits(form.getValues('cnpj'));
    if (raw.length !== 14) return;
    setCnpjLoading(true);
    setServerError('');
    setCnpjWarning('');
    try {
      const res = await fetch(`https://publica.cnpj.ws/cnpj/${raw}`);
      if (res.status === 404) { setServerError('CNPJ não encontrado na Receita Federal.'); return; }
      if (!res.ok) throw new Error();
      const data = await res.json();
      const est = data.estabelecimento;

      if (est?.situacao_cadastral && est.situacao_cadastral !== 'Ativa') {
        setCnpjWarning(`Atenção: este CNPJ consta como "${est.situacao_cadastral}" na Receita Federal.`);
      }

      const nomeSugerido = est?.nome_fantasia?.trim() || data.razao_social?.trim() || '';
      if (nomeSugerido) form.setValue('name', nomeSugerido, { shouldValidate: true });

      if (est) {
        const tipoLog = est.tipo_logradouro ? `${est.tipo_logradouro} ` : '';
        form.setValue('logradouro', `${tipoLog}${est.logradouro ?? ''}`.trim(), { shouldValidate: true });
        form.setValue('numero', est.numero ?? '', { shouldValidate: true });
        form.setValue('complemento', est.complemento ?? '');
        form.setValue('bairro', est.bairro ?? '', { shouldValidate: true });
        form.setValue('cidade', est.cidade?.nome ?? '', { shouldValidate: true });
        form.setValue('estado', est.estado?.sigla ?? '', { shouldValidate: true });
        form.setValue('cep', formatCep(onlyDigits(est.cep ?? '').slice(0, 8)), { shouldValidate: true });
      }
    } catch {
      setServerError('Erro ao consultar CNPJ. Preencha os dados manualmente.');
    } finally {
      setCnpjLoading(false);
    }
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    setServerError('');
    try {
      await registerRestaurant({
        name: values.name,
        email: values.email,
        password: values.password,
        cnpj: onlyDigits(values.cnpj),
        tipo: values.tipo,
        logradouro: values.logradouro.trim(),
        numero: values.numero.trim(),
        complemento: values.complemento?.trim() || undefined,
        bairro: values.bairro.trim(),
        cidade: values.cidade.trim(),
        estado: values.estado,
        cep: values.cep,
      });
      navigate('/verify-email?tipo=restaurante');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erro ao cadastrar restaurante. Tente novamente.');
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

        {/* Logo */}
        <div className="relative z-10">
          <span className="font-display text-4xl font-bold text-dark-surface-foreground">Deep Dish</span>
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-5xl font-display font-bold leading-tight text-dark-surface-foreground text-balance">
              Seu restaurante<br />
              <span className="text-primary">no controle.</span>
            </p>
            <p className="mt-4 text-base text-dark-surface-foreground/60 leading-relaxed max-w-xs">
              Cadastre seu estabelecimento e comece a gerenciar filas e reservas hoje mesmo.
            </p>
          </motion.div>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {['Dashboard em tempo real', 'Gestão de reservas e filas', 'Controle total de mesas'].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-dark-surface-foreground/70">
                <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                {item}
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
      <div className="flex flex-1 items-start justify-center bg-background px-8 py-10 overflow-y-auto">
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

          {/* Header */}
          <div className="mb-6">
            <p className="mb-2 text-[11px] font-bold tracking-[0.2em] uppercase text-primary">
              Restaurante
            </p>
            <h1 className="font-display text-4xl font-bold text-foreground text-balance leading-tight">
              Cadastrar restaurante
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Preencha os dados do seu estabelecimento
            </p>
          </div>

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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>

              {/* E-mail */}
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

              {/* CNPJ */}
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          name="cnpj"
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder="00.000.000/0000-00"
                          disabled={cnpjLoading}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(formatCnpj(e.target.value));
                            setCnpjWarning('');
                          }}
                          onBlur={() => { field.onBlur(); handleCnpjBlur(); }}
                        />
                        {cnpjLoading && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
                        )}
                      </div>
                    </FormControl>
                    {cnpjWarning && (
                      <p className="text-xs text-amber-600 dark:text-amber-400">{cnpjWarning}</p>
                    )}
                    {!cnpjWarning && onlyDigits(field.value).length === 14 && !cnpjLoading && !serverError && (
                      <p className="text-xs text-muted-foreground">Dados preenchidos automaticamente — verifique e corrija se necessário.</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nome do restaurante */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do restaurante</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Meu Restaurante"
                        autoComplete="organization"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo */}
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo do restaurante</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger id="tipo-restaurante">
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIPOS_RESTAURANTE.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CEP */}
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        name="cep"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        placeholder="12345-678"
                        maxLength={9}
                        value={field.value}
                        onChange={(e) => field.onChange(formatCep(e.target.value))}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Logradouro */}
              <FormField
                control={form.control}
                name="logradouro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logradouro</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        name="logradouro"
                        placeholder="Rua, avenida..."
                        autoComplete="street-address"
                        maxLength={255}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Número + Complemento */}
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          name="numero"
                          placeholder="123"
                          autoComplete="off"
                          maxLength={20}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="complemento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          name="complemento"
                          placeholder="Sala, bloco..."
                          autoComplete="off"
                          maxLength={100}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bairro */}
              <FormField
                control={form.control}
                name="bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        name="bairro"
                        placeholder="Bairro"
                        autoComplete="off"
                        maxLength={100}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cidade + Estado */}
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          name="cidade"
                          placeholder="Cidade"
                          autoComplete="address-level2"
                          maxLength={100}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger id="estado">
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {UFS.map((uf) => (
                            <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Senha */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirmar senha */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                          aria-label={showConfirm ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
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
                disabled={isSubmitting || cnpjLoading}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Cadastrando…
                  </>
                ) : (
                  'Cadastrar restaurante'
                )}
              </Button>
            </form>
          </Form>

          {/* Links de navegação */}
          <div className="mt-5 space-y-2 text-center text-sm text-muted-foreground">
            <p>
              Já tem conta?{' '}
              <Link to="/restaurant/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Entrar
              </Link>
            </p>
            <p>
              É cliente?{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Cadastrar como cliente
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RestaurantRegister;
