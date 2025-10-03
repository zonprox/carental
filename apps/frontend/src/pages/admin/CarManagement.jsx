import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageContainer, PageHeader } from "@/components/ui/page-header";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Car as CarIcon,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { t } from "@/locales";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function CarManagement() {
  const { toast } = useToast();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    carId: null,
    carName: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    year: "",
    seats: "",
    fuel_type: "",
    price_per_day: "",
    image_url: "",
    location: "",
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch("/api/cars", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCars(data);
      } else {
        throw new Error("Failed to fetch cars");
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast({
        variant: "destructive",
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải danh sách xe",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      year: parseInt(formData.year),
      seats: parseInt(formData.seats),
      price_per_day: parseFloat(formData.price_per_day),
    };

    try {
      const url = editingCar ? `/api/cars/${editingCar.id}` : "/api/cars";
      const method = editingCar ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: editingCar ? "Cập nhật thành công" : "Thêm thành công",
          description: editingCar
            ? `Đã cập nhật thông tin xe "${formData.name}"`
            : `Đã thêm xe "${formData.name}" vào hệ thống`,
        });
        fetchCars();
        handleCloseDialog();
      } else {
        throw new Error("Failed to save car");
      }
    } catch (error) {
      console.error("Error saving car:", error);
      toast({
        variant: "destructive",
        title: "Lỗi lưu dữ liệu",
        description: "Không thể lưu thông tin xe",
      });
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (id) => {
    const car = cars.find((c) => c.id === id);
    setDeleteDialog({
      open: true,
      carId: id,
      carName: car ? car.name : "xe này",
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, carId: null, carName: "" });
  };

  const handleDelete = async () => {
    const { carId, carName } = deleteDialog;

    try {
      const response = await fetch(`/api/cars/${carId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        toast({
          variant: "success",
          title: "Xóa thành công",
          description: `Đã xóa xe "${carName}" khỏi hệ thống`,
        });
        closeDeleteDialog();
        fetchCars();
      } else {
        throw new Error("Failed to delete car");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      toast({
        variant: "destructive",
        title: "Lỗi xóa xe",
        description: "Không thể xóa xe",
      });
      closeDeleteDialog();
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      brand: car.brand,
      year: car.year.toString(),
      seats: car.seats.toString(),
      fuel_type: car.fuel_type,
      price_per_day: car.price_per_day.toString(),
      image_url: car.image_url || "",
      location: car.location || "",
    });
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingCar(null);
    setFormData({
      name: "",
      brand: "",
      year: "",
      seats: "",
      fuel_type: "",
      price_per_day: "",
      image_url: "",
      location: "",
    });
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingCar(null);
    setFormData({
      name: "",
      brand: "",
      year: "",
      seats: "",
      fuel_type: "",
      price_per_day: "",
      image_url: "",
      location: "",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <CarIcon className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageContainer>
        <PageHeader title={t("cars.title")} description={t("cars.subtitle")}>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            {t("cars.addNew")}
          </Button>
        </PageHeader>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground">
                    {t("cars.table.name")}
                  </TableHead>
                  <TableHead className="text-foreground">
                    {t("cars.table.brand")}
                  </TableHead>
                  <TableHead className="text-foreground">
                    {t("cars.table.year")}
                  </TableHead>
                  <TableHead className="text-foreground">
                    {t("cars.table.seats")}
                  </TableHead>
                  <TableHead className="text-foreground">
                    {t("cars.table.fuel")}
                  </TableHead>
                  <TableHead className="text-foreground">
                    {t("cars.table.location")}
                  </TableHead>
                  <TableHead className="text-right text-foreground">
                    {t("cars.table.price")}
                  </TableHead>
                  <TableHead className="text-right text-foreground">
                    {t("cars.table.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-12 text-gray-500"
                    >
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
                      <TableCell>{car.location || "Hà Nội"}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {car.price_per_day?.toLocaleString("vi-VN")}đ
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
                            onClick={() => openDeleteDialog(car.id)}
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
                {editingCar ? "Chỉnh sửa xe" : "Thêm xe mới"}
              </DialogTitle>
              <DialogDescription>
                {editingCar ? "Cập nhật thông tin xe" : "Điền thông tin xe mới"}
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
                  <label className="text-sm font-medium">
                    Loại nhiên liệu *
                  </label>
                  <Input
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleInputChange}
                    placeholder="VD: Xăng"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Giá thuê/ngày (VNĐ) *
                  </label>
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingCar ? "Cập nhật" : "Thêm xe"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <AlertDialogTitle className="text-left">
                    Xác nhận xóa xe
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-left">
                    Bạn có chắc chắn muốn xóa xe{" "}
                    <strong>"{deleteDialog.carName}"</strong>?
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác.
                Thông tin xe này sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDeleteDialog}>
                <X className="h-4 w-4 mr-2" />
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa xe
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PageContainer>
    </AdminLayout>
  );
}
