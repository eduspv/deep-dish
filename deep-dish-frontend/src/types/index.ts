export interface Cliente {
  id: string;
  name: string;
  email: string;
  cpf: string;
  tipo_usuario: 'cliente' | 'restaurante' | '';
  avatarUrl?: string;
}
//TODO CONSERTAR AS INTERFACES PARA ENTRAREM NO PADRÃO DO SITE
export interface Restaurant {
  id: string;
  name: string;
  tipo: string;
  endereco: string;
  cidade: string;
  telefone: string;
  imagem_url: string;
  horario_aberto: string;
  fila_atividade: boolean;
  reservas_habilitadas: boolean;
  tamanho_fila_atual: number;
}

export interface AuthSession {
  token: string;          // JWT do backend
  restaurant: Restaurant; // dados do restaurante
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
