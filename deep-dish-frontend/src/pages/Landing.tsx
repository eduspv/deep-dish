import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Users, CalendarCheck, ChevronRight, Utensils, Store, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '@/assets/hero-bg.jpg';
import logo from '@/assets/logo/logo-sem-fundo.png';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const Landing: React.FC = () => {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-surface/60 via-dark-surface/70 to-dark-surface/90" />

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-20 text-center">
          <motion.h1
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-dark-surface-foreground leading-[1.1] tracking-tight"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Sua mesa está{' '}
            <span className="text-brand-accent text-primary">esperando</span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-lg mx-auto text-base sm:text-lg md:text-xl text-dark-surface-foreground/75 leading-relaxed"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            Fila digital e reservas em tempo real nos melhores restaurantes.
            Sem esperar na porta, sem surpresas.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/register">
              <Button size="lg" className="text-base px-8 min-h-[48px] shadow-lg shadow-primary/20">
                Criar conta
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 min-h-[48px] border-white/20 text-black hover:bg-white/10 hover:border-white/30"
              >
                Entrar
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
            <motion.div
              className="w-1 h-1.5 rounded-full bg-white/60"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </section>

      {/* About */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-20 w-20 rounded-2xl bg-card p-2.5 shadow-card flex items-center justify-center">
                <img src={logo} alt="Logo Deep Dish" className="max-h-full max-w-full object-contain" />
              </div>
            </motion.div>
            <motion.h2
              className="font-display text-3xl md:text-4xl font-bold text-foreground"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Sobre o projeto
            </motion.h2>
            <motion.p
              className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              O <span className="font-semibold text-foreground">Deep Dish</span> é um
              projeto integrador desenvolvido no{' '}
              <span className="font-semibold text-foreground">UniCEUB</span>, como parte
              das atividades da disciplina{' '}
              <span className="font-semibold text-foreground">PI3</span>.
            </motion.p>
            <motion.p
              className="mt-4 text-base leading-7 text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              A proposta do projeto é unir tecnologia, experiência do usuário e solução
              de problemas reais do setor de restaurantes, oferecendo uma plataforma para
              gerenciamento de filas digitais e reservas em tempo real de forma prática,
              moderna e acessível.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-24 gradient-warm">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-center font-display text-3xl md:text-4xl font-bold text-foreground"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Como funciona
          </motion.h2>
          <motion.p
            className="text-center mt-3 text-muted-foreground"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            Três passos para nunca mais esperar na fila
          </motion.p>

          <motion.div
            className="mt-14 grid gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Smartphone className="h-7 w-7" />,
                title: 'Busque',
                desc: 'Encontre restaurantes próximos e veja filas e horários em tempo real.',
                step: '01',
              },
              {
                icon: <CalendarCheck className="h-7 w-7" />,
                title: 'Reserve ou entre na fila',
                desc: 'Escolha o melhor horário ou entre na fila digital com um toque.',
                step: '02',
              },
              {
                icon: <Utensils className="h-7 w-7" />,
                title: 'Aproveite',
                desc: 'Acompanhe sua posição, receba alertas e vá direto para a mesa.',
                step: '03',
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="relative flex flex-col items-center text-center rounded-2xl bg-card p-8 pt-10 shadow-card"
                variants={fadeUp}
                transition={{ duration: 0.5 }}
              >
                <span className="absolute -top-4 left-6 font-display text-5xl font-extrabold text-primary/10">
                  {step.step}
                </span>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {step.icon}
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-center font-display text-3xl md:text-4xl font-bold text-foreground"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Por que Deep Dish?
          </motion.h2>

          <motion.div
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: <Clock className="h-5 w-5" />, title: 'Tempo real', desc: 'Acompanhe posição na fila ao vivo.' },
              { icon: <Users className="h-5 w-5" />, title: 'Sem aglomeração', desc: 'Espere de onde quiser, chegue na hora certa.' },
              { icon: <CalendarCheck className="h-5 w-5" />, title: 'Reservas fáceis', desc: 'Escolha mesa, horário e número de pessoas.' },
              { icon: <Store className="h-5 w-5" />, title: 'Para restaurantes', desc: 'Gerencie filas, mesas e equipe em um painel.' },
            ].map((b, i) => (
              <motion.div
                key={i}
                className="group rounded-2xl border border-border/60 bg-card p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
                variants={fadeUp}
                transition={{ duration: 0.4 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-110">
                  {b.icon}
                </div>
                <h3 className="mt-4 font-display font-semibold text-foreground">{b.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Para restaurantes */}
      <section className="py-24 gradient-dark text-dark-surface-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="font-display text-3xl md:text-4xl font-bold"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Para restaurantes
          </motion.h2>
          <motion.p
            className="mt-4 max-w-2xl mx-auto text-dark-surface-foreground/65 leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            Digitalize a gestão de filas e reservas. Reduza no-shows, otimize a ocupação e encante seus clientes.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Link to="/restaurant/register">
              <Button size="lg" className="text-base px-8 min-h-[48px] shadow-lg shadow-primary/20">
                Cadastrar meu restaurante
              </Button>
            </Link>
            <Link to="/restaurant/login">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 min-h-[48px] border-white/20 text-black hover:bg-white/10 hover:border-white/30"
              >
                Já tenho conta
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.h2
            className="text-center font-display text-3xl md:text-4xl font-bold text-foreground"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Perguntas frequentes
          </motion.h2>

          <div className="mt-12 space-y-3">
            {[
              { q: 'O Deep Dish é gratuito para clientes?', a: 'Sim! Buscar restaurantes, entrar na fila e reservar são 100% gratuitos para clientes.' },
              { q: 'Preciso baixar um app?', a: 'Não. O Deep Dish funciona direto no navegador, sem instalar nada.' },
              { q: 'Como o restaurante recebe meu pedido?', a: 'O restaurante vê sua reserva ou entrada na fila em tempo real no painel de gestão.' },
              { q: 'Posso cancelar uma reserva?', a: 'Sim, a qualquer momento antes do horário, respeitando a política de cada restaurante.' },
            ].map((faq, i) => (
              <motion.details
                key={i}
                className="group rounded-xl border border-border/60 bg-card p-5 shadow-card transition-all duration-200 open:shadow-card-hover"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <summary className="cursor-pointer font-medium text-foreground flex items-center justify-between gap-4 select-none">
                  {faq.q}
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out-expo group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-background p-1.5 flex items-center justify-center">
              <img src={logo} alt="Logo Deep Dish" className="max-h-full max-w-full object-contain" />
            </div>
            <span className="font-display font-semibold text-foreground">Deep Dish</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Deep Dish. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
