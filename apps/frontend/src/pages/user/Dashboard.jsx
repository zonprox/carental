import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Car, Users, Calendar, CreditCard, LogOut } from 'lucide-react'
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
      <div className="min-h-screen flex items-center justify-center">
        <Car className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CarRental</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Xin chào, <span className="font-medium">{user?.name}</span>
              </span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('userMenu.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.title')}
          </h2>
          <p className="text-gray-600">
            Chào mừng bạn đến với hệ thống thuê xe CarRental
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Xe khả dụng
              </CardTitle>
              <Car className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cars.length}</div>
              <p className="text-xs text-gray-500">xe sẵn sàng cho thuê</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Đặt xe của tôi
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500">đơn đặt xe hiện tại</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tổng chi tiêu
              </CardTitle>
              <CreditCard className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0đ</div>
              <p className="text-xs text-gray-500">trong tháng này</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Điểm thành viên
              </CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100</div>
              <p className="text-xs text-gray-500">điểm tích lũy</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Cars */}
        <Card>
          <CardHeader>
            <CardTitle>Xe khả dụng</CardTitle>
            <CardDescription>
              Danh sách xe có thể thuê ngay
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cars.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('home.empty')}
                </h3>
                <p className="text-gray-500">
                  {t('home.emptyDesc')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-200 relative">
                      {car.image_url ? (
                        <img
                          src={car.image_url}
                          alt={car.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{car.name}</CardTitle>
                      <CardDescription>{car.brand} - {car.year}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {car.seats} {t('home.carDetails.seats')}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Car className="h-4 w-4 mr-2" />
                          {car.fuel_type}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-blue-600">
                            {car.price_per_day?.toLocaleString('vi-VN')}đ
                          </span>
                          <span className="text-sm text-gray-500">{t('home.carDetails.perDay')}</span>
                        </div>
                        <Button>
                          {t('home.rentNow')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

