import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/logo/logo-sem-fundo.png'; // importe a logo no topo do arquivo

const PublicNavbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLanding = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors ${isLanding ? 'bg-dark-surface/90 backdrop-blur-md' : 'bg-card/95 backdrop-blur-md border-b border-border'}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-12 w-12 rounded-xl bg-white p-2 flex items-center justify-center shadow-md">
            <img
              src={logo}
              alt="Logo Deep Dish"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <span className={`font-display text-xl font-bold ${isLanding ? 'text-dark-surface-foreground' : 'text-foreground'}`}>
            Deep Dish
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Link to={user?.role === 'RESTAURANT' ? '/restaurant/dashboard' : '/app'}>
              <Button size="sm">Painel</Button>
            </Link>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm" className={isLanding ? 'text-dark-surface-foreground hover:text-primary' : ''}>Entrar</Button></Link>
              <Link to="/register"><Button size="sm">Criar conta</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className={`h-5 w-5 ${isLanding ? 'text-dark-surface-foreground' : 'text-foreground'}`} /> : <Menu className={`h-5 w-5 ${isLanding ? 'text-dark-surface-foreground' : 'text-foreground'}`} />}
        </button>
      </div>

      {menuOpen && (
        <div className={`md:hidden border-t px-4 py-4 space-y-2 ${isLanding ? 'bg-dark-surface border-warm-brown' : 'bg-card border-border'}`}>
          {isAuthenticated ? (
            <Link to={user?.role === 'RESTAURANT' ? '/restaurant/dashboard' : '/app'} onClick={() => setMenuOpen(false)}>
              <Button className="w-full" size="sm">Painel</Button>
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}><Button variant="ghost" className="w-full" size="sm">Entrar</Button></Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}><Button className="w-full" size="sm">Criar conta</Button></Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
