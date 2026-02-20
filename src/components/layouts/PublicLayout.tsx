import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '@/components/PublicNavbar';

const PublicLayout: React.FC = () => (
  <div className="min-h-screen bg-background">
    <PublicNavbar />
    <main>
      <Outlet />
    </main>
  </div>
);

export default PublicLayout;
