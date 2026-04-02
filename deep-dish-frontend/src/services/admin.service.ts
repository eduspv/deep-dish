import { Table, RestaurantSettings, StaffMember, Reservation } from '@/types';
import { mockTables, mockSettings, mockStaff } from '@/mocks/restaurants';
import { mockAdminReservations } from '@/mocks/reservations';
import { mockQueueEntries } from '@/mocks/queue';
import { QueueEntry } from '@/types';
import { httpClient } from './httpClient';

export const adminService = {

  // ─── Dashboard ──────────────────────────────────────────
  // TODO: GET /restaurante/dashboard/stats
  async getDashboardStats(): Promise<{
    queueSize: number;
    reservationsToday: number;
    tablesAvailable: number;
    totalTables: number;
  }> {
    return {
      queueSize:          mockQueueEntries.length,
      reservationsToday:  mockAdminReservations.length,
      tablesAvailable:    mockTables.filter(t => t.status === 'available').length,
      totalTables:        mockTables.length,
    };
  },

  // ─── Mesas ──────────────────────────────────────────────
  // TODO: GET /mesa
  async getTables(): Promise<Table[]> {
    return mockTables;
  },

  // TODO: POST /mesa
  async createTable(table: Partial<Table>): Promise<Table> {
    return {
      id:           't-new-' + Date.now(),
      restaurantId: 'r1',
      number:       table.number   || 99,
      capacity:     table.capacity || 4,
      status:       'available',
    };
  },

  // TODO: PUT /mesa/:id
  async updateTable(id: string, data: Partial<Table>): Promise<Table> {
    const t = mockTables.find(t => t.id === id) || mockTables[0];
    return { ...t, ...data };
  },

  // ─── Configurações ──────────────────────────────────────
  // TODO: GET /restaurante/settings
  async getSettings(): Promise<RestaurantSettings> {
    return mockSettings;
  },

  // TODO: PUT /restaurante/settings
  async updateSettings(data: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    return { ...mockSettings, ...data };
  },

  // ─── Funcionários ───────────────────────────────────────
  // TODO: GET /funcionario
  async getStaff(): Promise<StaffMember[]> {
    return mockStaff;
  },

  // TODO: POST /funcionario
  async createStaff(member: Partial<StaffMember>): Promise<StaffMember> {
    return {
      id:           's-new-' + Date.now(),
      restaurantId: 'r1',
      name:         member.name     || '',
      role:         member.role     || '',
      schedule:     member.schedule || '',
      active:       true,
    };
  },

  // ─── Fila ───────────────────────────────────────────────
  // TODO: GET /fila
  async getQueue(): Promise<QueueEntry[]> {
    return mockQueueEntries;
  },

  // ─── Reservas ───────────────────────────────────────────
  // TODO: GET /reservas
  async getReservations(): Promise<Reservation[]> {
    return mockAdminReservations;
  },
};