import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Car, Clock } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast as sonnerToast } from 'sonner';

interface Booking {
  id: string;
  carId: string;
  carName: string;
  startDate: string;
  endDate: string;
  withDriver: boolean;
  totalPrice: number;
  status: 'pending' | 'verified' | 'confirmed' | 'delivered' | 'active' | 'returning' | 'completed' | 'cancelled';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  createdAt: string;
}

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // For now, we'll fetch all bookings and filter by current user on frontend
      // In production, add a /api/bookings/my endpoint that filters server-side
      const res = await api.bookings.list({ limit: 100 });
      setBookings(res.bookings as Booking[]);
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể tải danh sách đặt xe',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: 'Chờ xác nhận', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-700' },
      verified: { label: 'Đã xác minh', variant: 'default' as const, color: 'bg-blue-100 text-blue-700' },
      confirmed: { label: 'Đã xác nhận', variant: 'default' as const, color: 'bg-green-100 text-green-700' },
      delivered: { label: 'Đã giao xe', variant: 'default' as const, color: 'bg-purple-100 text-purple-700' },
      active: { label: 'Đang thuê', variant: 'default' as const, color: 'bg-blue-100 text-blue-700' },
      returning: { label: 'Đang trả xe', variant: 'default' as const, color: 'bg-orange-100 text-orange-700' },
      completed: { label: 'Hoàn thành', variant: 'secondary' as const, color: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Đã hủy', variant: 'secondary' as const, color: 'bg-red-100 text-red-700' },
    };

    const statusConfig = config[status as keyof typeof config] || config.pending;

    return (
      <Badge variant={statusConfig.variant} className={`font-normal ${statusConfig.color}`}>
        {statusConfig.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại trang chủ
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Đặt xe của tôi</h1>
            <p className="text-muted-foreground">
              {bookings.length} đơn đặt xe
            </p>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Bạn chưa có đơn đặt xe nào
              </p>
              <Button onClick={() => navigate('/cars')}>
                Đặt xe ngay
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg flex items-center justify-center">
                        <Car className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{booking.carName}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {calculateDays(booking.startDate, booking.endDate)} ngày
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Ngày nhận</p>
                      <p className="font-medium">{formatDate(booking.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ngày trả</p>
                      <p className="font-medium">{formatDate(booking.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lái xe</p>
                      <p className="font-medium">{booking.withDriver ? 'Có' : 'Không'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tổng tiền</p>
                      <p className="font-medium text-primary">
                        {booking.totalPrice.toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="pt-3 border-t">
                      <p className="text-muted-foreground text-xs mb-1">Ghi chú</p>
                      <p className="text-sm">{booking.notes}</p>
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      Đặt lúc: {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
