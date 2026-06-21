import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context';
import { ROUTES } from '../utils/constants';
import { MainLayout } from './MainLayout';

export function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
