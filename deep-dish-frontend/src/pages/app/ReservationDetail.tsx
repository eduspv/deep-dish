import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import ConfirmModal from '@/components/ConfirmModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Reserva } from '@/types';
import { reservationsService } from '@/services/reservations.service';
import { ApiError } from '@/services/httpClient';
import { CalendarDays, Clock, Users, MapPin, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

const ReservationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await reservationsService.getReservationById(id);
        if (!cancelled) setReservation(data);
      } catch {
        if (!cancelled) setReservation(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleCancel = async () => {
    if (!id) return;
    setCancelling(true);
    try {
      const updated = await reservationsService.cancelReservation(id);
      setReservation(updated);
      toast.success('Reserva cancelada.');
      setCancelOpen(false);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao cancelar reserva';
      toast.error(msg);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  if (!reservation) {
    return <p className="text-center text-muted-foreground py-20">Reserva não encontrada.</p>;
  }

  const restaurante = reservation.mesa?.restaurante;
  const canCancel = reservation.status === 'confirmada' || reservation.status === 'em_andamento';

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      <h1 className="font-display text-2xl font-bold text-foreground">Detalhes da reserva</h1>

      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        {restaurante?.imagem_url && (
          <img src={restaurante.imagem_url} alt="" className="h-40 w-full object-cover" />
        )}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              {restaurante?.name ?? 'Restaurante'}
            </h2>
            <StatusBadge status={reservation.status} />
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {formatDate(reservation.horario_reserva)}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatTime(reservation.horario_reserva)}
            </p>
            {reservation.mesa && (
              <p className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Mesa para {reservation.mesa.capacidade} pessoas
              </p>
            )}
            {restaurante?.endereco_completo && (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {restaurante.endereco_completo}
              </p>
            )}
          </div>
          {reservation.status === 'confirmada' && (
            <div className="rounded-lg bg-secondary/50 border border-border p-3 text-xs text-muted-foreground">
              Confirme sua chegada com o restaurante para liberar sua mesa.
            </div>
          )}
          {reservation.status === 'em_andamento' && (
            <div className="rounded-lg bg-accent/20 border border-accent/30 p-3 text-xs text-foreground">
              Check-in realizado! Aproveite sua refeição.
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => navigate('/app/reservations')}>
              Voltar
            </Button>
            {canCancel && (
              <Button variant="destructive" className="flex-1" onClick={() => setCancelOpen(true)}>
                Cancelar
              </Button>
            )}
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
