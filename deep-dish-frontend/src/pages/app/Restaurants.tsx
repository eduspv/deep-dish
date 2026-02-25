import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RestaurantCard from '@/components/RestaurantCard';
import EmptyState from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { mockRestaurants } from '@/mocks/restaurants';
import { Restaurante } from '@/types';
import { Utensils } from 'lucide-react';

const Restaurants: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      let results = [...mockRestaurants];
      const name = searchParams.get('name');
      const city = searchParams.get('city');
      if (name) results = results.filter(r => r.name.toLowerCase().includes(name.toLowerCase()));
      if (city) results = results.filter(r => r.city.toLowerCase().includes(city.toLowerCase()));
      setRestaurants(results);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Restaurantes</h1>
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(i => <Skeleton key={i} className="h-72 rounded-xl" />)}</div>
      ) : restaurants.length === 0 ? (
        <EmptyState icon={<Utensils className="h-7 w-7" />} title="Nenhum restaurante encontrado" description="Tente outros filtros de busca." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
