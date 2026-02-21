import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<Props> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground">
      {icon || <Search className="h-7 w-7" />}
    </div>
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
