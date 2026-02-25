import { Restaurante } from '@/types';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, Star } from 'lucide-react';
import StatusBadge from './StatusBadge';

const RestaurantCard = ({ restaurant }: { restaurant: Restaurante }) => {
  const priceLabel = '€'.repeat(restaurant.priceRange);

  return (
    <Link to={`/app/restaurants/${restaurant.id}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
        <div className="relative h-44 overflow-hidden">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 flex gap-1.5">
            {restaurant.queueActive && <StatusBadge status="waiting" />}
            {restaurant.reservationsEnabled && <StatusBadge status="available" />}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 text-sm shrink-0">
              <Star className="h-4 w-4 fill-gold-accent text-gold-accent" />
              <span className="font-medium">{restaurant.rating}</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{restaurant.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{restaurant.city}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{restaurant.openingHours}</span>
            {restaurant.queueActive && (
              <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{restaurant.currentQueueSize} na fila</span>
            )}
            <span className="ml-auto font-medium text-foreground">{priceLabel}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
