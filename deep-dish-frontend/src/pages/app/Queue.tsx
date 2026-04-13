import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import ConfirmModal from '@/components/ConfirmModal';
import EmptyState from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { mockUserQueue } from '@/mocks/queue';
import { QueueEntry } from '@/types';
import { Users, Clock, Hash } from 'lucide-react';
import { toast } from 'sonner';

const Queue: React.FC = () => {
  const [entry, setEntry] = useState<QueueEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => { setEntry(mockUserQueue); setLoading(false); }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleCancel = async () => {
    setCancelling(true);
    await new Promise(r => setTimeout(r, 600));
    toast.success('Saiu da fila.');
    setCancelling(false);
    setCancelOpen(false);
    setEntry(null);
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-48 rounded-2xl" /></div>;

  if (!entry || entry.status === 'cancelled') {
    return (
      <EmptyState
        icon={<Users className="h-7 w-7" />}
        title="Você não está em nenhuma fila"
        description="Entre na fila de um restaurante para acompanhar sua posição."
        action={<Button onClick={() => navigate('/app/restaurants')}>Ver restaurantes</Button>}
      />
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-foreground">Acompanhar fila</h1>

      <div className="rounded-2xl bg-card p-6 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-foreground text-lg">{entry.restaurantName}</h2>
          <StatusBadge status={entry.status} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Hash, value: entry.position, label: 'Posição' },
            { icon: Clock, value: entry.estimatedWaitMinutes, label: 'min restantes' },
            { icon: Users, value: entry.partySize, label: 'Pessoas' },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-xl bg-secondary/60 p-4 text-center"
            >
              <stat.icon className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 text-2xl font-bold text-foreground font-display animate-count-up">
                {stat.value}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {entry.status === 'called' && (
          <div className="relative rounded-xl bg-primary/8 p-5 text-center overflow-hidden">
            <div className="absolute inset-0 rounded-xl border-2 border-primary/30 animate-pulse-soft" />
            <p className="relative font-display font-bold text-primary text-lg">Sua mesa está pronta!</p>
            <p className="relative text-sm text-muted-foreground mt-1">Dirija-se ao restaurante.</p>
          </div>
        )}

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
