import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="text-center space-y-5 animate-fade-in-up">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
        <Utensils className="h-9 w-9 text-primary" />
      </div>
      <h1 className="font-display text-7xl font-extrabold text-foreground tracking-tighter">404</h1>
      <p className="text-lg text-muted-foreground">Essa página não está no cardápio.</p>
      <Link to="/">
        <Button className="min-h-[44px]">Voltar ao início</Button>
      </Link>
    </div>
  </div>
);

export default NotFound;
