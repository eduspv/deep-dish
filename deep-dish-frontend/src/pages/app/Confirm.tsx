import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, CalendarDays, Clock, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { reservationsService } from '@/services/reservations.service';
import { ApiError } from '@/services/httpClient';
import { formatBRT } from '@/lib/utils';

const formatDate = (iso: string) => formatBRT(iso, { day: '2-digit', month: 'long', year: 'numeric' });
const formatTime = (iso: string) => formatBRT(iso, { hour: '2-digit', minute: '2-digit' });

const Confirm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const state = location.state as {
    restaurantId?:    string;
    restaurantName?:  string;
    restaurantImage?: string;
    mesaId?:          string;
    mesaNumero?:      number;
    mesaCapacidade?:  number;
    partySize?:       number;
    horarioReserva?:  string;
  } | null;

  if (!state || !state.restaurantId || !state.mesaId || !state.partySize || !state.horarioReserva) {
    return (
      <p className="py-20 text-center text-muted-foreground">
        Nenhuma reserva para confirmar.{' '}
        <button onClick={() => navigate('/app/search')} className="text-primary hover:underline">
          Buscar restaurante
        </button>
      </p>
    );
  }

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await reservationsService.createReservation({
        mesa_id:         state.mesaId!,
        party_size:      state.partySize!,
        horario_reserva: state.horarioReserva!,
      });

      toast.success('Reserva criada com sucesso!');
      navigate('/app');
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao criar reserva';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Confirmar reserva</h1>
      <div className="rounded-xl bg-card p-6 shadow-card space-y-4">
        {state.restaurantImage && (
          <img src={state.restaurantImage} alt="" className="h-40 w-full rounded-lg object-cover" />
        )}
        <h2 className="font-display text-xl font-semibold text-foreground">{state.restaurantName}</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {formatDate(state.horarioReserva)}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {formatTime(state.horarioReserva)}
          </p>
          <p className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Mesa {state.mesaNumero} ({state.mesaCapacidade} lugares)
          </p>
          <p className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {state.partySize} {state.partySize === 1 ? 'pessoa' : 'pessoas'}
          </p>
        </div>
        <div className="rounded-lg bg-secondary/50 border border-border p-3 text-xs text-muted-foreground">
          Ao chegar, confirme sua presença com o restaurante para liberar sua mesa.
          Recomendamos chegar com 5-10 minutos de antecedência.
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => navigate(-1)} disabled={loading}>
            Voltar
          </Button>
          <Button className="flex-1" onClick={handleConfirm} disabled={loading}>
            {loading ? 'Confirmando...' : 'Confirmar reserva'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
