import { Reserva } from '@/types';
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

export const reservationsService = {

  // ─── Cliente: cria reserva ──────────────────────────────
  async createReservation(payload: CreateReservaPayload): Promise<Reserva> {
    const res = await httpClient.post<CreateReservaResponse>('/reservas', payload);
    return res.reserva;
  },

  // ─── Cliente: lista suas reservas ───────────────────────
  async listUserReservations(): Promise<Reserva[]> {
    return httpClient.get<Reserva[]>('/reservas');
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

  // ─── Restaurante: lista reservas das suas mesas ─────────
  async listRestaurantReservations(): Promise<Reserva[]> {
    return httpClient.get<Reserva[]>('/restaurante/reservas');
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
};
