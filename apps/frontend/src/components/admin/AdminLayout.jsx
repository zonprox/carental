import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { authAPI } from "@/lib/api";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!userStr) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      try {
        const user = JSON.parse(userStr);

        // Check if user has admin role
        if (user.role !== "admin") {
          // Redirect non-admin users to their appropriate dashboard
          if (user.role === "user") {
            navigate("/user/dashboard");
          } else {
            navigate("/login");
          }
          return;
        }

        // Verify token with backend
        try {
          await authAPI.verify();
          setIsValidating(false);
        } catch (verifyError) {
          console.warn("Token verification failed:", verifyError.message);
          // Token is invalid, clear auth data and redirect
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
      } catch (error) {
        // If parsing fails, clear invalid data and redirect
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
    };

    validateAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Show loading while validating token
  if (isValidating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onLogout={handleLogout} />
      <div className="lg:pl-64">
        <main className="min-h-screen bg-background">{children}</main>
      </div>
    </div>
  );
}
