import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { LoadingPage } from "@/components/ui/loading-spinner";
import {
  ChartPlaceholder,
  FeaturePlaceholder,
} from "@/components/ui/chart-placeholder";
import {
  Car,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Download,
  UserCheck,
  BarChart3,
  Calendar,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { t } from "@/locales";

const USE_MOCK_UI = false;

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    carsWithDriver: 0,
    totalUsers: 0,
    totalBookings: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [carsRes] = await Promise.all([
        fetch("/api/cars", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);

      const cars = carsRes.ok ? await carsRes.json() : [];

      // Calculate revenue from cars
      const totalRevenue = cars.reduce(
        (sum, car) => sum + (car.price_per_day || 0),
        0,
      );

      setStats({
        totalCars: cars.length,
        availableCars: cars.length, // All cars available for now
        carsWithDriver: USE_MOCK_UI ? Math.floor(cars.length * 0.4) : 0,
        totalUsers: USE_MOCK_UI ? 1 : 0,
        totalBookings: 0,
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
  };

  const handleExport = () => {
    // Placeholder for export functionality
    console.log("Export data...");
  };

  const statCards = [
    {
      title: t("dashboard.stats.totalVehicles.title"),
      label: t("dashboard.stats.totalVehicles.label"),
      value: stats.totalCars,
      delta: stats.totalCars > 0 ? "+12%" : "0%",
      deltaType: "increase",
      icon: Car,
    },
    {
      title: t("dashboard.stats.available.title"),
      label: t("dashboard.stats.available.label"),
      value: stats.availableCars,
      delta: stats.availableCars > 0 ? "+8%" : "0%",
      deltaType: "increase",
      icon: Car,
    },
    {
      title: t("dashboard.stats.withDriver.title"),
      label: t("dashboard.stats.withDriver.label"),
      value: stats.carsWithDriver,
      delta: "0%",
      deltaType: "neutral",
      icon: UserCheck,
    },
    {
      title: t("dashboard.stats.bookings.title"),
      label: t("dashboard.stats.bookings.label"),
      value: stats.totalBookings,
      delta: "0%",
      deltaType: "neutral",
      icon: TrendingUp,
    },
    {
      title: t("dashboard.stats.totalValue.title"),
      label: t("dashboard.stats.totalValue.label"),
      value: `${stats.revenue.toLocaleString("vi-VN")}đ`,
      delta: stats.revenue > 0 ? "+5%" : "0%",
      deltaType: "increase",
      icon: DollarSign,
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <LoadingPage text={t("dashboard.loading")} icon={RefreshCw} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageContainer>
        <PageHeader
          title={t("dashboard.title")}
          description={t("dashboard.subtitle")}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t("common.refresh")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            {t("common.export")}
          </Button>
        </PageHeader>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {statCards.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              label={stat.label}
              delta={`${stat.delta} ${t("dashboard.stats.deltaText")}`}
              deltaType={stat.deltaType}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <ChartPlaceholder
            className="col-span-4"
            type="line"
            title={t("dashboard.charts.overview.title")}
            description={t("dashboard.charts.overview.description")}
          />

          <ChartPlaceholder
            className="col-span-3"
            type="activity"
            title={t("dashboard.charts.activity.title")}
            description={t("dashboard.charts.activity.description")}
          />
        </div>

        {/* Features Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FeaturePlaceholder
            icon={BarChart3}
            title={t("dashboard.charts.popular.title")}
            description={t("dashboard.charts.popular.emptyDesc")}
          />

          <FeaturePlaceholder
            icon={TrendingUp}
            title={t("dashboard.charts.revenue.title")}
            description={t("dashboard.charts.revenue.emptyDesc")}
          />

          <FeaturePlaceholder
            icon={Calendar}
            title={t("dashboard.charts.bookings.title")}
            description={t("dashboard.charts.bookings.emptyDesc")}
          />
        </div>
      </PageContainer>
    </AdminLayout>
  );
}
