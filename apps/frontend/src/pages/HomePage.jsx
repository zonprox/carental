import { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Car, MapPin, Users, Fuel } from 'lucide-react'

export default function HomePage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  const fetchCars = useCallback(async () => {
    try {
      const response = await fetch('/api/cars')
      if (response.ok) {
        const data = await response.json()
        setCars(data)
      } else {
        console.error('Failed to fetch cars:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Đang tải danh sách xe...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CarRental</h1>
            </div>
            <Button variant="outline" asChild>
              <a href="/login">Quản trị</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Thuê xe tự lái dễ dàng
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá bộ sưu tập xe đa dạng của chúng tôi với giá cả hợp lý và dịch vụ tốt nhất
          </p>
        </div>

        {/* Cars Grid */}
        {cars.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có xe nào
            </h3>
            <p className="text-gray-500">
              Hiện tại chưa có xe nào có sẵn. Vui lòng quay lại sau.
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
                  <CardTitle className="text-xl">{car.name}</CardTitle>
                  <CardDescription>{car.brand} - {car.year}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {car.seats} chỗ ngồi
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Fuel className="h-4 w-4 mr-2" />
                      {car.fuel_type}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {car.location || 'Hà Nội'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        {car.price_per_day?.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="text-sm text-gray-500">/ngày</span>
                    </div>
                    <Button>
                      Thuê ngay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 CarRental. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}