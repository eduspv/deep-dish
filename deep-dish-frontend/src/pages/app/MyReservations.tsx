import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '@/components/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Reserva } from '@/types';
import { reservationsService } from '@/services/reservations.service';
import { ApiError } from '@/services/httpClient';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

const MyReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await reservationsService.listUserReservations();
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

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Minhas reservas</h1>

      {reservations.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          <p>Você ainda não tem reservas.</p>
          <Link to="/app/restaurants" className="text-primary hover:underline mt-2 inline-block">
            Buscar restaurantes
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map(r => {
            const id = String(r.id);
            const restaurante = r.mesa?.restaurante;

            return (
              <Link
                key={id}
                to={`/app/reservations/${id}`}
                className="block rounded-xl bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-start gap-3">
                  {restaurante?.imagem_url ? (
                    <img
                      src={restaurante.imagem_url}
                      alt=""
                      className="h-16 w-16 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <span className="text-2xl font-bold text-muted-foreground/30">
                        {restaurante?.name?.charAt(0) ?? '?'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground truncate">
                        {restaurante?.name ?? 'Restaurante'}
                      </h3>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(r.horario_reserva)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(r.horario_reserva)}
                      </span>
                      {restaurante?.cidade && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {restaurante.cidade}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReservations;
