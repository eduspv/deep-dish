import { Restaurante } from '@/types';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, Star } from 'lucide-react';
import { storageUrl } from '@/lib/storage';

const PRICE_LABELS: Record<number, string> = { 1: 'R$', 2: 'R$$', 3: 'R$$$', 4: 'R$$$$' };

const isOpen = (abertura?: string | null, fechamento?: string | null): boolean | null => {
  if (!abertura || !fechamento) return null;
  const now = new Date();
  const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return hhmm >= abertura.slice(0, 5) && hhmm < fechamento.slice(0, 5);
};

const RestaurantCard = ({ restaurant }: { restaurant: Restaurante }) => {
  const endereco = restaurant.endereco_completo || [restaurant.logradouro, restaurant.numero, restaurant.bairro, restaurant.cidade, restaurant.estado].filter(Boolean).join(', ');
  const open = isOpen(restaurant.horario_abertura, restaurant.horario_fechamento);

  return (
    <Link to={`/app/restaurants/${restaurant.id}`} className="group block @container">
      <div className="overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-300 ease-out-expo hover:shadow-card-hover hover:-translate-y-1">
        <div className="relative h-40 @sm:h-44 overflow-hidden">
          {restaurant.imagem_url ? (
            <img
              src={storageUrl(restaurant.imagem_url)}
              alt={restaurant.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <span className="text-5xl font-bold text-muted-foreground/15 font-display">
                {restaurant.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3 flex gap-1.5">
            {open !== null && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${
                open ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-white animate-pulse-soft' : 'bg-white/60'}`} />
                {open ? 'Aberto' : 'Fechado'}
              </span>
            )}
            {!!restaurant.fila_ativa && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm bg-amber-500/90 text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-soft" />
                Fila ativa
              </span>
            )}
            {!!restaurant.reservations_enabled && !restaurant.fila_ativa && (
              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm bg-blue-500/90 text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Reservas
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
              {restaurant.name}
            </h3>
            <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
              {restaurant.price_range && (
                <span className="font-medium">{PRICE_LABELS[restaurant.price_range]}</span>
              )}
              {restaurant.rating && (
                <span className="inline-flex items-center gap-0.5 font-medium text-gold-accent">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {Number(restaurant.rating).toFixed(1)}
                </span>
              )}
            </div>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground capitalize">{restaurant.tipo}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
            {restaurant.cidade && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" />{restaurant.cidade}
              </span>
            )}
            {restaurant.horario_abertura && restaurant.horario_fechamento && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3 shrink-0" />
                {restaurant.horario_abertura.slice(0, 5)} – {restaurant.horario_fechamento.slice(0, 5)}
              </span>
            )}
            {!!restaurant.fila_ativa && restaurant.tamanho_fila_atual > 0 && (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3 shrink-0" />{restaurant.tamanho_fila_atual} na fila
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
