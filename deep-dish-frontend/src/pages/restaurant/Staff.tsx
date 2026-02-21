import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StatusBadge from '@/components/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { mockStaff } from '@/mocks/restaurants';
import { StaffMember } from '@/types';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const Staff: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formSchedule, setFormSchedule] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => { setStaff(mockStaff); setLoading(false); }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleAdd = () => {
    const member: StaffMember = { id: 's-' + Date.now(), restaurantId: 'r1', name: formName, role: formRole, schedule: formSchedule, active: true };
    setStaff(prev => [...prev, member]);
    toast.success('Membro adicionado!');
    setDialogOpen(false);
    setFormName(''); setFormRole(''); setFormSchedule('');
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" />{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Equipe</h1>
        <Button size="sm" onClick={() => setDialogOpen(true)}><Plus className="mr-1 h-4 w-4" />Adicionar</Button>
      </div>
      <div className="space-y-3">
        {staff.map(s => (
          <div key={s.id} className="rounded-xl bg-card p-4 shadow-card flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{s.name}</p>
              <p className="text-sm text-muted-foreground">{s.role} · {s.schedule}</p>
            </div>
            <StatusBadge status={s.active ? 'available' : 'inactive'} />
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader><DialogTitle>Novo membro</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nome</Label><Input value={formName} onChange={e => setFormName(e.target.value)} /></div>
            <div><Label>Função</Label><Input placeholder="Garçom, Chef..." value={formRole} onChange={e => setFormRole(e.target.value)} /></div>
            <div><Label>Horário</Label><Input placeholder="Seg-Sex 12:00-20:00" value={formSchedule} onChange={e => setFormSchedule(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd} disabled={!formName}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Staff;
