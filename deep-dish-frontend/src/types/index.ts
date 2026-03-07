//TODO CONSERTAR AS INTERFACES PARA ENTRAREM NO PADRÃO DO SITE

export interface Cliente {
  id: string;
  name: string;
  email: string;
  cpf: string;
}

export interface Restaurante {
  id: string;
  name: string;
  tipo: string;
  email: string;
  cnpj: string;
  logradouro: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  endereco_completo?: string;
  telefone: string;
  imagem_url: string;
  horario_funcionamento: string;
  fila_ativa: boolean;
  tamanho_fila_atual: number;
  // Campos extras usados na UI / mocks
  rating?: number;
  priceRange?: number;
  description?: string;
  averageWaitTime?: number;
  reservationsEnabled?: boolean;
}

export type User = Cliente | Restaurante;

export interface AuthSession {
  token: string;          
  restaurant: Restaurante; 
}

export interface Table {
  id: string;
  restaurantId: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'inactive';
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface Reservation {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  time: string;
  partySize: number;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';
  tableNumber?: number;
  createdAt: string;
  notes?: string;
}

export interface QueueEntry {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  restaurantId: string;
  restaurantName: string;
  partySize: number;
  position: number;
  estimatedWaitMinutes: number;
  status: 'waiting' | 'called' | 'seated' | 'cancelled' | 'no_show';
  joinedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'queue' | 'reservation' | 'system';
  read: boolean;
  createdAt: string;
}

export interface RestaurantSettings {
  id: string;
  restaurantId: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  capacity: number;
  toleranceMinutes: number;
  cancellationPolicyMinutes: number;
  autoConfirmReservations: boolean;
  maxPartySize: number;
  openingTime: string;
  closingTime: string;
}

export interface StaffMember {
  id: string;
  restaurantId: string;
  name: string;
  role: string;
  schedule: string;
  active: boolean;
}
