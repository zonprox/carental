import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Car, Plus, Edit, Trash2, LogOut, Save, X } from 'lucide-react'

export default function AdminDashboard() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingCar, setEditingCar] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    year: '',
    seats: '',
    fuel_type: '',
    price_per_day: '',
    image_url: '',
    location: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchCars()
  }, [navigate])

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCars(data)
      }
    } catch (error) {
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddCar = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          year: parseInt(formData.year),
          seats: parseInt(formData.seats),
          price_per_day: parseFloat(formData.price_per_day)
        })
      })

      if (response.ok) {
        fetchCars()
        setShowAddForm(false)
        setFormData({
          name: '',
          brand: '',
          year: '',
          seats: '',
          fuel_type: '',
          price_per_day: '',
          image_url: '',
          location: ''
        })
      }
    } catch (error) {
      console.error('Error adding car:', error)
    }
  }

  const handleEditCar = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/cars/${editingCar.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          year: parseInt(formData.year),
          seats: parseInt(formData.seats),
          price_per_day: parseFloat(formData.price_per_day)
        })
      })

      if (response.ok) {
        fetchCars()
        setEditingCar(null)
        setFormData({
          name: '',
          brand: '',
          year: '',
          seats: '',
          fuel_type: '',
          price_per_day: '',
          image_url: '',
          location: ''
        })
      }
    } catch (error) {
      console.error('Error updating car:', error)
    }
  }

  const handleDeleteCar = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa xe này?')) return

    try {
      const response = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        fetchCars()
      }
    } catch (error) {
      console.error('Error deleting car:', error)
    }
  }

  const startEdit = (car) => {
    setEditingCar(car)
    setFormData({
      name: car.name,
      brand: car.brand,
      year: car.year.toString(),
      seats: car.seats.toString(),
      fuel_type: car.fuel_type,
      price_per_day: car.price_per_day.toString(),
      image_url: car.image_url || '',
      location: car.location || ''
    })
  }

  const cancelEdit = () => {
    setEditingCar(null)
    setShowAddForm(false)
    setFormData({
      name: '',
      brand: '',
      year: '',
      seats: '',
      fuel_type: '',
      price_per_day: '',
      image_url: '',
      location: ''
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Quản trị CarRental</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <a href="/">Xem trang chủ</a>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Car Button */}
        <div className="mb-6">
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm || editingCar}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm xe mới
          </Button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingCar) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingCar ? 'Chỉnh sửa xe' : 'Thêm xe mới'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingCar ? handleEditCar : handleAddCar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên xe</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="VD: Toyota Camry"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hãng xe</label>
                  <Input
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="VD: Toyota"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Năm sản xuất</label>
                  <Input
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="VD: 2023"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số chỗ ngồi</label>
                  <Input
                    name="seats"
                    type="number"
                    value={formData.seats}
                    onChange={handleInputChange}
                    placeholder="VD: 5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Loại nhiên liệu</label>
                  <Input
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleInputChange}
                    placeholder="VD: Xăng"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giá thuê/ngày (VNĐ)</label>
                  <Input
                    name="price_per_day"
                    type="number"
                    value={formData.price_per_day}
                    onChange={handleInputChange}
                    placeholder="VD: 800000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL hình ảnh</label>
                  <Input
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/car.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Địa điểm</label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="VD: Hà Nội"
                  />
                </div>
                <div className="md:col-span-2 flex space-x-2">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingCar ? 'Cập nhật' : 'Thêm xe'}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Cars List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id}>
              <div className="aspect-video bg-gray-200 relative">
                {car.image_url ? (
                  <img
                    src={car.image_url}
                    alt={car.name}
                    className="w-full h-full object-cover rounded-t-lg"
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
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>{car.seats} chỗ ngồi • {car.fuel_type}</p>
                  <p>{car.location || 'Hà Nội'}</p>
                  <p className="font-semibold text-blue-600">
                    {car.price_per_day?.toLocaleString('vi-VN')}đ/ngày
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(car)}
                    disabled={editingCar || showAddForm}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteCar(car.id)}
                    disabled={editingCar || showAddForm}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cars.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có xe nào
            </h3>
            <p className="text-gray-500">
              Bắt đầu bằng cách thêm xe đầu tiên vào hệ thống.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}