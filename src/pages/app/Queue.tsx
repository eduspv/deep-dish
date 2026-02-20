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

  if (loading) return <div className="space-y-4"><Skeleton className="h-48 rounded-xl" /></div>;

  if (!entry || entry.status === 'cancelled') {
    return <EmptyState icon={<Users className="h-7 w-7" />} title="Você não está em nenhuma fila" description="Entre na fila de um restaurante para acompanhar sua posição." action={<Button onClick={() => navigate('/app/restaurants')}>Ver restaurantes</Button>} />;
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Acompanhar fila</h1>
      <div className="rounded-xl bg-card p-6 shadow-card space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground text-lg">{entry.restaurantName}</h2>
          <StatusBadge status={entry.status} />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-lg bg-secondary p-4">
            <Hash className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-1 text-2xl font-bold text-foreground">{entry.position}</p>
            <p className="text-xs text-muted-foreground">Posição</p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <Clock className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-1 text-2xl font-bold text-foreground">{entry.estimatedWaitMinutes}</p>
            <p className="text-xs text-muted-foreground">min restantes</p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <Users className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-1 text-2xl font-bold text-foreground">{entry.partySize}</p>
            <p className="text-xs text-muted-foreground">Pessoas</p>
          </div>
        </div>

        {entry.status === 'called' && (
          <div className="rounded-lg bg-primary/10 border border-primary/30 p-4 text-center animate-pulse-soft">
            <p className="font-semibold text-primary text-lg">🔔 Sua mesa está pronta!</p>
            <p className="text-sm text-muted-foreground mt-1">Dirija-se ao restaurante.</p>
          </div>
        )}

        <Button variant="outline" className="w-full" onClick={() => setCancelOpen(true)}>Sair da fila</Button>
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
