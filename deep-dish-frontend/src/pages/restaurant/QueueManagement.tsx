import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { mockQueueEntries } from '@/mocks/queue';
import { QueueEntry } from '@/types';
import { toast } from 'sonner';

const QueueManagement: React.FC = () => {
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { setEntries(mockQueueEntries); setLoading(false); }, 400);
    return () => clearTimeout(timer);
  }, []);

  const updateStatus = (id: string, status: QueueEntry['status'], msg: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    toast.success(msg);
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" />{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Fila</h1>
      <div className="space-y-3">
        {entries.map(e => (
          <div key={e.id} className="rounded-xl bg-card p-4 shadow-card flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{e.userName}</span>
                <StatusBadge status={e.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {e.partySize} pessoas · Posição #{e.position} · {e.userPhone}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {e.status === 'waiting' && (
                <>
                  <Button size="sm" onClick={() => updateStatus(e.id, 'called', `${e.userName} chamado!`)}>Mesa pronta</Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(e.id, 'cancelled', 'Removido da fila.')}>Remover</Button>
                </>
              )}
              {e.status === 'called' && (
                <>
                  <Button size="sm" onClick={() => updateStatus(e.id, 'seated', `${e.userName} sentado!`)}>Sentou</Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(e.id, 'no_show', 'Marcado como não compareceu.')}>No show</Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueueManagement;
