import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  variant?: 'light' | 'dark' | 'auto';
}

const ThemeToggle = ({ variant = 'auto' }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-9 w-9" />;

  const isDark = theme === 'dark';
  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  const colorClass =
    variant === 'light'
      ? 'text-dark-surface-foreground/70 hover:text-dark-surface-foreground'
      : variant === 'dark'
        ? 'text-muted-foreground hover:text-foreground'
        : 'text-muted-foreground hover:text-foreground';

  return (
    <button
      onClick={toggle}
      className={`relative h-9 w-9 rounded-lg flex items-center justify-center transition-colors duration-200 ${colorClass}`}
      title={isDark ? 'Modo claro' : 'Modo escuro'}
    >
      <Sun
        className={`h-[18px] w-[18px] transition-all duration-300 ease-out-expo ${
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        } absolute`}
      />
      <Moon
        className={`h-[18px] w-[18px] transition-all duration-300 ease-out-expo ${
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        } absolute`}
      />
    </button>
  );
};

export default ThemeToggle;
