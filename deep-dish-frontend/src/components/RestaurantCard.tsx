import { Restaurante } from '@/types';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, Star } from 'lucide-react';
import StatusBadge from './StatusBadge';

const PRICE_LABELS: Record<number, string> = { 1: 'R$', 2: 'R$$', 3: 'R$$$', 4: 'R$$$$' };

const RestaurantCard = ({ restaurant }: { restaurant: Restaurante }) => {
  const endereco = restaurant.endereco_completo || [restaurant.logradouro, restaurant.numero, restaurant.bairro, restaurant.cidade, restaurant.estado].filter(Boolean).join(', ');

  return (
    <Link to={`/app/restaurants/${restaurant.id}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
        <div className="relative h-44 overflow-hidden">
          <img
            src={restaurant.imagem_url || ''}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 flex gap-1.5">
            {!!restaurant.fila_ativa && <StatusBadge status="waiting" />}
            {!!restaurant.reservations_enabled && <StatusBadge status="available" />}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {restaurant.name}
            </h3>
            <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
              {restaurant.price_range && (
                <span className="font-medium">{PRICE_LABELS[restaurant.price_range]}</span>
              )}
              {restaurant.rating && (
                <span className="inline-flex items-center gap-0.5 font-medium text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  {Number(restaurant.rating).toFixed(1)}
                </span>
              )}
            </div>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 capitalize">{restaurant.tipo}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{restaurant.cidade}{endereco ? ` · ${endereco}` : ''}</span>
            {restaurant.horario_abertura && restaurant.horario_fechamento && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {restaurant.horario_abertura.slice(0, 5)} – {restaurant.horario_fechamento.slice(0, 5)}
              </span>
            )}
            {!!restaurant.fila_ativa && restaurant.tamanho_fila_atual > 0 && (
              <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{restaurant.tamanho_fila_atual} na fila</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
