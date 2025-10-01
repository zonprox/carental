import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/ui/stat-card'
import { CarCard } from '@/components/ui/car-card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EmptyState } from '@/components/ui/empty-state'
import { ThemeToggle } from '@/components/ThemeToggle'
import UserNavMenu from '@/components/UserNavMenu'
import { Car, Users, Calendar, CreditCard } from 'lucide-react'
import { t } from '@/locales'

export default function UserDashboard() {
  const [user, setUser] = useState(null)
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      navigate('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    
    // Check if user is actually admin trying to access user dashboard
    if (parsedUser.role === 'admin') {
      navigate('/admin/dashboard')
      return
    }
    
    setUser(parsedUser)
    fetchCars()
  }, [navigate])

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars')
      if (response.ok) {
        const data = await response.json()
        setCars(data.slice(0, 6)) // Show first 6 cars
      }
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Đang tải dashboard..." icon={Car} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
              <UserNavMenu user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {t('dashboard.title')}
          </h2>
          <p className="text-muted-foreground">
            Chào mừng bạn đến với hệ thống thuê xe CarRental
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Xe khả dụng"
            value={cars.length}
            label="xe sẵn sàng cho thuê"
            icon={Car}
          />
          <StatCard
            title="Đặt xe của tôi"
            value={0}
            label="đơn đặt xe hiện tại"
            icon={Calendar}
          />
          <StatCard
            title="Tổng chi tiêu"
            value="0đ"
            label="trong tháng này"
            icon={CreditCard}
          />
          <StatCard
            title="Điểm thành viên"
            value={100}
            label="điểm tích lũy"
            icon={Users}
          />
        </div>

        {/* Available Cars */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Xe khả dụng</CardTitle>
            <CardDescription className="text-muted-foreground">
              Danh sách xe có thể thuê ngay
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cars.length === 0 ? (
              <EmptyState
                icon={Car}
                title={t('home.empty')}
                description={t('home.emptyDesc')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard 
                    key={car.id} 
                    car={car}
                    onRent={(car) => console.log('Rent car:', car)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

