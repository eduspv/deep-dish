import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import StatusBadge from '@/components/StatusBadge';
import { restaurantsService } from '@/services/restaurants.service';
import { Restaurante } from '@/types';
import { ArrowLeft, MapPin, Clock, Users, Phone, Star } from 'lucide-react';

const PRICE_LABELS: Record<number, string> = { 1: 'R$', 2: 'R$$', 3: 'R$$$', 4: 'R$$$$' };

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurante | null>(null);
  const [loading, setLoading] = useState(true);
  const [partySize, setPartySize] = useState('2');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await restaurantsService.getRestaurantById(id);
        if (!cancelled) {
          setRestaurant(data ?? null);
        }
      } catch {
        if (!cancelled) setRestaurant(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleQueue = () => navigate('/app/queue');

  const handleReserve = () => {
    navigate('/app/confirm', {
      state: {
        restaurantId:    id,
        restaurantName:  restaurant?.name,
        restaurantImage: restaurant?.imagem_url,
        time:            selectedTime,
        partySize:       Number(partySize),
      },
    });
  };

  const endereco = restaurant?.endereco_completo ||
    (restaurant
      ? [restaurant.logradouro, restaurant.numero, restaurant.bairro, restaurant.cidade]
          .filter(Boolean).join(', ')
      : '');

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-56 rounded-xl" />
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-20" />
    </div>
  );

  if (!restaurant) return (
    <p className="text-center text-muted-foreground py-20">
      Restaurante não encontrado.
    </p>
  );

  return (
    <div className="space-y-6">

      {/* Voltar */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      {/* Banner */}
      <div className="relative h-56 md:h-72 overflow-hidden rounded-xl">
        {restaurant.imagem_url ? (
          <img
            src={restaurant.imagem_url}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <span className="text-6xl font-bold text-muted-foreground/20">
              {restaurant.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-surface/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-dark-surface-foreground">
            {restaurant.name}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-dark-surface-foreground/80">
            {restaurant.rating && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-gold-accent text-gold-accent" />
                {Number(restaurant.rating).toFixed(1)}
              </span>
            )}
            <span className="capitalize">{restaurant.tipo}</span>
            {restaurant.price_range && (
              <span className="font-medium">{PRICE_LABELS[restaurant.price_range]}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">

        {/* Coluna principal */}
        <div className="md:col-span-2 space-y-6">

          {/* Informações */}
          <div className="rounded-xl bg-card p-5 shadow-card">
            {/* description — campo futuro */}
            <p className="text-foreground">
              {restaurant.description || `Restaurante especializado em ${restaurant.tipo}.`}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              {endereco && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {endereco}
                </span>
              )}
              {restaurant.horario_abertura && restaurant.horario_fechamento && (
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  {restaurant.horario_abertura.slice(0, 5)} – {restaurant.horario_fechamento.slice(0, 5)}
                </span>
              )}
              {restaurant.telefone && (
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  {restaurant.telefone}
                </span>
              )}
            </div>
          </div>

          {/* Horários disponíveis — aguardando endpoint do backend */}
          {!!restaurant.reservations_enabled && (
            <div className="rounded-xl bg-card p-5 shadow-card">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">
                Horários disponíveis
              </h2>
              <p className="text-sm text-muted-foreground">
                Em breve você poderá escolher horários para reserva.
              </p>
            </div>
          )}
        </div>

        {/* Coluna lateral */}
        <div className="space-y-4">
          <div className="rounded-xl bg-card p-5 shadow-card space-y-4">

            <div>
              <Label>Quantidade de pessoas</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={partySize}
                onChange={e => setPartySize(e.target.value)}
              />
            </div>

            {/* Fila ativa */}
            {!!restaurant.fila_ativa && (
              <div className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Fila ativa</span>
                  <StatusBadge status="waiting" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {restaurant.tamanho_fila_atual ?? 0} pessoas
                  {restaurant.averageWaitTime ? ` · ~${restaurant.averageWaitTime}min` : ''}
                </p>
                <Button onClick={handleQueue} className="w-full mt-3" size="sm">
                  Entrar na fila
                </Button>
              </div>
            )}

            {/* Reserva */}
            {restaurant.reservations_enabled && (
              <Button
                onClick={handleReserve}
                disabled={!selectedTime}
                className="w-full"
                size="lg"
              >
                Reservar mesa
              </Button>
            )}

            {/* Nenhuma ação disponível */}
            {!restaurant.fila_ativa && !restaurant.reservations_enabled && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Este restaurante não possui fila ou reservas ativas no momento.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;