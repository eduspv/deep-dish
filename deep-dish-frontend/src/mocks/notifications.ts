import { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'user-1',
    title: 'Mesa pronta!',
    message: 'Sua mesa na Trattoria Bella Notte está pronta. Dirija-se ao restaurante.',
    type: 'queue',
    read: false,
    createdAt: '2026-02-20T19:00:00Z',
  },
  {
    id: 'n2',
    userId: 'user-1',
    title: 'Reserva confirmada',
    message: 'Sua reserva no Sakura Sushi House para 22/02 às 19:30 foi confirmada.',
    type: 'reservation',
    read: true,
    createdAt: '2026-02-20T08:30:00Z',
  },
];
