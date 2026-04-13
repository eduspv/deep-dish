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
    { label: 'Fila agora', value: stats.queueSize, icon: Users, color: 'text-primary', bg: 'bg-primary/8' },
    { label: 'Reservas hoje', value: stats.reservationsToday, icon: CalendarDays, color: 'text-gold-accent', bg: 'bg-gold-accent/10' },
    { label: 'Mesas livres', value: `${stats.tablesAvailable}/${stats.totalTables}`, icon: Grid3X3, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/8' },
    { label: 'Taxa de ocupação', value: `${Math.round(((stats.totalTables - stats.tablesAvailable) / stats.totalTables) * 100)}%`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/8' },
  ] : [];

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-stagger">
          {cards.map((c, i) => (
            <div key={i} className="rounded-2xl bg-card p-5 shadow-card transition-all duration-200 hover:shadow-card-hover">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{c.label}</span>
                <div className={`h-9 w-9 rounded-lg ${c.bg} flex items-center justify-center`}>
                  <c.icon className={`h-[18px] w-[18px] ${c.color}`} />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-foreground font-display animate-count-up">
                {c.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
