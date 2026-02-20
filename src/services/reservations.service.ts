import { Reservation } from '@/types';
import { mockReservations } from '@/mocks/reservations';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const reservationsService = {
  async listUserReservations(_userId: string): Promise<Reservation[]> {
    await delay(500);
    return mockReservations;
  },
  async getReservationById(id: string): Promise<Reservation | undefined> {
    await delay(300);
    return mockReservations.find(r => r.id === id);
  },
  async createReservation(payload: Partial<Reservation>): Promise<Reservation> {
    await delay(700);
    return {
      id: 'res-new-' + Date.now(),
      userId: 'user-1',
      restaurantId: payload.restaurantId || 'r1',
      restaurantName: payload.restaurantName || 'Restaurante',
      restaurantImage: payload.restaurantImage || '',
      date: payload.date || '2026-02-25',
      time: payload.time || '20:00',
      partySize: payload.partySize || 2,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
  },
  async cancelReservation(id: string): Promise<Reservation> {
    await delay(500);
    const res = mockReservations.find(r => r.id === id);
    return { ...res!, status: 'cancelled' };
  },
  async updateReservationStatus(id: string, status: Reservation['status']): Promise<Reservation> {
    await delay(400);
    const res = mockReservations.find(r => r.id === id) || mockReservations[0];
    return { ...res, status };
  },
};
