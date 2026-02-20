import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, CalendarDays, Grid3X3, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<{ queueSize: number; reservationsToday: number; tablesAvailable: number; totalTables: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({ queueSize: 4, reservationsToday: 4, tablesAvailable: 4, totalTables: 8 });
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const cards = stats ? [
    { label: 'Fila agora', value: stats.queueSize, icon: Users, color: 'text-primary' },
    { label: 'Reservas hoje', value: stats.reservationsToday, icon: CalendarDays, color: 'text-gold-accent' },
    { label: 'Mesas livres', value: `${stats.tablesAvailable}/${stats.totalTables}`, icon: Grid3X3, color: 'text-accent' },
    { label: 'Taxa de ocupação', value: `${Math.round(((stats.totalTables - stats.tablesAvailable) / stats.totalTables) * 100)}%`, icon: TrendingUp, color: 'text-primary' },
  ] : [];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <div key={i} className="rounded-xl bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{c.label}</span>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">{c.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
