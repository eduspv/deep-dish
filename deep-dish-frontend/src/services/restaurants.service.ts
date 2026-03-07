import { Restaurante, TimeSlot } from '@/types';
import { mockRestaurants, mockTimeSlots } from '@/mocks/restaurants';

const BASE = import.meta.env.VITE_API_URL;

export const restaurantsService = {
  async listRestaurants(filters?: { name?: string; city?: string }): Promise<Restaurante[]> {
    const params = new URLSearchParams();

    // mapeia nome -> q (busca livre) e city -> cidade
    if (filters?.name) params.set('q', filters.name);
    if (filters?.city) params.set('cidade', filters.city);

    const url = `${BASE}/restaurante${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error('Erro ao buscar restaurantes:', data);
        throw new Error('Erro ao carregar restaurantes.');
      }

      // Laravel paginator: { data: [...], ... }
      if (Array.isArray(data)) return data as Restaurante[];
      if (Array.isArray(data.data)) return data.data as Restaurante[];

      return [];
    } catch (e) {
      console.error('Falha na chamada à API de restaurantes, usando mocks como fallback.', e);
      // fallback: comportamento antigo com mocks
      let results = [...mockRestaurants];
      if (filters?.name) {
        results = results.filter(r =>
          r.name.toLowerCase().includes(filters.name!.toLowerCase()),
        );
      }
      if (filters?.city) {
        results = results.filter(r =>
          r.cidade.toLowerCase().includes(filters.city!.toLowerCase()),
        );
      }
      return results;
    }
  },

  // Detalhe e timeslots ainda usam mocks por enquanto
  async getRestaurantById(id: string): Promise<Restaurante | undefined> {
    return mockRestaurants.find(r => r.id === id);
  },

  async getTimeSlots(_restaurantId: string, _date: string): Promise<TimeSlot[]> {
    return mockTimeSlots;
  },
};
