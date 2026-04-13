import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, Plus, Clock } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { reservationsService } from '@/services/reservations.service';
import { ApiError } from '@/services/httpClient';
import { Reserva } from '@/types';
import { toast } from 'sonner';
import { formatBRT } from '@/lib/utils';

const formatDate = (iso: string) => formatBRT(iso, { day: '2-digit', month: '2-digit', year: 'numeric' });
const formatTime = (iso: string) => formatBRT(iso, { hour: '2-digit', minute: '2-digit' });

const AppHome: React.FC = () => {
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = React.useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await reservationsService.listUserReservations();
      setReservations(data);
    } catch (err) {
      if (!silent) {
        const msg = err instanceof ApiError ? err.message : 'Erro ao carregar reservas';
        toast.error(msg);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Refetch silencioso ao voltar para a aba
  useEffect(() => {
    const onFocus = () => fetchReservations(true);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchReservations]);

  const upcoming = reservations.filter(r => r.status === 'confirmada' || r.status === 'em_andamento');
  const finalizadas = reservations.filter(r => r.status === 'liberada' || r.status === 'expirada' || r.status === 'cancelada');

  const restaurantName = (r: Reserva) => r.mesa?.restaurante?.name ?? 'Restaurante';
  const restaurantInitial = (r: Reserva) => restaurantName(r).charAt(0).toUpperCase();

  const ReservaCard = ({ r, faded }: { r: Reserva; faded?: boolean }) => {
    const imagem = r.mesa?.restaurante?.imagem_url;
    return (
    <Link key={r.id} to={`/app/reservations/${r.id}`} className="block">
      <div className={`flex items-center gap-4 rounded-xl bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow ${faded ? 'opacity-70' : ''}`}>
        <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
          {imagem
            ? <img src={imagem} alt="" className="h-full w-full object-cover" />
            : <span className="text-xl font-bold text-primary">{restaurantInitial(r)}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{restaurantName(r)}</p>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />{formatDate(r.horario_reserva)}
            <Clock className="h-3.5 w-3.5 ml-1" />{formatTime(r.horario_reserva)}
            {r.mesa && (
              <span>· {r.party_size ?? r.mesa.capacidade}/{r.mesa.capacidade} pessoas</span>
            )}
          </div>
        </div>
        <StatusBadge status={r.status} />
      </div>
    </Link>
  );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Suas reservas</h1>
        <Link to="/app/search"><Button size="sm"><Plus className="mr-1 h-4 w-4" /> Nova reserva</Button></Link>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
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
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">Próximas</h2>
              <div className="space-y-3">
                {upcoming.map(r => <ReservaCard key={r.id} r={r} />)}
              </div>
            </div>
          )}
          {finalizadas.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">Finalizadas</h2>
              <div className="space-y-3">
                {finalizadas.map(r => <ReservaCard key={r.id} r={r} faded />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AppHome;
