import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import ConfirmModal from '@/components/ConfirmModal';
import EmptyState from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { queueService } from '@/services/queue.service';
import { ClienteFilaEntry } from '@/types';
import { Users, Clock, Hash, ListOrdered } from 'lucide-react';
import { toast } from 'sonner';
import { formatBRT } from '@/lib/utils';

const STORAGE_KEY = 'deepdish_fila';

interface QueueState {
  entry: ClienteFilaEntry;
  restaurantName: string;
  restaurantImage?: string;
  horarioReserva: string;
}

const Queue: React.FC = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const navState   = location.state as QueueState | null;

  const [state, setState]         = useState<QueueState | null>(null);
  const [loading, setLoading]     = useState(true);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Carrega do navigation state ou localStorage
  useEffect(() => {
    if (navState?.entry) {
      setState(navState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(navState));
      setLoading(false);
      return;
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setState(JSON.parse(saved)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  // Polling — atualiza posição a cada 30s
  const refreshPosicao = useCallback(async (current: QueueState) => {
    const filaId = current.entry.fila?.restaurante_id;
    const horario = current.entry.fila?.horario_reserva;
    if (!filaId || !horario) return;
    try {
      const updated = await queueService.consultarPosicao({
        restaurante_id: filaId,
        horario_reserva: horario,
      });
      setState(prev => prev ? { ...prev, entry: updated } : prev);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, entry: updated }));
    } catch {
      // 404 = saiu da fila (foi promovido ou expirou)
      setState(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!state) return;
    const interval = setInterval(() => refreshPosicao(state), 30_000);
    return () => clearInterval(interval);
  }, [state, refreshPosicao]);

  const handleCancel = async () => {
    if (!state) return;
    setCancelling(true);
    try {
      await queueService.cancelQueue(state.entry.id);
      toast.success('Você saiu da fila.');
      setState(null);
      localStorage.removeItem(STORAGE_KEY);
      setCancelOpen(false);
    } catch {
      toast.error('Erro ao sair da fila. Tente novamente.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!state) {
    return (
      <EmptyState
        icon={<ListOrdered className="h-7 w-7" />}
        title="Você não está em nenhuma fila"
        description="Entre na fila de um restaurante para acompanhar sua posição."
        action={<Button onClick={() => navigate('/app/search')}>Ver restaurantes</Button>}
      />
    );
  }

  const { entry, restaurantName, restaurantImage, horarioReserva } = state;

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-foreground">Acompanhar fila</h1>

      <div className="rounded-2xl bg-card p-6 shadow-card space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          {restaurantImage ? (
            <img src={restaurantImage} alt="" className="h-12 w-12 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-primary font-display">
                {restaurantName?.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-semibold text-foreground truncate">{restaurantName}</h2>
            {horarioReserva && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatBRT(horarioReserva, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          <StatusBadge status="waiting" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Hash,  value: entry.posicao,       label: 'Posição' },
            { icon: Clock, value: '~30',               label: 'min est.' },
            { icon: Users, value: entry.qntd_pessoas,  label: 'Pessoas' },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl bg-secondary/60 p-4 text-center">
              <stat.icon className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 text-2xl font-bold text-foreground font-display animate-count-up">
                {stat.value}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Sua posição é atualizada automaticamente a cada 30 segundos.
        </p>

        <Button variant="outline" className="w-full min-h-[44px]" onClick={() => setCancelOpen(true)}>
          Sair da fila
        </Button>
      </div>

      <ConfirmModal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        title="Sair da fila?"
        description="Você perderá sua posição atual. Tem certeza?"
        confirmLabel="Sair da fila"
        isLoading={cancelling}
      />
    </div>
  );
};

export default Queue;
