import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Search, CalendarDays, Users, LogOut } from 'lucide-react';

const links = [
  { to: '/app', label: 'Início', icon: Home },
  { to: '/app/search', label: 'Buscar', icon: Search },
  { to: '/app/restaurants', label: 'Restaurantes', icon: Users },
  { to: '/app/queue', label: 'Fila', icon: CalendarDays },
];

const AppNavbar: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/app" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">D</span>
            </div>
            <span className="font-display text-lg font-bold text-foreground">Deep Dish</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">Olá, {user?.name?.split(' ')[0]}</span>
            <button onClick={logout} className="p-2 text-muted-foreground hover:text-primary transition-colors" title="Sair">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border md:hidden">
        <div className="flex items-center justify-around py-2">
          {links.map(l => {
            const active = location.pathname === l.to;
            return (
              <Link key={l.to} to={l.to} className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                <l.icon className="h-5 w-5" />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default AppNavbar;
