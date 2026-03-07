import { Restaurante, Table, TimeSlot, StaffMember, RestaurantSettings } from '@/types';

function mkRestaurante(
  id: string,
  name: string,
  tipo: string,
  logradouro: string,
  numero: string,
  bairro: string,
  cidade: string,
  estado: string,
  cep: string,
  complemento?: string,
  rest: Partial<Restaurante> = {}
): Restaurante {
  const endereco_completo = [logradouro, numero, complemento, bairro, cidade, estado, cep]
    .filter(Boolean)
    .join(', ');
  return {
    id,
    name,
    tipo,
    email: 'adm@example.com',
    cnpj: '12.345.678/0001-99',
    logradouro,
    numero,
    complemento: complemento ?? null,
    bairro,
    cidade,
    estado,
    cep,
    endereco_completo,
    telefone: '',
    imagem_url: '',
    horario_funcionamento: '',
    fila_ativa: false,
    tamanho_fila_atual: 0,
    ...rest,
  };
}

export const mockRestaurants: Restaurante[] = [
  mkRestaurante('r1', 'Trattoria Bella Notte', 'bifes', 'Rua Augusta', '1200', 'Consolação', 'São Paulo', 'SP', '01304-001', undefined, {
    telefone: '(11) 3333-1111',
    imagem_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    horario_funcionamento: '12:00 - 23:00',
    fila_ativa: true,
    tamanho_fila_atual: 8,
    rating: 4.8,
    priceRange: 3,
    description: 'Massas frescas, molhos artesanais e clima acolhedor no coração da cidade.',
    averageWaitTime: 25,
    reservationsEnabled: true,
  }),
  mkRestaurante('r2', 'Sakura Sushi House', 'frutos do mar', 'Av. Liberdade', '450', 'Liberdade', 'São Paulo', 'SP', '01502-001', undefined, {
    telefone: '(11) 3333-2222',
    imagem_url: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=600&h=400&fit=crop',
    horario_funcionamento: '11:30 - 22:30',
    fila_ativa: true,
    tamanho_fila_atual: 12,
    rating: 4.7,
    priceRange: 4,
    description: 'Rodízio de sushi e sashimi com ingredientes selecionados e ambiente moderno.',
    averageWaitTime: 35,
    reservationsEnabled: true,
  }),
  mkRestaurante('r3', 'Churrascaria Fogo Nobre', 'churrasco', 'Rua Haddock Lobo', '800', 'Cerqueira César', 'São Paulo', 'SP', '01414-001', undefined, {
    telefone: '(11) 3333-3333',
    imagem_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    horario_funcionamento: '11:00 - 23:30',
    fila_ativa: false,
    tamanho_fila_atual: 0,
    rating: 4.6,
    priceRange: 4,
    description: 'Cortes nobres de carne no espeto corrido, buffet completo e carta de vinhos.',
    averageWaitTime: 20,
    reservationsEnabled: true,
  }),
  mkRestaurante('r4', 'Bistrô du Jardin', 'bifes', 'Alameda Santos', '1500', 'Cerqueira César', 'São Paulo', 'SP', '01418-100', undefined, {
    telefone: '(11) 3333-4444',
    imagem_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
    horario_funcionamento: '19:00 - 00:00',
    fila_ativa: true,
    tamanho_fila_atual: 5,
    rating: 4.9,
    priceRange: 4,
    description: 'Cozinha francesa contemporânea em um ambiente intimista com jardim externo.',
    averageWaitTime: 30,
    reservationsEnabled: true,
  }),
  mkRestaurante('r5', 'Boteco do Zé', 'comida caseira', 'Rua dos Pinheiros', '300', 'Pinheiros', 'São Paulo', 'SP', '05422-001', undefined, {
    telefone: '(11) 3333-5555',
    imagem_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop',
    horario_funcionamento: '17:00 - 02:00',
    fila_ativa: true,
    tamanho_fila_atual: 3,
    rating: 4.4,
    priceRange: 2,
    description: 'Petiscos de boteco, chope gelado e música ao vivo em alguns dias da semana.',
    averageWaitTime: 15,
    reservationsEnabled: false,
  }),
  mkRestaurante('r6', 'Empório Vegano', 'vegetariano', 'Rua Oscar Freire', '200', 'Jardins', 'São Paulo', 'SP', '01426-001', undefined, {
    telefone: '(11) 3333-6666',
    imagem_url: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop',
    horario_funcionamento: '11:00 - 21:00',
    fila_ativa: false,
    tamanho_fila_atual: 0,
    rating: 4.5,
    priceRange: 3,
    description: 'Opções veganas criativas, pratos do dia e sobremesas sem ingredientes de origem animal.',
    averageWaitTime: 10,
    reservationsEnabled: true,
  }),
];

export const mockTables: Table[] = [
  { id: 't1', restaurantId: 'r1', number: 1, capacity: 2, status: 'available' },
  { id: 't2', restaurantId: 'r1', number: 2, capacity: 2, status: 'occupied' },
  { id: 't3', restaurantId: 'r1', number: 3, capacity: 4, status: 'available' },
  { id: 't4', restaurantId: 'r1', number: 4, capacity: 4, status: 'reserved' },
  { id: 't5', restaurantId: 'r1', number: 5, capacity: 6, status: 'available' },
  { id: 't6', restaurantId: 'r1', number: 6, capacity: 6, status: 'occupied' },
  { id: 't7', restaurantId: 'r1', number: 7, capacity: 8, status: 'available' },
  { id: 't8', restaurantId: 'r1', number: 8, capacity: 8, status: 'inactive' },
];

export const mockTimeSlots: TimeSlot[] = [
  { id: 'ts1', time: '12:00', available: true },
  { id: 'ts2', time: '12:30', available: true },
  { id: 'ts3', time: '13:00', available: false },
  { id: 'ts4', time: '13:30', available: true },
  { id: 'ts5', time: '19:00', available: true },
  { id: 'ts6', time: '19:30', available: true },
  { id: 'ts7', time: '20:00', available: false },
  { id: 'ts8', time: '20:30', available: true },
  { id: 'ts9', time: '21:00', available: true },
  { id: 'ts10', time: '21:30', available: false },
];

export const mockStaff: StaffMember[] = [
  { id: 's1', restaurantId: 'r1', name: 'Carlos Garçom', role: 'Garçom', schedule: 'Seg-Sex 12:00-20:00', active: true },
  { id: 's2', restaurantId: 'r1', name: 'Ana Hostess', role: 'Hostess', schedule: 'Seg-Sáb 11:00-19:00', active: true },
  { id: 's3', restaurantId: 'r1', name: 'Pedro Chef', role: 'Chef', schedule: 'Seg-Sáb 10:00-22:00', active: true },
  { id: 's4', restaurantId: 'r1', name: 'Lucas Auxiliar', role: 'Auxiliar', schedule: 'Ter-Dom 14:00-22:00', active: false },
];

export const mockSettings: RestaurantSettings = {
  id: 'settings-1',
  restaurantId: 'r1',
  name: 'Trattoria Bella Notte',
  address: 'Rua Augusta, 1200',
  city: 'São Paulo',
  phone: '(11) 3333-1111',
  capacity: 80,
  toleranceMinutes: 15,
  cancellationPolicyMinutes: 60,
  autoConfirmReservations: false,
  maxPartySize: 10,
  openingTime: '12:00',
  closingTime: '23:00',
};
