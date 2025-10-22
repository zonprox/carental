import { useEffect, useState } from 'react';
import { Car, Plus, Pencil, Trash2, Search, Star } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast as sonnerToast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Badge } from '@/components/ui/badge';

interface CarData {
  id?: string;
  name: string;
  brand: string;
  type: string;
  dailyPrice: number;
  priceWithDriver?: number;
  featured: boolean;
}

export default function AdminCarsPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [filteredCars, setFilteredCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CarData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<CarData>({
    name: '',
    brand: '',
    type: '',
    dailyPrice: 100000,
    priceWithDriver: 0,
    featured: false,
  });

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    // Filter cars based on search query
    if (searchQuery.trim() === '') {
      setFilteredCars(cars);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredCars(
        cars.filter(
          (car) =>
            car.name.toLowerCase().includes(query) ||
            car.brand.toLowerCase().includes(query) ||
            car.type.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, cars]);

  const fetchCars = async () => {
    try {
      const response = await api.cars.list({ limit: 100 });
      setCars(response.cars);
      setFilteredCars(response.cars);
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể tải danh sách xe',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dailyPrice
    if (!formData.dailyPrice || formData.dailyPrice <= 0) {
      sonnerToast.error('Lỗi', {
        description: 'Giá thuê phải lớn hơn 0',
      });
      return;
    }

    setLoading(true);

    try {
      // Ensure prices are numbers
      const dataToSubmit = {
        ...formData,
        dailyPrice: Number(formData.dailyPrice),
        priceWithDriver: Number(formData.priceWithDriver || 0),
      };

      if (editing?.id) {
        await api.cars.update(editing.id, dataToSubmit);
        sonnerToast.success('Thành công', {
          description: 'Cập nhật xe thành công',
        });
      } else {
        await api.cars.create(dataToSubmit);
        sonnerToast.success('Thành công', {
          description: 'Thêm xe mới thành công',
        });
      }
      
      setDialogOpen(false);
      setEditing(null);
      setFormData({ name: '', brand: '', type: '', dailyPrice: 100000, priceWithDriver: 0, featured: false });
      fetchCars();
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể lưu dữ liệu xe',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car: any) => {
    setEditing(car);
    setFormData({
      name: car.name,
      brand: car.brand,
      type: car.type,
      dailyPrice: car.dailyPrice,
      priceWithDriver: car.priceWithDriver || 0,
      featured: car.featured,
    });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setFormData({ name: '', brand: '', type: '', dailyPrice: 100000, priceWithDriver: 0, featured: false });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa xe này?')) return;

    try {
      await api.cars.delete(id);
      sonnerToast.success('Thành công', {
        description: 'Đã xóa xe',
      });
      fetchCars();
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể xóa xe',
      });
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditing(null);
      setFormData({ name: '', brand: '', type: '', dailyPrice: 100000, priceWithDriver: 0, featured: false });
    }
  };

  if (loading && cars.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Quản lý xe</h1>
            <p className="text-muted-foreground">Tổng cộng {cars.length} xe</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm xe mới
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, hãng hoặc loại xe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Cars Table */}
        {filteredCars.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'Không tìm thấy xe' : 'Chưa có xe nào. Thêm xe đầu tiên!'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Tên xe</TableHead>
                  <TableHead>Loại xe</TableHead>
                  <TableHead>Giá thuê</TableHead>
                  <TableHead className="w-[100px] text-center">Nổi bật</TableHead>
                  <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{car.name}</div>
                          <div className="text-sm text-muted-foreground">{car.brand}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {car.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-primary">
                        {car.dailyPrice.toLocaleString('vi-VN')} đ
                      </div>
                      <div className="text-xs text-muted-foreground">/ ngày</div>
                      {car.priceWithDriver && car.priceWithDriver > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          + {car.priceWithDriver.toLocaleString('vi-VN')} đ (lái xe)
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {car.featured && (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(car)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(car.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* Add/Edit Car Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Chỉnh sửa xe' : 'Thêm xe mới'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Cập nhật thông tin xe' : 'Điền thông tin xe mới vào hệ thống'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Tên xe</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Toyota Camry 2024"
                  required
                />
              </div>
              <div>
                <Label htmlFor="brand">Hãng xe</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Ví dụ: Toyota"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Loại xe</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="Ví dụ: Sedan"
                  required
                />
              </div>
              <div>
                <Label htmlFor="dailyPrice">Giá thuê (VNĐ/ngày)</Label>
                <Input
                  id="dailyPrice"
                  type="number"
                  value={formData.dailyPrice}
                  onChange={(e) => setFormData({ ...formData, dailyPrice: parseFloat(e.target.value) })}
                  placeholder="500000"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="priceWithDriver">Giá thuê có lái xe (VNĐ/ngày)</Label>
                <Input
                  id="priceWithDriver"
                  type="number"
                  value={formData.priceWithDriver}
                  onChange={(e) => setFormData({ ...formData, priceWithDriver: parseFloat(e.target.value) || 0 })}
                  placeholder="700000"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Để trống hoặc 0 nếu không cung cấp dịch vụ lái xe
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="featured">Xe nổi bật (hiển thị trên trang chủ)</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Thêm xe'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
