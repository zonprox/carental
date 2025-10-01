import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Car, Users, DollarSign, TrendingUp, RefreshCw, Download, ArrowUpRight, UserCheck } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

const USE_MOCK_UI = false

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    carsWithDriver: 0,
    totalUsers: 0,
    totalBookings: 0,
    revenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [carsRes] = await Promise.all([
        fetch('/api/cars', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ])

      const cars = carsRes.ok ? await carsRes.json() : []
      
      // Calculate revenue from cars
      const totalRevenue = cars.reduce((sum, car) => sum + (car.price_per_day || 0), 0)

      setStats({
        totalCars: cars.length,
        availableCars: cars.length, // All cars available for now
        carsWithDriver: USE_MOCK_UI ? Math.floor(cars.length * 0.4) : 0,
        totalUsers: USE_MOCK_UI ? 1 : 0,
        totalBookings: 0,
        revenue: totalRevenue
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    fetchStats()
  }

  const handleExport = () => {
    // Placeholder for export functionality
    console.log('Export data...')
  }

  const statCards = [
    {
      title: 'Total Vehicles',
      label: 'Tổng số xe',
      value: stats.totalCars,
      delta: stats.totalCars > 0 ? '+12%' : '0%',
      deltaType: 'increase',
      icon: Car
    },
    {
      title: 'Available',
      label: 'Xe sẵn sàng',
      value: stats.availableCars,
      delta: stats.availableCars > 0 ? '+8%' : '0%',
      deltaType: 'increase',
      icon: Car
    },
    {
      title: 'With Driver',
      label: 'Có tài xế',
      value: stats.carsWithDriver,
      delta: '0%',
      deltaType: 'neutral',
      icon: UserCheck
    },
    {
      title: 'Bookings',
      label: 'Lượt thuê',
      value: stats.totalBookings,
      delta: '0%',
      deltaType: 'neutral',
      icon: TrendingUp
    },
    {
      title: 'Total Value',
      label: 'Tổng giá trị',
      value: `${stats.revenue.toLocaleString('vi-VN')}đ`,
      delta: stats.revenue > 0 ? '+5%' : '0%',
      deltaType: 'increase',
      icon: DollarSign
    }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-[450px] items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center gap-2 text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        {/* App Header */}
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Tổng quan hệ thống quản lý thuê xe
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                  {stat.delta !== '0%' && (
                    <div className={`flex items-center pt-1 text-xs ${
                      stat.deltaType === 'increase' ? 'text-green-600' : 
                      stat.deltaType === 'decrease' ? 'text-red-600' : 
                      'text-muted-foreground'
                    }`}>
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      {stat.delta} from last month
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Placeholder */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Biểu đồ tổng quan</CardTitle>
              <CardDescription>
                Thống kê hoạt động theo thời gian
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
                <div className="flex flex-col items-center gap-1 text-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Chart Placeholder</h3>
                  <p className="text-xs text-muted-foreground max-w-[200px]">
                    Biểu đồ sẽ được hiển thị tại đây
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>
                Các hoạt động mới nhất trong hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-sm font-medium">No Activity</h3>
                  <p className="text-xs text-muted-foreground max-w-[200px]">
                    Chưa có hoạt động nào được ghi nhận
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Xe phổ biến</CardTitle>
              <CardDescription>Top xe được thuê nhiều nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Car className="h-6 w-6 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Doanh thu</CardTitle>
              <CardDescription>Thống kê doanh thu tháng này</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
                <div className="flex flex-col items-center gap-1 text-center">
                  <DollarSign className="h-6 w-6 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Chưa có dữ liệu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Đánh giá</CardTitle>
              <CardDescription>Phản hồi từ khách hàng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Users className="h-6 w-6 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Chưa có đánh giá</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

