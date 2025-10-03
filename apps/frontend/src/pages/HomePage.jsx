import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/ui/car-card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ThemeToggle } from "@/components/ThemeToggle";
import UserNavMenu from "@/components/UserNavMenu";
import { Car } from "lucide-react";
import { t } from "@/locales";

export default function HomePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const fetchCars = useCallback(async () => {
    try {
      const response = await fetch("/api/cars");
      if (response.ok) {
        const data = await response.json();
        setCars(data);
      } else {
        console.error(
          "Failed to fetch cars:",
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCars();

    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [fetchCars]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Đang tải danh sách xe..." icon={Car} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-background dark:to-background">
      {/* Header */}
      <header className="bg-card shadow-sm sticky top-0 z-50 border-b backdrop-blur-sm bg-card/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">CarRental</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {user ? (
                <UserNavMenu user={user} />
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <a href="/login">{t("home.login")}</a>
                  </Button>
                  <Button asChild>
                    <a href="/register">Đăng ký</a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t("home.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("home.subtitle")}
          </p>
        </div>

        {/* Cars Grid */}
        {cars.length === 0 ? (
          <EmptyState
            icon={Car}
            title={t("home.empty")}
            description={t("home.emptyDesc")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onRent={(_car) => (window.location.href = "/login")}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} CarRental. {t("home.footer")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
