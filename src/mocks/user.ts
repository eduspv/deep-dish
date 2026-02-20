import { User } from '@/types';

export const mockUser: User = {
  id: 'user-1',
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '(11) 99999-0000',
  role: 'USER',
};

export const mockRestaurantUser: User = {
  id: 'rest-admin-1',
  name: 'Maria Chef',
  email: 'maria@deepdish.com',
  phone: '(11) 98888-0000',
  role: 'RESTAURANT',
};
