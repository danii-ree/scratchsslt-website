import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

export const RootRedirect = () => {
  const { user, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading...</div>;
  }

  // If user is authenticated, redirect to home
  if (user) {
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, show the Auth page
  return <Navigate to="/auth" replace />;
};
