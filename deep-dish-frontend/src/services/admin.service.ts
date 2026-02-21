import { Table, RestaurantSettings, StaffMember, Reservation } from '@/types';
import { mockTables, mockSettings, mockStaff } from '@/mocks/restaurants';
import { mockAdminReservations } from '@/mocks/reservations';
import { mockQueueEntries } from '@/mocks/queue';
import { QueueEntry } from '@/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
  async getDashboardStats(): Promise<{ queueSize: number; reservationsToday: number; tablesAvailable: number; totalTables: number }> {
    await delay(400);
    return { queueSize: mockQueueEntries.length, reservationsToday: mockAdminReservations.length, tablesAvailable: mockTables.filter(t => t.status === 'available').length, totalTables: mockTables.length };
  },
  async getTables(): Promise<Table[]> {
    await delay(400);
    return mockTables;
  },
  async createTable(table: Partial<Table>): Promise<Table> {
    await delay(500);
    return { id: 't-new-' + Date.now(), restaurantId: 'r1', number: table.number || 99, capacity: table.capacity || 4, status: 'available' };
  },
  async updateTable(id: string, data: Partial<Table>): Promise<Table> {
    await delay(400);
    const t = mockTables.find(t => t.id === id) || mockTables[0];
    return { ...t, ...data };
  },
  async getSettings(): Promise<RestaurantSettings> {
    await delay(300);
    return mockSettings;
  },
  async updateSettings(data: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    await delay(500);
    return { ...mockSettings, ...data };
  },
  async getStaff(): Promise<StaffMember[]> {
    await delay(400);
    return mockStaff;
  },
  async createStaff(member: Partial<StaffMember>): Promise<StaffMember> {
    await delay(500);
    return { id: 's-new-' + Date.now(), restaurantId: 'r1', name: member.name || '', role: member.role || '', schedule: member.schedule || '', active: true };
  },
  async getQueue(): Promise<QueueEntry[]> {
    await delay(400);
    return mockQueueEntries;
  },
  async getReservations(): Promise<Reservation[]> {
    await delay(400);
    return mockAdminReservations;
  },
};
