import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="text-center space-y-4">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
        <Utensils className="h-10 w-10 text-primary" />
      </div>
      <h1 className="font-display text-6xl font-bold text-foreground">404</h1>
      <p className="text-lg text-muted-foreground">Essa página não está no cardápio.</p>
      <Link to="/"><Button>Voltar ao início</Button></Link>
    </div>
  </div>
);

export default NotFound;
