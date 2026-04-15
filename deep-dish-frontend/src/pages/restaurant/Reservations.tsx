import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Reserva } from '@/types';
import { reservationsService } from '@/services/reservations.service';
import { ApiError } from '@/services/httpClient';
import { Clock, Users, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { formatBRT } from '@/lib/utils';

const formatDate = (iso: string) => formatBRT(iso, { day: '2-digit', month: '2-digit' });
const formatTime = (iso: string) => formatBRT(iso, { hour: '2-digit', minute: '2-digit' });

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkinId, setCheckinId] = useState<string | null>(null);
  const [liberandoId, setLiberandoId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await reservationsService.listRestaurantReservations();
        if (!cancelled) setReservations(data);
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof ApiError ? err.message : 'Erro ao carregar reservas';
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleCheckin = async (id: string) => {
    setCheckinId(id);
    try {
      const updated = await reservationsService.checkin(id);
      setReservations(prev => prev.map(r => (String(r.id) === id ? updated : r)));
      toast.success('Check-in realizado!');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao fazer check-in';
      toast.error(msg);
    } finally {
      setCheckinId(null);
    }
  };

  const handleLiberar = async (id: string) => {
    setLiberandoId(id);
    try {
      const updated = await reservationsService.liberarMesa(id);
      setReservations(prev => prev.map(r => (String(r.id) === id ? updated : r)));
      toast.success('Mesa liberada.');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao liberar mesa';
      toast.error(msg);
    } finally {
      setLiberandoId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-foreground">Reservas</h1>

      {reservations.length === 0 ? (
        <p className="text-center text-muted-foreground py-14">
          Nenhuma reserva encontrada.
        </p>
      ) : (
        <div className="space-y-2.5 animate-stagger">
          {reservations.map(r => {
            const id = String(r.id);
            const isCheckin = checkinId === id;
            const isLiberando = liberandoId === id;
            const podeCheckin = r.status === 'confirmada';
            const podeLiberar = r.status === 'em_andamento';

            return (
              <div
                key={id}
                className="rounded-2xl bg-card p-4 shadow-card flex flex-col sm:flex-row sm:items-center gap-3 transition-all duration-200 hover:shadow-card-hover"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">
                      {r.cliente?.name ?? `Reserva #${id.slice(-4)}`}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                      {formatDate(r.horario_reserva)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      {formatTime(r.horario_reserva)}
                    </span>
                    {r.mesa && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        Mesa {r.mesa.numero} · {r.party_size ?? r.mesa.capacidade}/{r.mesa.capacidade} pessoas
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {podeCheckin && (
                    <Button size="sm" className="min-h-[36px]" onClick={() => handleCheckin(id)} disabled={isCheckin}>
                      {isCheckin ? 'Registrando...' : 'Check-in'}
                    </Button>
                  )}
                  {podeLiberar && (
                    <Button size="sm" variant="outline" className="min-h-[36px]" onClick={() => handleLiberar(id)} disabled={isLiberando}>
                      {isLiberando ? 'Liberando...' : 'Liberar mesa'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reservations;
