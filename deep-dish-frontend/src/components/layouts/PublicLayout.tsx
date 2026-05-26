import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PublicNavbar from '@/components/PublicNavbar';

const AUTH_PATHS = [
  '/login',
  '/register',
  '/restaurant/login',
  '/restaurant/register',
  '/forgot-password',
  '/restaurant/forgot-password',
  '/reset-password',
  '/verify-email',
];

const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.includes(pathname);

  return (
    <div className="min-h-screen bg-background">
      {!isAuthPage && <PublicNavbar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
