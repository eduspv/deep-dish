import { Restaurante, TimeSlot } from '@/types';
import { mockTimeSlots } from '@/mocks/restaurants';
import { httpClient } from './httpClient';

export const restaurantsService = {

  // ─── Lista restaurantes com filtros ─────────────────────
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

    const query = params.toString();
    const path  = query ? `/restaurante?${query}` : '/restaurante';

    // backend retorna paginado: { data: [...], total, per_page... }
    const res = await httpClient.get<{ data: Restaurante[] } | Restaurante[]>(path);

    // suporte aos dois formatos de resposta
    if (Array.isArray(res))      return res;
    if (Array.isArray(res.data)) return res.data;
    return [];
  },

  // ─── Busca um restaurante pelo ID ───────────────────────
  async getRestaurantById(id: string): Promise<Restaurante | null> {
    try {
      return await httpClient.get<Restaurante>(`/restaurante/${id}`);
    } catch {
      return null;
    }
  },

  // ─── Busca horários disponíveis ─────────────────────────
  // TODO: substituir por API real quando o backend tiver essa rota
  async getTimeSlots(_restaurantId: string, _date: string): Promise<TimeSlot[]> {
    return mockTimeSlots;
  },
};