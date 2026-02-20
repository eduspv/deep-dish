import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Settings, Grid3X3, Users, CalendarDays, UserCog, LogOut } from 'lucide-react';

const sideLinks = [
  { to: '/restaurant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/restaurant/queue', label: 'Fila', icon: Users },
  { to: '/restaurant/reservations', label: 'Reservas', icon: CalendarDays },
  { to: '/restaurant/tables', label: 'Mesas', icon: Grid3X3 },
  { to: '/restaurant/staff', label: 'Equipe', icon: UserCog },
  { to: '/restaurant/settings', label: 'Configurações', icon: Settings },
];

const AdminNavbar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 z-40 hidden w-60 flex-col bg-dark-surface text-dark-surface-foreground md:flex">
        <div className="flex h-16 items-center gap-2 px-5 border-b border-warm-brown/30">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">D</span>
          </div>
          <span className="font-display text-lg font-bold">Deep Dish</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sideLinks.map(l => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-dark-surface-foreground/70 hover:bg-warm-brown/20 hover:text-dark-surface-foreground'}`}
              >
                <l.icon className="h-5 w-5" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-warm-brown/30 p-3">
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-dark-surface-foreground/70 hover:bg-warm-brown/20 transition-colors">
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile top bar + bottom nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-surface text-dark-surface-foreground md:hidden border-b border-warm-brown/30">
        <div className="flex h-14 items-center justify-between px-4">
          <span className="font-display text-lg font-bold">Deep Dish</span>
          <button onClick={logout} className="p-2 text-dark-surface-foreground/70 hover:text-primary"><LogOut className="h-5 w-5" /></button>
        </div>
      </header>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-surface text-dark-surface-foreground md:hidden border-t border-warm-brown/30">
        <div className="flex items-center justify-around py-2">
          {sideLinks.slice(0, 5).map(l => {
            const active = location.pathname === l.to;
            return (
              <Link key={l.to} to={l.to} className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors ${active ? 'text-primary' : 'text-dark-surface-foreground/60'}`}>
                <l.icon className="h-5 w-5" />
                <span className="truncate">{l.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;
