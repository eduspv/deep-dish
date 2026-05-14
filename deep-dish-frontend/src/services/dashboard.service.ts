import { httpClient } from './httpClient';

export interface DashboardStats {
  queue_size: number;
  reservations_today: number;
  tables_available: number;
  total_tables: number;
}

export const dashboardService = {
  async stats(): Promise<DashboardStats> {
    return httpClient.get('/restaurante/dashboard');
  },
};