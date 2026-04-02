import { QueueEntry } from '@/types';
import { httpClient } from './httpClient';

export const queueService = {

  // ─── Entra na fila de um restaurante ────────────────────
  // TODO: POST /fila/entrar
  async joinQueue(payload: {
    restaurantId: string;
    partySize: number;
  }): Promise<QueueEntry> {
    // return httpClient.post<QueueEntry>('/fila/entrar', payload);
    return {
      id:                   'q-new-' + Date.now(),
      userId:               '',
      userName:             '',
      userPhone:            '',
      restaurantId:         payload.restaurantId,
      restaurantName:       '',
      partySize:            payload.partySize,
      position:             1,
      estimatedWaitMinutes: 15,
      status:               'waiting',
      joinedAt:             new Date().toISOString(),
    };
  },

  // ─── Busca status da fila do usuário logado ─────────────
  // TODO: GET /fila/status
  async getUserQueueStatus(_userId: string): Promise<QueueEntry | null> {
    // return httpClient.get<QueueEntry | null>('/fila/status');
    return null; // retorna null por padrão — sem fila ativa
  },

  // ─── Cancela a entrada na fila ──────────────────────────
  // TODO: DELETE /fila/:id
  async cancelQueue(entryId: string): Promise<QueueEntry> {
    // return httpClient.delete<QueueEntry>(`/fila/${entryId}`);
    return {
      id:                   entryId,
      userId:               '',
      userName:             '',
      userPhone:            '',
      restaurantId:         '',
      restaurantName:       '',
      partySize:            1,
      position:             0,
      estimatedWaitMinutes: 0,
      status:               'cancelled',
      joinedAt:             new Date().toISOString(),
    };
  },

  // ─── Lista fila de um restaurante (lado restaurante) ────
  // TODO: GET /fila/:restaurantId
  async getRestaurantQueue(_restaurantId: string): Promise<QueueEntry[]> {
    // return httpClient.get<QueueEntry[]>(`/fila/${_restaurantId}`);
    return [];
  },

  // ─── Atualiza status de uma entrada na fila ─────────────
  // TODO: PUT /fila/:id/status
  async updateQueueEntryStatus(
    entryId: string,
    status: QueueEntry['status']
  ): Promise<QueueEntry> {
    // return httpClient.put<QueueEntry>(`/fila/${entryId}/status`, { status });
    return {
      id:                   entryId,
      userId:               '',
      userName:             '',
      userPhone:            '',
      restaurantId:         '',
      restaurantName:       '',
      partySize:            1,
      position:             0,
      estimatedWaitMinutes: 0,
      status,
      joinedAt:             new Date().toISOString(),
    };
  },
};