import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import StatusBadge from '@/components/StatusBadge';
import { mockRestaurants, mockTimeSlots, mockTables } from '@/mocks/restaurants';
import { Restaurant, TimeSlot } from '@/types';
import { MapPin, Clock, Star, Users, Phone } from 'lucide-react';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [partySize, setPartySize] = useState('2');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setRestaurant(mockRestaurants.find(r => r.id === id) || null);
      setTimeSlots(mockTimeSlots);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  const availableTables = mockTables.filter(t => t.status === 'available');

  const handleQueue = () => {
    navigate('/app/queue');
  };

  const handleReserve = () => {
    navigate('/app/confirm', { state: { restaurantId: id, restaurantName: restaurant?.name, restaurantImage: restaurant?.imageUrl, time: selectedTime, partySize: Number(partySize) } });
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-56 rounded-xl" /><Skeleton className="h-8 w-48" /><Skeleton className="h-20" /></div>;
  if (!restaurant) return <p className="text-center text-muted-foreground py-20">Restaurante não encontrado.</p>;

  return (
    <div className="space-y-6">
      <div className="relative h-56 md:h-72 overflow-hidden rounded-xl">
        <img src={restaurant.imageUrl} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-surface/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-dark-surface-foreground">{restaurant.name}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-dark-surface-foreground/80">
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-gold-accent text-gold-accent" />{restaurant.rating}</span>
            <span>{restaurant.type}</span>
            <span>{'€'.repeat(restaurant.priceRange)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl bg-card p-5 shadow-card">
            <p className="text-foreground">{restaurant.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />{restaurant.address}, {restaurant.city}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{restaurant.openingHours}</span>
              <span className="flex items-center gap-2"><Phone className="h-4 w-4" />{restaurant.phone}</span>
              <span className="flex items-center gap-2"><Users className="h-4 w-4" />{availableTables.length} mesas livres</span>
            </div>
          </div>

          {restaurant.reservationsEnabled && (
            <div className="rounded-xl bg-card p-5 shadow-card">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">Horários disponíveis</h2>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map(ts => (
                  <button
                    key={ts.id}
                    disabled={!ts.available}
                    onClick={() => setSelectedTime(ts.time)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${selectedTime === ts.time ? 'bg-primary text-primary-foreground border-primary' : ts.available ? 'bg-card text-foreground border-border hover:border-primary/50' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
                  >
                    {ts.time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-card p-5 shadow-card space-y-4">
            <div>
              <Label>Quantidade de pessoas</Label>
              <Input type="number" min="1" max="20" value={partySize} onChange={e => setPartySize(e.target.value)} />
            </div>

            {restaurant.queueActive && (
              <div className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Fila ativa</span>
                  <StatusBadge status="waiting" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{restaurant.currentQueueSize} pessoas · ~{restaurant.averageWaitTime}min</p>
                <Button onClick={handleQueue} className="w-full mt-3" size="sm">Entrar na fila</Button>
              </div>
            )}

            {restaurant.reservationsEnabled && (
              <Button onClick={handleReserve} disabled={!selectedTime} className="w-full" size="lg">
                Reservar mesa
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
