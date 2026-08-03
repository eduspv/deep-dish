import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import logo from '@/assets/logo/logo-sem-fundo.png';

const PublicNavbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navBg = isLanding
    ? scrolled
      ? 'bg-dark-surface/95 backdrop-blur-xl shadow-sm'
      : 'bg-transparent'
    : 'bg-card/80 backdrop-blur-xl border-b border-border/60';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-xl bg-white/95 p-1.5 flex items-center justify-center shadow-sm transition-transform duration-200 ease-out-expo group-hover:scale-105">
            <img src={logo} alt="Logo Deep Dish" className="max-h-full max-w-full object-contain" />
          </div>
          <span className={`font-display text-xl font-bold transition-colors ${isLanding ? 'text-dark-surface-foreground' : 'text-foreground'}`}>
            Deep Dish
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle variant={isLanding ? 'light' : 'dark'} />
          {isAuthenticated ? (
            <Link to={user?.role === 'RESTAURANT' ? '/restaurant/dashboard' : '/app'}>
              <Button size="sm">Painel</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className={isLanding ? 'text-dark-surface-foreground/80 hover:text-white hover:bg-white/10' : ''}
                >
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Criar conta</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle variant={isLanding ? 'light' : 'dark'} />
          <button
            className="h-9 w-9 flex items-center justify-center rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className={`h-5 w-5 ${isLanding ? 'text-dark-surface-foreground' : 'text-foreground'}`} />
            ) : (
              <Menu className={`h-5 w-5 ${isLanding ? 'text-dark-surface-foreground' : 'text-foreground'}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out-expo ${
          menuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`px-4 py-4 space-y-2 border-t ${isLanding ? 'bg-dark-surface/95 backdrop-blur-xl border-white/[0.06]' : 'bg-card/95 backdrop-blur-xl border-border/60'}`}>
          {isAuthenticated ? (
            <Link to={user?.role === 'RESTAURANT' ? '/restaurant/dashboard' : '/app'} onClick={() => setMenuOpen(false)}>
              <Button className="w-full" size="sm">Painel</Button>
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full" size="sm">Entrar</Button>
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <Button className="w-full" size="sm">Criar conta</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
