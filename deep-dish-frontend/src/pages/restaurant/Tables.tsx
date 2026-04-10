import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StatusBadge from '@/components/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Mesa } from '@/types';
import { mesasService } from '@/services/mesas.service';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const Tables: React.FC = () => {
  const [tables, setTables] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTable, setEditTable] = useState<Mesa | null>(null);
  const [formNumber, setFormNumber] = useState('');
  const [formCapacity, setFormCapacity] = useState('4');

  const fetchTables = async () => {
    try {
      const data = await mesasService.list();
      setTables(data);
    } catch {
      toast.error('Erro ao carregar mesas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTables(); }, []);

  const openNew = () => { setEditTable(null); setFormNumber(''); setFormCapacity('4'); setDialogOpen(true); };
  const openEdit = (t: Mesa) => { setEditTable(t); setFormNumber(String(t.numero)); setFormCapacity(String(t.capacidade)); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editTable) {
        const updated = await mesasService.update(editTable.id, {
          numero: Number(formNumber),
          capacidade: Number(formCapacity),
        });
        setTables(prev => prev.map(t => t.id === editTable.id ? updated : t));
        toast.success('Mesa atualizada!');
      } else {
        const created = await mesasService.create({
          numero: Number(formNumber),
          capacidade: Number(formCapacity),
        });
        setTables(prev => [...prev, created]);
        toast.success('Mesa criada!');
      }
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao salvar mesa.');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (t: Mesa) => {
    const next = t.status === 'bloqueada' ? 'livre' : 'bloqueada';
    try {
      const updated = await mesasService.update(t.id, { status: next });
      setTables(prev => prev.map(tb => tb.id === t.id ? updated : tb));
      toast.success(`Mesa ${t.numero} ${next === 'bloqueada' ? 'bloqueada' : 'liberada'}.`);
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao atualizar status.');
    }
  };

  const handleDelete = async (t: Mesa) => {
    try {
      await mesasService.remove(t.id);
      setTables(prev => prev.filter(tb => tb.id !== t.id));
      toast.success(`Mesa ${t.numero} removida.`);
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao remover mesa.');
    }
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 rounded-xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Mesas</h1>
        <Button size="sm" onClick={openNew}><Plus className="mr-1 h-4 w-4" />Nova mesa</Button>
      </div>

      {tables.length === 0 && (
        <p className="text-muted-foreground text-center py-8">Nenhuma mesa cadastrada. Clique em "Nova mesa" para começar.</p>
      )}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {tables.map(t => (
          <div key={t.id} className="rounded-xl bg-card p-4 shadow-card flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Mesa {t.numero}</p>
              <p className="text-sm text-muted-foreground">{t.capacidade} lugares</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={t.status} />
              <Button variant="ghost" size="sm" onClick={() => openEdit(t)}>Editar</Button>
              <Button variant="outline" size="sm" onClick={() => toggleStatus(t)}>{t.status === 'bloqueada' ? 'Desbloquear' : 'Bloquear'}</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(t)}>Excluir</Button>
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
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tables;
