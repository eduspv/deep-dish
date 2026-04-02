import { Reservation } from '@/types';
import { httpClient } from './httpClient';

export const reservationsService = {

  // ─── Lista reservas do usuário logado ───────────────────
  // TODO: GET /reservas
  async listUserReservations(_userId: string): Promise<Reservation[]> {
    // return httpClient.get<Reservation[]>('/reservas');
    return [];
  },

  // ─── Busca uma reserva pelo ID ──────────────────────────
  // TODO: GET /reservas/:id
  async getReservationById(id: string): Promise<Reservation | null> {
    // return httpClient.get<Reservation>(`/reservas/${id}`);
    return null;
  },

  // ─── Cria uma nova reserva ──────────────────────────────
  // TODO: POST /reservas
  async createReservation(payload: Partial<Reservation>): Promise<Reservation> {
    // return httpClient.post<Reservation>('/reservas', payload);
    return {
      id:              'res-new-' + Date.now(),
      userId:          '',
      restaurantId:    payload.restaurantId    || '',
      restaurantName:  payload.restaurantName  || '',
      restaurantImage: payload.restaurantImage || '',
      date:            payload.date            || new Date().toISOString(),
      time:            payload.time            || '',
      partySize:       payload.partySize       || 1,
      status:          'pending',
      createdAt:       new Date().toISOString(),
    };
  },

  // ─── Cancela uma reserva ────────────────────────────────
  // TODO: DELETE /reservas/:id
  async cancelReservation(id: string): Promise<Reservation> {
    // return httpClient.delete<Reservation>(`/reservas/${id}`);
    return {
      id,
      userId:          '',
      restaurantId:    '',
      restaurantName:  '',
      restaurantImage: '',
      date:            '',
      time:            '',
      partySize:       1,
      status:          'cancelled',
      createdAt:       new Date().toISOString(),
    };
  },

  // ─── Atualiza status de uma reserva ─────────────────────
  // TODO: PUT /reservas/:id/status
  async updateReservationStatus(
    id: string,
    status: Reservation['status']
  ): Promise<Reservation> {
    // return httpClient.put<Reservation>(`/reservas/${id}/status`, { status });
    return {
      id,
      userId:          '',
      restaurantId:    '',
      restaurantName:  '',
      restaurantImage: '',
      date:            '',
      time:            '',
      partySize:       1,
      status,
      createdAt:       new Date().toISOString(),
    };
  },
};