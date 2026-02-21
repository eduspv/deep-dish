import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StatusBadge from '@/components/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { mockTables } from '@/mocks/restaurants';
import { Table } from '@/types';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const Tables: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTable, setEditTable] = useState<Table | null>(null);
  const [formNumber, setFormNumber] = useState('');
  const [formCapacity, setFormCapacity] = useState('4');

  useEffect(() => {
    const timer = setTimeout(() => { setTables(mockTables); setLoading(false); }, 400);
    return () => clearTimeout(timer);
  }, []);

  const openNew = () => { setEditTable(null); setFormNumber(''); setFormCapacity('4'); setDialogOpen(true); };
  const openEdit = (t: Table) => { setEditTable(t); setFormNumber(String(t.number)); setFormCapacity(String(t.capacity)); setDialogOpen(true); };

  const handleSave = () => {
    if (editTable) {
      setTables(prev => prev.map(t => t.id === editTable.id ? { ...t, number: Number(formNumber), capacity: Number(formCapacity) } : t));
      toast.success('Mesa atualizada!');
    } else {
      const newTable: Table = { id: 't-' + Date.now(), restaurantId: 'r1', number: Number(formNumber), capacity: Number(formCapacity), status: 'available' };
      setTables(prev => [...prev, newTable]);
      toast.success('Mesa criada!');
    }
    setDialogOpen(false);
  };

  const toggleStatus = (t: Table) => {
    const next = t.status === 'inactive' ? 'available' : 'inactive';
    setTables(prev => prev.map(tb => tb.id === t.id ? { ...tb, status: next } : tb));
    toast.success(`Mesa ${t.number} ${next === 'inactive' ? 'desativada' : 'ativada'}.`);
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Mesas</h1>
        <Button size="sm" onClick={openNew}><Plus className="mr-1 h-4 w-4" />Nova mesa</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {tables.map(t => (
          <div key={t.id} className="rounded-xl bg-card p-4 shadow-card flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Mesa {t.number}</p>
              <p className="text-sm text-muted-foreground">{t.capacity} lugares</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={t.status} />
              <Button variant="ghost" size="sm" onClick={() => openEdit(t)}>Editar</Button>
              <Button variant="outline" size="sm" onClick={() => toggleStatus(t)}>{t.status === 'inactive' ? 'Ativar' : 'Desativar'}</Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader><DialogTitle>{editTable ? 'Editar mesa' : 'Nova mesa'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Número</Label><Input type="number" value={formNumber} onChange={e => setFormNumber(e.target.value)} /></div>
            <div><Label>Capacidade</Label><Input type="number" value={formCapacity} onChange={e => setFormCapacity(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tables;
