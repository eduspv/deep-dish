export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'RESTAURANT';
  avatarUrl?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  type: string;
  address: string;
  city: string;
  phone: string;
  imageUrl: string;
  rating: number;
  priceRange: 1 | 2 | 3 | 4;
  openingHours: string;
  queueActive: boolean;
  reservationsEnabled: boolean;
  averageWaitTime: number;
  currentQueueSize: number;
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
