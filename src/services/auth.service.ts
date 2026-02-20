import { User } from '@/types';
import { mockUser, mockRestaurantUser } from '@/mocks/user';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(email: string, _password: string): Promise<User> {
    await delay(600);
    if (email.includes('restaurant') || email.includes('admin')) return mockRestaurantUser;
    return mockUser;
  },
  async register(name: string, email: string, _password: string): Promise<User> {
    await delay(800);
    return { ...mockUser, name, email };
  },
  async restaurantLogin(email: string, _password: string): Promise<User> {
    await delay(600);
    void email;
    return mockRestaurantUser;
  },
  async restaurantRegister(name: string, email: string, _password: string): Promise<User> {
    await delay(800);
    return { ...mockRestaurantUser, name, email };
  },
  async logout(): Promise<void> {
    await delay(300);
  },
  async getCurrentUser(): Promise<User | null> {
    await delay(200);
    return mockUser;
  },
};
