import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  children: React.ReactElement;
  role: 'USER' | 'RESTAURANT';
}

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={role === 'RESTAURANT' ? '/restaurant/login' : '/login'} replace />;
  }
  if (user?.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
