import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, Users, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const Confirm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const state = location.state as { restaurantId?: string; restaurantName?: string; restaurantImage?: string; time?: string; partySize?: number } | null;

  if (!state) {
    return <p className="py-20 text-center text-muted-foreground">Nenhuma reserva para confirmar. <button onClick={() => navigate('/app/search')} className="text-primary hover:underline">Buscar restaurante</button></p>;
  }

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Reserva criada com sucesso!');
    setLoading(false);
    navigate('/app');
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
          <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />Hoje</p>
          <p className="flex items-center gap-2"><Clock className="h-4 w-4" />{state.time}</p>
          <p className="flex items-center gap-2"><Users className="h-4 w-4" />{state.partySize} pessoas</p>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />Mesa será atribuída pelo restaurante</p>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>Voltar</Button>
          <Button className="flex-1" onClick={handleConfirm} disabled={loading}>{loading ? 'Confirmando...' : 'Confirmar reserva'}</Button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
