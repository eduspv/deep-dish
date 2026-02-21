import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { mockSettings } from '@/mocks/restaurants';
import { RestaurantSettings } from '@/types';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { setSettings(mockSettings); setLoading(false); }, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    toast.success('Configurações salvas!');
    setSaving(false);
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-96 rounded-xl" /></div>;
  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-foreground">Configurações</h1>
      <form onSubmit={handleSave} className="space-y-4 rounded-xl bg-card p-6 shadow-card">
        <div className="grid gap-4 md:grid-cols-2">
          <div><Label>Nome</Label><Input value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} /></div>
          <div><Label>Telefone</Label><Input value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })} /></div>
          <div><Label>Endereço</Label><Input value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} /></div>
          <div><Label>Cidade</Label><Input value={settings.city} onChange={e => setSettings({ ...settings, city: e.target.value })} /></div>
          <div><Label>Capacidade total</Label><Input type="number" value={settings.capacity} onChange={e => setSettings({ ...settings, capacity: Number(e.target.value) })} /></div>
          <div><Label>Máx. pessoas por mesa</Label><Input type="number" value={settings.maxPartySize} onChange={e => setSettings({ ...settings, maxPartySize: Number(e.target.value) })} /></div>
          <div><Label>Tolerância (min)</Label><Input type="number" value={settings.toleranceMinutes} onChange={e => setSettings({ ...settings, toleranceMinutes: Number(e.target.value) })} /></div>
          <div><Label>Cancelamento (min antes)</Label><Input type="number" value={settings.cancellationPolicyMinutes} onChange={e => setSettings({ ...settings, cancellationPolicyMinutes: Number(e.target.value) })} /></div>
          <div><Label>Abertura</Label><Input type="time" value={settings.openingTime} onChange={e => setSettings({ ...settings, openingTime: e.target.value })} /></div>
          <div><Label>Fechamento</Label><Input type="time" value={settings.closingTime} onChange={e => setSettings({ ...settings, closingTime: e.target.value })} /></div>
        </div>
        <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar configurações'}</Button>
      </form>
    </div>
  );
};

export default Settings;
