import { Restaurant, TimeSlot } from '@/types';
import { mockRestaurants, mockTimeSlots } from '@/mocks/restaurants';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const restaurantsService = {
  async listRestaurants(filters?: { name?: string; city?: string }): Promise<Restaurant[]> {
    await delay(500);
    let results = [...mockRestaurants];
    if (filters?.name) results = results.filter(r => r.name.toLowerCase().includes(filters.name!.toLowerCase()));
    if (filters?.city) results = results.filter(r => r.city.toLowerCase().includes(filters.city!.toLowerCase()));
    return results;
  },
  async getRestaurantById(id: string): Promise<Restaurant | undefined> {
    await delay(400);
    return mockRestaurants.find(r => r.id === id);
  },
  async getTimeSlots(_restaurantId: string, _date: string): Promise<TimeSlot[]> {
    await delay(400);
    return mockTimeSlots;
  },
};
