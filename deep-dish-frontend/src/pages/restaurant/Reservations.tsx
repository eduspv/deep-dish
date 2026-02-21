import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { mockAdminReservations } from '@/mocks/reservations';
import { Reservation } from '@/types';
import { CalendarDays, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { setReservations(mockAdminReservations); setLoading(false); }, 400);
    return () => clearTimeout(timer);
  }, []);

  const updateStatus = (id: string, status: Reservation['status'], msg: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast.success(msg);
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" />{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Reservas de hoje</h1>
      <div className="space-y-3">
        {reservations.map(r => (
          <div key={r.id} className="rounded-xl bg-card p-4 shadow-card flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Reserva #{r.id.slice(-4)}</span>
                <StatusBadge status={r.status} />
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{r.time}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{r.partySize}p</span>
                {r.tableNumber && <span>Mesa {r.tableNumber}</span>}
                {r.notes && <span className="italic">"{r.notes}"</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {r.status === 'pending' && (
                <>
                  <Button size="sm" onClick={() => updateStatus(r.id, 'confirmed', 'Reserva confirmada!')}>Confirmar</Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, 'cancelled', 'Reserva cancelada.')}>Cancelar</Button>
                </>
              )}
              {r.status === 'confirmed' && (
                <>
                  <Button size="sm" onClick={() => updateStatus(r.id, 'seated', 'Cliente sentado!')}>Mesa pronta</Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, 'cancelled', 'Reserva cancelada.')}>Cancelar</Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reservations;
