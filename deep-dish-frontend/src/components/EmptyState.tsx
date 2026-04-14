import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<Props> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/80 text-muted-foreground">
      {icon || <Search className="h-7 w-7" />}
    </div>
    <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-2 max-w-xs text-sm text-muted-foreground leading-relaxed">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
