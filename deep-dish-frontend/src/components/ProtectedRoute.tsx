import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  children: React.ReactElement;
  tipo_usuario: 'cliente' | 'restaurante' | '';
}

const ProtectedRoute: React.FC<Props> = ({ children, tipo_usuario }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={tipo_usuario === '' ? '/cliente/login' : '/login'} replace />;
  }
  if (user?.tipo_usuario !== tipo_usuario) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
