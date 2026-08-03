import { Mesa, MesaStatus } from '@/types';
import { httpClient } from './httpClient';

interface MesaPayload {
  numero?:     number;
  capacidade?: number;
  status?:     MesaStatus;
}

export const mesasService = {
  // ─── Lista mesas do restaurante logado ──────────────────
  async list(): Promise<Mesa[]> {
    return httpClient.get<Mesa[]>('/restaurante/mesas');
  },

  // ─── Cria nova mesa ─────────────────────────────────────
  async create(payload: { numero: number; capacidade: number }): Promise<Mesa> {
    const res = await httpClient.post<{ message: string; mesa: Mesa }>(
      '/restaurante/mesas',
      payload
    );
    return res.mesa;
  },

  // ─── Atualiza mesa ──────────────────────────────────────
  async update(id: string | number, payload: MesaPayload): Promise<Mesa> {
    const res = await httpClient.put<{ message: string; mesa: Mesa }>(
      `/restaurante/mesas/${id}`,
      payload
    );
    return res.mesa;
  },

  // ─── Remove mesa ────────────────────────────────────────
  async remove(id: string | number): Promise<void> {
    await httpClient.delete<{ message: string }>(`/restaurante/mesas/${id}`);
  },
};
