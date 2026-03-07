import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RestaurantCard from '@/components/RestaurantCard';
import EmptyState from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Restaurante } from '@/types';
import { Utensils } from 'lucide-react';
import { restaurantsService } from '@/services/restaurants.service';

const Restaurants: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const name = searchParams.get('name') || undefined;
      const city = searchParams.get('city') || undefined;
      try {
        const results = await restaurantsService.listRestaurants({ name, city });
        if (!cancelled) {
          setRestaurants(results);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Restaurantes</h1>
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <EmptyState
          icon={<Utensils className="h-7 w-7" />}
          title="Nenhum restaurante encontrado"
          description="Tente outros filtros de busca."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map(r => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
