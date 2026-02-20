import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Clock, Users, CalendarCheck, ChevronRight, Utensils, Store, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '@/assets/hero-bg.jpg';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const Landing: React.FC = () => {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-dark-surface/70" />
        <div className="relative z-10 container mx-auto px-4 pt-20 pb-16 text-center">
          <motion.h1
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-dark-surface-foreground leading-tight"
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}
          >
            Sua mesa está <span className="text-gradient-brand bg-clip-text">esperando</span>
          </motion.h1>
          <motion.p
            className="mt-4 max-w-xl mx-auto text-lg md:text-xl text-dark-surface-foreground/80"
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.15 }}
          >
            Fila digital e reservas em tempo real nos melhores restaurantes. Sem esperar na porta, sem surpresas.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/register"><Button size="lg" className="text-base px-8">Criar conta</Button></Link>
            <Link to="/login"><Button size="lg" variant="outline" className="text-base px-8 border-dark-surface-foreground/30 text-dark-surface-foreground hover:bg-dark-surface-foreground/10">Entrar</Button></Link>
          </motion.div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 gradient-warm">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-display text-3xl md:text-4xl font-bold text-foreground">Como funciona</h2>
          <p className="text-center mt-2 text-muted-foreground">Três passos para nunca mais esperar na fila</p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: <Smartphone className="h-8 w-8" />, title: 'Busque', desc: 'Encontre restaurantes próximos e veja filas e horários em tempo real.' },
              { icon: <CalendarCheck className="h-8 w-8" />, title: 'Reserve ou entre na fila', desc: 'Escolha o melhor horário ou entre na fila digital com um toque.' },
              { icon: <Utensils className="h-8 w-8" />, title: 'Aproveite', desc: 'Acompanhe sua posição, receba alertas e vá direto para a mesa.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center text-center rounded-xl bg-card p-8 shadow-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {step.icon}
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-display text-3xl md:text-4xl font-bold text-foreground">Por que Deep Dish?</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Clock className="h-6 w-6" />, title: 'Tempo real', desc: 'Acompanhe posição na fila ao vivo.' },
              { icon: <Users className="h-6 w-6" />, title: 'Sem aglomeração', desc: 'Espere de onde quiser, chegue na hora certa.' },
              { icon: <CalendarCheck className="h-6 w-6" />, title: 'Reservas fáceis', desc: 'Escolha mesa, horário e número de pessoas.' },
              { icon: <Store className="h-6 w-6" />, title: 'Para restaurantes', desc: 'Gerencie filas, mesas e equipe em um painel.' },
            ].map((b, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">{b.icon}</div>
                <h3 className="mt-3 font-semibold text-foreground">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para restaurantes */}
      <section className="py-20 gradient-dark text-dark-surface-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Para restaurantes</h2>
          <p className="mt-3 max-w-2xl mx-auto text-dark-surface-foreground/70">
            Digitalize a gestão de filas e reservas. Reduza no-shows, otimize a ocupação e encante seus clientes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/restaurant/register">
              <Button size="lg" className="text-base px-8">Cadastrar meu restaurante</Button>
            </Link>
            <Link to="/restaurant/login">
              <Button size="lg" variant="outline" className="text-base px-8 border-dark-surface-foreground/30 text-dark-surface-foreground hover:bg-dark-surface-foreground/10">
                Já tenho conta <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-center font-display text-3xl md:text-4xl font-bold text-foreground">Perguntas frequentes</h2>
          <div className="mt-10 space-y-4">
            {[
              { q: 'O Deep Dish é gratuito para clientes?', a: 'Sim! Buscar restaurantes, entrar na fila e reservar são 100% gratuitos para clientes.' },
              { q: 'Preciso baixar um app?', a: 'Não. O Deep Dish funciona direto no navegador, sem instalar nada.' },
              { q: 'Como o restaurante recebe meu pedido?', a: 'O restaurante vê sua reserva ou entrada na fila em tempo real no painel de gestão.' },
              { q: 'Posso cancelar uma reserva?', a: 'Sim, a qualquer momento antes do horário, respeitando a política de cada restaurante.' },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-border bg-card p-4 shadow-card">
                <summary className="cursor-pointer font-medium text-foreground flex items-center justify-between">
                  {faq.q}
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary"><span className="text-xs font-bold text-primary-foreground">D</span></div>
            <span className="font-display font-semibold text-foreground">Deep Dish</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Deep Dish. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
