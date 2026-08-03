import { Restaurante, Mesa } from '@/types';
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
    const path  = query ? `/restaurantes?${query}` : '/restaurantes';

    const res = await httpClient.get<{ data: Restaurante[] } | Restaurante[]>(path);

    if (Array.isArray(res))      return res;
    if (Array.isArray(res.data)) return res.data;
    return [];
  },

  // ─── Busca um restaurante pelo ID ───────────────────────
  async getRestaurantById(id: string): Promise<Restaurante | null> {
    try {
      return await httpClient.get<Restaurante>(`/restaurantes/${id}`);
    } catch {
      return null;
    }
  },

  // ─── Busca equipe pública de um restaurante ─────────────
  async getStaff(restaurantId: string): Promise<{ name: string; cargo: string; horario?: string | null }[]> {
    try {
      return await httpClient.get(`/restaurantes/${restaurantId}/funcionarios`);
    } catch {
      return [];
    }
  },

  // ─── Busca mesas disponíveis para um horário específico ──
  async getMesasDisponiveis(restaurantId: string, capacidadeMin?: number, horario?: string): Promise<Mesa[]> {
    const params = new URLSearchParams();
    if (capacidadeMin) params.set('capacidade_min', String(capacidadeMin));
    if (horario)       params.set('horario', horario);
    const query = params.toString();
    return httpClient.get<Mesa[]>(`/restaurantes/${restaurantId}/mesas/disponiveis${query ? `?${query}` : ''}`);
  },
};
