import { cn } from '@/lib/utils';

type StatusType = 'waiting' | 'called' | 'seated' | 'cancelled' | 'no_show' | 'pending' | 'confirmed' | 'completed' | 'available' | 'occupied' | 'reserved' | 'inactive';

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  waiting: { label: 'Aguardando', className: 'bg-secondary text-secondary-foreground border-border' },
  called: { label: 'Chamado', className: 'bg-primary/10 text-primary border-primary/30' },
  seated: { label: 'Sentado', className: 'bg-accent text-accent-foreground' },
  cancelled: { label: 'Cancelado', className: 'bg-muted text-muted-foreground line-through' },
  no_show: { label: 'Não compareceu', className: 'bg-muted text-muted-foreground' },
  pending: { label: 'Pendente', className: 'bg-secondary text-secondary-foreground border-border' },
  confirmed: { label: 'Confirmado', className: 'bg-accent text-accent-foreground' },
  completed: { label: 'Concluído', className: 'bg-muted text-muted-foreground' },
  available: { label: 'Disponível', className: 'bg-accent text-accent-foreground' },
  occupied: { label: 'Ocupada', className: 'bg-primary/10 text-primary border-primary/30' },
  reserved: { label: 'Reservada', className: 'bg-secondary text-secondary-foreground border-border' },
  inactive: { label: 'Inativa', className: 'bg-muted text-muted-foreground' },
};

const StatusBadge = ({ status }: { status: StatusType }) => {
  const config = statusConfig[status] || { label: status, className: '' };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border', config.className)}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
