import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import ConfirmModal from '@/components/ConfirmModal';
import { Skeleton } from '@/components/ui/skeleton';
import { mockReservations } from '@/mocks/reservations';
import { Reservation } from '@/types';
import { CalendarDays, Clock, Users, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const ReservationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReservation(mockReservations.find(r => r.id === id) || null);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    await new Promise(r => setTimeout(r, 600));
    toast.success('Reserva cancelada.');
    setCancelling(false);
    setCancelOpen(false);
    setReservation(prev => prev ? { ...prev, status: 'cancelled' } : null);
  };

  if (loading) return <div className="max-w-lg mx-auto space-y-4"><Skeleton className="h-48 rounded-xl" /><Skeleton className="h-32 rounded-xl" /></div>;
  if (!reservation) return <p className="text-center text-muted-foreground py-20">Reserva não encontrada.</p>;

  const canCancel = reservation.status === 'pending' || reservation.status === 'confirmed';

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Detalhes da reserva</h1>
      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        {reservation.restaurantImage && <img src={reservation.restaurantImage} alt="" className="h-40 w-full object-cover" />}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">{reservation.restaurantName}</h2>
            <StatusBadge status={reservation.status} />
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{reservation.date}</p>
            <p className="flex items-center gap-2"><Clock className="h-4 w-4" />{reservation.time}</p>
            <p className="flex items-center gap-2"><Users className="h-4 w-4" />{reservation.partySize} pessoas</p>
            {reservation.tableNumber && <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />Mesa {reservation.tableNumber}</p>}
            {reservation.notes && <p className="italic text-muted-foreground">"{reservation.notes}"</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate('/app')}>Voltar</Button>
            {canCancel && <Button variant="destructive" className="flex-1" onClick={() => setCancelOpen(true)}>Cancelar</Button>}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Cancelar reserva?"
        description="Esta ação não pode ser desfeita."
        confirmLabel="Cancelar reserva"
        isLoading={cancelling}
      />
    </div>
  );
};

export default ReservationDetail;
