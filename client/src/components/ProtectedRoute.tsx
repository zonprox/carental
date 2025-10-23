import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from '@/lib/api';
import type { User } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute: Protects routes that require authentication
 * Redirects unauthenticated users to login page
 * Optionally checks for admin role
 */
export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    // Check authentication status
    api.auth.me()
      .then((data) => {
        if (!mounted) return;
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        // Not authenticated
        if (!mounted) return;
        setUser(null);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Authenticated and authorized
  return <>{children}</>;
}
