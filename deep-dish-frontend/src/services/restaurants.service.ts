import { Restaurante, TimeSlot } from '@/types';
import { mockRestaurants, mockTimeSlots } from '@/mocks/restaurants';

const BASE = import.meta.env.VITE_API_URL;

export const restaurantsService = {
  async listRestaurants(filters?: {
    q?:      string;
    cidade?: string;
    estado?: string;
    bairro?: string;
    cep?:    string;
    tipo?:   string;
  }): Promise<Restaurante[]> {
    const params = new URLSearchParams();

    if (filters?.q)      params.set('q',      filters.q);
    if (filters?.cidade) params.set('cidade', filters.cidade);
    if (filters?.estado) params.set('estado', filters.estado);
    if (filters?.bairro) params.set('bairro', filters.bairro);
    if (filters?.cep)    params.set('cep',    filters.cep);
    if (filters?.tipo)   params.set('tipo',   filters.tipo);

    const url = `${BASE}/restaurante${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const res  = await fetch(url);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error('Erro ao buscar restaurantes:', data);
        throw new Error('Erro ao carregar restaurantes.');
      }

      if (Array.isArray(data))      return data as Restaurante[];
      if (Array.isArray(data.data)) return data.data as Restaurante[];
      return [];
    } catch (e) {
      console.error('Falha na chamada à API, usando mocks como fallback.', e);
      let results = [...mockRestaurants];
      if (filters?.q) {
        const q = filters.q.toLowerCase();
        results = results.filter(r =>
          r.name.toLowerCase().includes(q)    ||
          r.cidade?.toLowerCase().includes(q) ||
          r.bairro?.toLowerCase().includes(q),
        );
      }
      if (filters?.cidade) results = results.filter(r => r.cidade?.toLowerCase().includes(filters.cidade!.toLowerCase()));
      if (filters?.estado) results = results.filter(r => r.estado?.toLowerCase().includes(filters.estado!.toLowerCase()));
      if (filters?.bairro) results = results.filter(r => r.bairro?.toLowerCase().includes(filters.bairro!.toLowerCase()));
      if (filters?.tipo)   results = results.filter(r => r.tipo?.toLowerCase().includes(filters.tipo!.toLowerCase()));
      return results;
    }
  },

  async getRestaurantById(id: string): Promise<Restaurante | undefined> {
    return mockRestaurants.find(r => r.id === id);
  },

  async getTimeSlots(_restaurantId: string, _date: string): Promise<TimeSlot[]> {
    return mockTimeSlots;
  },
};