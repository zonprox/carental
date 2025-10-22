import { useEffect, useState } from 'react';
import { Calendar, Search, CheckCircle, XCircle, Eye, DollarSign, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';

interface Booking {
  id: string;
  carId: string;
  carName: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  withDriver: boolean;
  basePrice: number;
  driverPrice: number;
  totalPrice: number;
  depositAmount: number;
  paidAmount: number;
  cleaningFee: number;
  damageFee: number;
  overtimeFee: number;
  fuelFee: number;
  otherFees: number;
  feesNotes?: string;
  status: 'pending' | 'verified' | 'confirmed' | 'delivered' | 'active' | 'returning' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chargesDialogOpen, setChargesDialogOpen] = useState(false);
  const [charges, setCharges] = useState({
    cleaningFee: 0,
    damageFee: 0,
    overtimeFee: 0,
    fuelFee: 0,
    otherFees: 0,
    feesNotes: '',
  });
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [payment, setPayment] = useState({
    paidAmount: 0,
    paymentNotes: '',
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    // Filter bookings based on search query and status
    let filtered = bookings;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.customerName.toLowerCase().includes(query) ||
          booking.customerEmail.toLowerCase().includes(query) ||
          booking.carName.toLowerCase().includes(query) ||
          booking.customerPhone.includes(query)
      );
    }

    setFilteredBookings(filtered);
  }, [searchQuery, statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      const res = await api.bookings.list({ limit: 100 });
      setBookings(res.bookings);
      setFilteredBookings(res.bookings);
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể tải danh sách đặt xe',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await api.bookings.updateStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: newStatus as Booking['status'] }
            : booking
        )
      );

      sonnerToast.success('Thành công', {
        description: 'Đã cập nhật trạng thái đặt xe',
      });
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể cập nhật trạng thái',
      });
    }
  };

  const handleOpenCharges = (booking: Booking) => {
    setViewingBooking(booking);
    setCharges({
      cleaningFee: booking.cleaningFee || 0,
      damageFee: booking.damageFee || 0,
      overtimeFee: booking.overtimeFee || 0,
      fuelFee: booking.fuelFee || 0,
      otherFees: booking.otherFees || 0,
      feesNotes: booking.feesNotes || '',
    });
    setChargesDialogOpen(true);
  };

  const handleUpdateCharges = async () => {
    if (!viewingBooking) return;

    try {
      await api.bookings.updateCharges(viewingBooking.id, charges);

      sonnerToast.success('Thành công', {
        description: 'Đã cập nhật các khoản phí',
      });

      setChargesDialogOpen(false);
      fetchBookings();
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể cập nhật phí',
      });
    }
  };

  const handleOpenPayment = (booking: Booking) => {
    setViewingBooking(booking);
    setPayment({
      paidAmount: booking.paidAmount || 0,
      paymentNotes: '',
    });
    setPaymentDialogOpen(true);
  };

  const handleUpdatePayment = async () => {
    if (!viewingBooking) return;

    try {
      await api.bookings.updatePayment(viewingBooking.id, {
        paidAmount: payment.paidAmount,
        paymentNotes: payment.paymentNotes || undefined,
      });

      sonnerToast.success('Thành công', {
        description: 'Đã cập nhật thanh toán',
      });

      setPaymentDialogOpen(false);
      fetchBookings();
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể cập nhật thanh toán',
      });
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Chờ xác nhận', variant: 'secondary' as const, color: 'text-gray-600' },
      verified: { label: 'Đã xác minh', variant: 'default' as const, color: 'text-blue-600' },
      confirmed: { label: 'Đã xác nhận', variant: 'default' as const, color: 'text-green-600' },
      delivered: { label: 'Đã giao xe', variant: 'default' as const, color: 'text-purple-600' },
      active: { label: 'Đang thuê', variant: 'default' as const, color: 'text-blue-600' },
      returning: { label: 'Đang trả xe', variant: 'default' as const, color: 'text-orange-600' },
      completed: { label: 'Hoàn thành', variant: 'secondary' as const, color: 'text-green-600' },
      cancelled: { label: 'Đã hủy', variant: 'secondary' as const, color: 'text-red-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={`font-normal ${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const statusFlow: Record<string, string> = {
      pending: 'verified',
      verified: 'confirmed',
      confirmed: 'delivered',
      delivered: 'active',
      active: 'returning',
      returning: 'completed',
    };
    return statusFlow[currentStatus] || null;
  };

  const getNextStatusLabel = (currentStatus: string): string | null => {
    const labels: Record<string, string> = {
      pending: 'Xác minh',
      verified: 'Xác nhận',
      confirmed: 'Giao xe',
      delivered: 'Bắt đầu thuê',
      active: 'Trả xe',
      returning: 'Hoàn thành',
    };
    return labels[currentStatus] || null;
  };

  const handleViewDetails = (booking: Booking) => {
    setViewingBooking(booking);
    setDialogOpen(true);
  };

  if (loading && bookings.length === 0) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Đang tải...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Quản lý đặt xe</h1>
            <p className="text-muted-foreground">Tổng cộng {bookings.length} đơn đặt xe</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc xe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              size="sm"
            >
              Tất cả
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('pending')}
              size="sm"
            >
              Chờ xác nhận
            </Button>
            <Button
              variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('confirmed')}
              size="sm"
            >
              Đã xác nhận
            </Button>
          </div>
        </div>

        {/* Bookings Table */}
        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Không tìm thấy đơn đặt xe'
                  : 'Chưa có đơn đặt xe nào'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Khách hàng</TableHead>
                  <TableHead className="w-[20%]">Xe</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Lái xe</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-[150px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-sm text-muted-foreground">{booking.customerPhone}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{booking.carName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.withDriver ? (
                        <Badge variant="default" className="font-normal">
                          Có
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="font-normal">
                          Không
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-primary">
                        {booking.totalPrice.toLocaleString('vi-VN')} đ
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(booking)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenCharges(booking)}
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="Quản lý phí"
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenPayment(booking)}
                          className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                          title="Thanh toán"
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                        {getNextStatus(booking.status) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(booking.id, getNextStatus(booking.status)!)}
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title={getNextStatusLabel(booking.status) || undefined}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Hủy đơn"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* View Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Chi tiết đặt xe
            </DialogTitle>
            <DialogDescription>Thông tin chi tiết về đơn đặt xe</DialogDescription>
          </DialogHeader>

          {viewingBooking && (
            <div className="space-y-6 py-4">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-3">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Họ tên</Label>
                    <p className="font-medium">{viewingBooking.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Số điện thoại</Label>
                    <p className="font-medium">{viewingBooking.customerPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{viewingBooking.customerEmail}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Booking Info */}
              <div>
                <h3 className="font-semibold mb-3">Thông tin đặt xe</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Xe</Label>
                    <p className="font-medium">{viewingBooking.carName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Ngày nhận</Label>
                    <p className="font-medium">{formatDate(viewingBooking.startDate)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Ngày trả</Label>
                    <p className="font-medium">{formatDate(viewingBooking.endDate)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Lái xe</Label>
                    <p className="font-medium">{viewingBooking.withDriver ? 'Có' : 'Không'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Tổng tiền</Label>
                    <p className="font-medium text-primary text-lg">
                      {viewingBooking.totalPrice.toLocaleString('vi-VN')} đ
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Trạng thái</Label>
                    <div className="mt-1">{getStatusBadge(viewingBooking.status)}</div>
                  </div>
                  {viewingBooking.notes && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Ghi chú</Label>
                      <p className="font-medium">{viewingBooking.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Actions */}
              {getNextStatus(viewingBooking.status) && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      handleStatusChange(viewingBooking.id, getNextStatus(viewingBooking.status)!);
                      setDialogOpen(false);
                    }}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {getNextStatusLabel(viewingBooking.status)}
                  </Button>
                  {viewingBooking.status !== 'cancelled' && viewingBooking.status !== 'completed' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleStatusChange(viewingBooking.id, 'cancelled');
                        setDialogOpen(false);
                      }}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Hủy đơn
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Charges Management Dialog */}
      <Dialog open={chargesDialogOpen} onOpenChange={setChargesDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Quản lý phí bổ sung
            </DialogTitle>
            <DialogDescription>
              Ghi nhận các khoản phí phát sinh (vệ sinh, hư hỏng, quá giờ...)
            </DialogDescription>
          </DialogHeader>

          {viewingBooking && (
            <div className="space-y-6 py-4">
              {/* Booking Info */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="text-sm">
                  <p className="font-medium">{viewingBooking.carName}</p>
                  <p className="text-muted-foreground">{viewingBooking.customerName}</p>
                </div>
              </div>

              {/* Base Pricing */}
              <div>
                <h3 className="font-semibold mb-2">Giá cơ bản</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giá thuê xe:</span>
                    <span className="font-medium">{viewingBooking.basePrice.toLocaleString('vi-VN')} đ</span>
                  </div>
                  {viewingBooking.driverPrice > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giá lái xe:</span>
                      <span className="font-medium">{viewingBooking.driverPrice.toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Additional Charges */}
              <div className="space-y-4">
                <h3 className="font-semibold">Phí bổ sung</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cleaningFee">Phí vệ sinh</Label>
                    <Input
                      id="cleaningFee"
                      type="number"
                      min="0"
                      value={charges.cleaningFee}
                      onChange={(e) => setCharges({ ...charges, cleaningFee: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="damageFee">Phí hư hỏng</Label>
                    <Input
                      id="damageFee"
                      type="number"
                      min="0"
                      value={charges.damageFee}
                      onChange={(e) => setCharges({ ...charges, damageFee: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="overtimeFee">Phí quá giờ</Label>
                    <Input
                      id="overtimeFee"
                      type="number"
                      min="0"
                      value={charges.overtimeFee}
                      onChange={(e) => setCharges({ ...charges, overtimeFee: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fuelFee">Phí nhiên liệu</Label>
                    <Input
                      id="fuelFee"
                      type="number"
                      min="0"
                      value={charges.fuelFee}
                      onChange={(e) => setCharges({ ...charges, fuelFee: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="otherFees">Phí khác</Label>
                    <Input
                      id="otherFees"
                      type="number"
                      min="0"
                      value={charges.otherFees}
                      onChange={(e) => setCharges({ ...charges, otherFees: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="feesNotes">Ghi chú</Label>
                  <Textarea
                    id="feesNotes"
                    value={charges.feesNotes}
                    onChange={(e) => setCharges({ ...charges, feesNotes: e.target.value })}
                    placeholder="Ghi chú về các khoản phí..."
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {(
                      viewingBooking.basePrice +
                      viewingBooking.driverPrice +
                      charges.cleaningFee +
                      charges.damageFee +
                      charges.overtimeFee +
                      charges.fuelFee +
                      charges.otherFees
                    ).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setChargesDialogOpen(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleUpdateCharges}
                  className="flex-1"
                >
                  Lưu phí
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Tracking Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Quản lý thanh toán
            </DialogTitle>
            <DialogDescription>
              Ghi nhận số tiền đã thanh toán và theo dõi công nợ
            </DialogDescription>
          </DialogHeader>

          {viewingBooking && (
            <div className="space-y-6 py-4">
              {/* Booking Info */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="text-sm">
                  <p className="font-medium">{viewingBooking.carName}</p>
                  <p className="text-muted-foreground">{viewingBooking.customerName}</p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tổng tiền:</span>
                  <span className="font-semibold text-lg">
                    {viewingBooking.totalPrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Tiền cọc (30%):</span>
                  <span className="font-medium">
                    {viewingBooking.depositAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Đã thanh toán:</span>
                  <span className="font-medium text-green-600">
                    {viewingBooking.paidAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Còn lại:</span>
                  <span className="font-bold text-lg text-red-600">
                    {(viewingBooking.totalPrice - viewingBooking.paidAmount).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              <Separator />

              {/* Payment Input */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="paidAmount">Cập nhật số tiền đã thanh toán</Label>
                  <Input
                    id="paidAmount"
                    type="number"
                    min="0"
                    max={viewingBooking.totalPrice}
                    value={payment.paidAmount}
                    onChange={(e) => setPayment({ ...payment, paidAmount: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Nhập tổng số tiền khách hàng đã thanh toán
                  </p>
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <Label className="text-xs text-muted-foreground">Nhanh:</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPayment({ ...payment, paidAmount: viewingBooking.depositAmount })}
                    >
                      Tiền cọc
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPayment({ ...payment, paidAmount: viewingBooking.totalPrice / 2 })}
                    >
                      50%
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPayment({ ...payment, paidAmount: viewingBooking.totalPrice })}
                    >
                      Toàn bộ
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="paymentNotes">Ghi chú thanh toán</Label>
                  <Textarea
                    id="paymentNotes"
                    value={payment.paymentNotes}
                    onChange={(e) => setPayment({ ...payment, paymentNotes: e.target.value })}
                    placeholder="Ghi chú về thanh toán..."
                    rows={2}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Payment Status Indicator */}
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Trạng thái:</span>
                  {payment.paidAmount >= viewingBooking.totalPrice ? (
                    <Badge className="bg-green-100 text-green-700">Đã thanh toán đủ</Badge>
                  ) : payment.paidAmount >= viewingBooking.depositAmount ? (
                    <Badge className="bg-blue-100 text-blue-700">Đã đặt cọc</Badge>
                  ) : payment.paidAmount > 0 ? (
                    <Badge className="bg-orange-100 text-orange-700">Thanh toán một phần</Badge>
                  ) : (
                    <Badge variant="secondary">Chưa thanh toán</Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPaymentDialogOpen(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleUpdatePayment}
                  className="flex-1"
                >
                  Lưu thanh toán
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
