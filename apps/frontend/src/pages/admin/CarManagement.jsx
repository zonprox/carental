import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Save, X, Car as CarIcon } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function CarManagement() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingCar, setEditingCar] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
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

  useEffect(() => {
    fetchCars()
  }, [])

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const payload = {
      ...formData,
      year: parseInt(formData.year),
      seats: parseInt(formData.seats),
      price_per_day: parseFloat(formData.price_per_day)
    }

    try {
      const url = editingCar ? `/api/cars/${editingCar.id}` : '/api/cars'
      const method = editingCar ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        fetchCars()
        handleCloseDialog()
      }
    } catch (error) {
      console.error('Error saving car:', error)
    }
  }

  const handleDelete = async (id) => {
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

  const handleEdit = (car) => {
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
    setShowDialog(true)
  }

  const handleAdd = () => {
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
    setShowDialog(true)
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <CarIcon className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý xe</h1>
            <p className="text-gray-500 mt-1">Quản lý danh sách xe cho thuê</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm xe mới
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên xe</TableHead>
                  <TableHead>Hãng</TableHead>
                  <TableHead>Năm</TableHead>
                  <TableHead>Chỗ ngồi</TableHead>
                  <TableHead>Nhiên liệu</TableHead>
                  <TableHead>Địa điểm</TableHead>
                  <TableHead className="text-right">Giá/ngày</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                      Chưa có xe nào trong hệ thống
                    </TableCell>
                  </TableRow>
                ) : (
                  cars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell className="font-medium">{car.name}</TableCell>
                      <TableCell>{car.brand}</TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>{car.seats}</TableCell>
                      <TableCell>{car.fuel_type}</TableCell>
                      <TableCell>{car.location || 'Hà Nội'}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {car.price_per_day?.toLocaleString('vi-VN')}đ
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(car)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(car.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog for Add/Edit */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCar ? 'Chỉnh sửa xe' : 'Thêm xe mới'}
              </DialogTitle>
              <DialogDescription>
                {editingCar ? 'Cập nhật thông tin xe' : 'Điền thông tin xe mới'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tên xe *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="VD: Toyota Camry"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hãng xe *</label>
                  <Input
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="VD: Toyota"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Năm sản xuất *</label>
                  <Input
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="VD: 2023"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Số chỗ ngồi *</label>
                  <Input
                    name="seats"
                    type="number"
                    value={formData.seats}
                    onChange={handleInputChange}
                    placeholder="VD: 5"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Loại nhiên liệu *</label>
                  <Input
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleInputChange}
                    placeholder="VD: Xăng"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Giá thuê/ngày (VNĐ) *</label>
                  <Input
                    name="price_per_day"
                    type="number"
                    value={formData.price_per_day}
                    onChange={handleInputChange}
                    placeholder="VD: 800000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Địa điểm</label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="VD: Hà Nội"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL hình ảnh</label>
                  <Input
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/car.jpg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingCar ? 'Cập nhật' : 'Thêm xe'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

