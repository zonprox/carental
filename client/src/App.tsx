import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import HomePage from '@/pages/HomePage';
import CarsPage from '@/pages/CarsPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import SetupPage from '@/pages/SetupPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminCarsPage from '@/pages/AdminCarsPage';
import AdminSettingsPage from '@/pages/AdminSettingsPage';
import AdminUsersPage from '@/pages/AdminUsersPage';
import AdminBookingsPage from '@/pages/AdminBookingsPage';
import CarDetailPage from '@/pages/CarDetailPage';
import ProfilePage from '@/pages/ProfilePage';
import MyBookingsPage from '@/pages/MyBookingsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { AuthGuard } from '@/components/AuthGuard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { api } from '@/lib/api';

function SetupGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    api.health()
      .then((data) => {
        setNeedsSetup(!data.configured);
      })
      .catch(() => {
        setNeedsSetup(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (needsSetup && location.pathname !== '/setup') {
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <SetupGuard>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/cars/:id" element={<CarDetailPage />} />
          
          {/* Auth routes - redirect if already logged in */}
          <Route path="/auth/login" element={<AuthGuard><LoginPage /></AuthGuard>} />
          <Route path="/auth/register" element={<AuthGuard><RegisterPage /></AuthGuard>} />
          
          {/* Protected user routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected admin routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/cars" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminCarsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminUsersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminBookingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings/:section"
            element={
              <ProtectedRoute requireAdmin>
                <AdminSettingsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Setup route */}
          <Route path="/setup" element={<SetupPage />} />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </SetupGuard>
      <Toaster />
      <Sonner />
    </>
  );
}
