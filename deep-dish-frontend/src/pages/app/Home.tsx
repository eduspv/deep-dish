import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, Plus, Clock } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { reservationsService } from '@/services/reservations.service';
import { Reserva } from '@/types';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

const AppHome: React.FC = () => {
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    reservationsService.listUserReservations()
      .then(data => { if (!cancelled) setReservations(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const upcoming = reservations.filter(r => r.status === 'confirmada' || r.status === 'em_andamento');
  const finalizadas = reservations.filter(r => r.status === 'liberada' || r.status === 'expirada' || r.status === 'cancelada');

  const restaurantName = (r: Reserva) => r.mesa?.restaurante?.nome ?? 'Restaurante';
  const restaurantInitial = (r: Reserva) => restaurantName(r).charAt(0).toUpperCase();

  const ReservaCard = ({ r, faded }: { r: Reserva; faded?: boolean }) => (
    <Link key={r.id} to={`/app/reservations/${r.id}`} className="block group">
      <div className={`flex items-center gap-4 rounded-2xl bg-card p-4 shadow-card transition-all duration-200 ease-out-expo group-hover:shadow-card-hover group-hover:-translate-y-0.5 ${faded ? 'opacity-60' : ''}`}>
        <div className="h-14 w-14 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-primary font-display">{restaurantInitial(r)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{restaurantName(r)}</p>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            {formatDate(r.horario_reserva)}
            <Clock className="h-3.5 w-3.5 ml-1 shrink-0" />
            {formatTime(r.horario_reserva)}
            {r.mesa && <span className="hidden sm:inline">· {r.mesa.capacidade}p</span>}
          </div>
        </div>
        <StatusBadge status={r.status} />
      </div>
    </Link>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Suas reservas</h1>
        <Link to="/app/search">
          <Button size="sm" className="min-h-[36px]">
            <Plus className="mr-1.5 h-4 w-4" /> Nova reserva
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-[72px] rounded-2xl" />)}
        </div>
      ) : upcoming.length === 0 && finalizadas.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="h-7 w-7" />}
          title="Nenhuma reserva"
          description="Busque um restaurante e faça sua primeira reserva."
          action={<Link to="/app/search"><Button>Buscar restaurantes</Button></Link>}
        />
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Próximas
              </h2>
              <div className="space-y-2.5 animate-stagger">
                {upcoming.map(r => <ReservaCard key={r.id} r={r} />)}
              </div>
            </section>
          )}
          {finalizadas.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Finalizadas
              </h2>
              <div className="space-y-2.5">
                {finalizadas.map(r => <ReservaCard key={r.id} r={r} faded />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default AppHome;
