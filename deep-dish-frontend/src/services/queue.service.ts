import { QueueEntry } from '@/types';
import { mockUserQueue, mockQueueEntries } from '@/mocks/queue';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const queueService = {
  async joinQueue(payload: { restaurantId: string; partySize: number }): Promise<QueueEntry> {
    await delay(600);
    return { ...mockUserQueue, restaurantId: payload.restaurantId, partySize: payload.partySize };
  },
  async getUserQueueStatus(_userId: string): Promise<QueueEntry | null> {
    await delay(400);
    return mockUserQueue;
  },
  async cancelQueue(entryId: string): Promise<QueueEntry> {
    await delay(400);
    return { ...mockUserQueue, id: entryId, status: 'cancelled' };
  },
  async getRestaurantQueue(_restaurantId: string): Promise<QueueEntry[]> {
    await delay(500);
    return mockQueueEntries;
  },
  async updateQueueEntryStatus(entryId: string, status: QueueEntry['status']): Promise<QueueEntry> {
    await delay(400);
    const entry = mockQueueEntries.find(e => e.id === entryId) || mockQueueEntries[0];
    return { ...entry, status };
  },
};
