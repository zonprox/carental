import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/lib/api';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard: Prevents authenticated users from accessing login/register pages
 * Redirects logged-in users to appropriate page based on their role
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    // Check authentication status
    api.auth.me()
      .then((data) => {
        if (!mounted) return;
        
        setIsAuthenticated(true);
        setLoading(false);
        
        // Redirect authenticated users away from auth pages
        if (data.user.isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      })
      .catch(() => {
        // Not authenticated - this is expected and normal for login/register pages
        // Don't show error to user, just allow them to access the auth page
        if (!mounted) return;
        setIsAuthenticated(false);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [navigate, location.pathname]);

  // Show loading spinner while checking auth status
  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra...</p>
        </div>
      </div>
    );
  }

  // Not authenticated, show the auth page (login/register)
  return <>{children}</>;
}
