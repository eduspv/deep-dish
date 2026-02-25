import { Cliente } from '@/types';

export const mockUser: Cliente = {
  id: 'user-1',
  name: 'João Silva',
  email: 'joao@email.com',
  cpf: '123.456.789-00',
  tipo_usuario: 'cliente',
};

export const mockRestaurantUser: Cliente = {
  id: 'rest-admin-1',
  name: 'Maria Chef',
  email: 'maria@deepdish.com',
  cpf: '123.456.789-00',  
  tipo_usuario: 'restaurante',
};
