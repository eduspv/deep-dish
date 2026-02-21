import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, Plus, Clock } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { mockReservations } from '@/mocks/reservations';
import { Reservation } from '@/types';

const AppHome: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { setReservations(mockReservations); setLoading(false); }, 600);
    return () => clearTimeout(timer);
  }, []);

  const upcoming = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending');
  const past = reservations.filter(r => r.status === 'completed' || r.status === 'cancelled');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Suas reservas</h1>
        <Link to="/app/search"><Button size="sm"><Plus className="mr-1 h-4 w-4" /> Nova reserva</Button></Link>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      ) : upcoming.length === 0 && past.length === 0 ? (
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
                {upcoming.map(r => (
                  <Link key={r.id} to={`/app/reservations/${r.id}`} className="block">
                    <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow">
                      <img src={r.restaurantImage} alt="" className="h-16 w-16 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{r.restaurantName}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />{r.date}
                          <Clock className="h-3.5 w-3.5 ml-1" />{r.time}
                          <span>· {r.partySize}p</span>
                        </div>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">Anteriores</h2>
              <div className="space-y-3">
                {past.map(r => (
                  <Link key={r.id} to={`/app/reservations/${r.id}`} className="block">
                    <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-card opacity-70">
                      <img src={r.restaurantImage} alt="" className="h-16 w-16 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{r.restaurantName}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />{r.date} <Clock className="h-3.5 w-3.5 ml-1" />{r.time}
                        </div>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AppHome;
