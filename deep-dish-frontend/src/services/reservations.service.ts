import { Paginated, Reserva } from '@/types';
import { httpClient } from './httpClient';

interface CreateReservaPayload {
  mesa_id:         string;
  party_size:      number;
  horario_reserva: string; // ISO datetime ex: "2026-04-13T19:00:00"
}

interface CreateReservaResponse {
  message: string;
  reserva: Reserva;
}

export interface ReservaListParams {
  page?:         number;
  per_page?:     number;
  status_group?: 'active' | 'finished';
}

function buildQuery(params?: ReservaListParams): string {
  if (!params) return '';
  const q = new URLSearchParams();
  if (params.page)         q.set('page',         String(params.page));
  if (params.per_page)     q.set('per_page',     String(params.per_page));
  if (params.status_group) q.set('status_group', params.status_group);
  const str = q.toString();
  return str ? `?${str}` : '';
}

export const reservationsService = {

  // ─── Cliente: cria reserva ──────────────────────────────
  async createReservation(payload: CreateReservaPayload): Promise<Reserva> {
    const res = await httpClient.post<CreateReservaResponse>('/reservas', payload);
    return res.reserva;
  },

  // ─── Cliente: lista suas reservas (paginado) ────────────
  async listUserReservations(params?: ReservaListParams): Promise<Paginated<Reserva>> {
    return httpClient.get<Paginated<Reserva>>(`/reservas${buildQuery(params)}`);
  },

  // ─── Cliente: busca uma reserva pelo ID ─────────────────
  async getReservationById(id: string): Promise<Reserva | null> {
    try {
      return await httpClient.get<Reserva>(`/reservas/${id}`);
    } catch {
      return null;
    }
  },

  // ─── Cliente: cancela reserva ───────────────────────────
  async cancelReservation(id: string): Promise<Reserva> {
    const res = await httpClient.delete<{ message: string; reserva: Reserva }>(`/reservas/${id}`);
    return res.reserva;
  },

  // ─── Restaurante: lista reservas das suas mesas (paginado)
  async listRestaurantReservations(params?: ReservaListParams): Promise<Paginated<Reserva>> {
    return httpClient.get<Paginated<Reserva>>(`/restaurante/reservas${buildQuery(params)}`);
  },

  // ─── Restaurante: faz check-in do cliente ────────────────
  async checkin(id: string): Promise<Reserva> {
    const res = await httpClient.patch<{ message: string; reserva: Reserva }>(
      `/restaurante/reservas/${id}/checkin`,
      {}
    );
    return res.reserva;
  },

  // ─── Restaurante: marca mesa como liberada ──────────────
  async liberarMesa(id: string): Promise<Reserva> {
    const res = await httpClient.patch<{ message: string; reserva: Reserva }>(
      `/restaurante/reservas/${id}/liberar`,
      {}
    );
    return res.reserva;
  },

  // ─── Restaurante: exclui permanentemente reserva finalizada
  async deleteRestaurantReservation(id: string): Promise<void> {
    await httpClient.delete<{ message: string }>(`/restaurante/reservas/${id}`);
  },
};
