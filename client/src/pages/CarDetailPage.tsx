import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { parseDate } from 'chrono-node';
import { Car, ArrowLeft, Calendar as CalendarIcon, User, Phone, Mail } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withDriver, setWithDriver] = useState(false);
  const [notes, setNotes] = useState('');
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');
  const [startMonth, setStartMonth] = useState<Date | undefined>(new Date());
  const [endMonth, setEndMonth] = useState<Date | undefined>(new Date());
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  useEffect(() => {
    if (id) {
      api.cars.get(id)
        .then(res => setCar(res.car))
        .catch(() => {
          toast({
            title: 'Lỗi',
            description: 'Không thể tải thông tin xe',
            variant: 'destructive',
          });
          navigate('/cars');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate, toast]);

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  const estimatedTotal = useMemo(() => {
    if (!car || days <= 0) return 0;
    const base = days * car.dailyPrice;
    const driver = withDriver && car.priceWithDriver ? days * car.priceWithDriver : 0;
    return base + driver;
  }, [car, days, withDriver]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn ngày nhận và trả xe',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.bookings.create({
        carId: id as string,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        withDriver,
        customerName: bookingData.name,
        customerEmail: bookingData.email,
        customerPhone: bookingData.phone,
        notes: notes || undefined,
      });

      toast({
        title: 'Đặt xe thành công!',
        description: `Tổng tiền dự kiến: ${estimatedTotal.toLocaleString('vi-VN')} VNĐ cho ${days} ngày. Chúng tôi sẽ liên hệ bạn sớm.`,
      });

      // Reset form
      setBookingData({ name: '', phone: '', email: '' });
      setStartDate(undefined);
      setEndDate(undefined);
      setStartValue('');
      setEndValue('');
      setWithDriver(false);
      setNotes('');
    } catch (error: any) {
      const message = error?.message || '';
      if (message.toLowerCase().includes('authentication')) {
        toast({
          title: 'Yêu cầu đăng nhập',
          description: 'Vui lòng đăng nhập để đặt xe',
          variant: 'destructive',
        });
        navigate('/auth/login');
        return;
      }
      toast({
        title: 'Lỗi',
        description: message || 'Không thể tạo đặt xe',
        variant: 'destructive',
      });
    }
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

  if (!car) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/cars')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Car Details */}
          <div>
            <Card>
              <CardHeader>
                <div className="w-full h-64 bg-gradient-to-br from-muted/50 to-muted rounded-lg flex items-center justify-center mb-4">
                  <Car className="h-32 w-32 text-muted-foreground" />
                </div>
                <CardTitle className="text-3xl">{car.name}</CardTitle>
                <p className="text-lg text-muted-foreground">{car.brand} • {car.type}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Giá thuê</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-blue-600">
                      {car.dailyPrice.toLocaleString('vi-VN')}
                    </span>
                    <span className="text-muted-foreground text-lg">VNĐ/ngày</span>
                  </div>
                  {car.priceWithDriver > 0 && (
                    <div className="mt-1 text-sm text-muted-foreground">
                      Lái xe: + {car.priceWithDriver.toLocaleString('vi-VN')} VNĐ/ngày
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Thông số kỹ thuật</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Hãng xe</p>
                      <p className="font-medium">{car.brand}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Loại xe</p>
                      <p className="font-medium">{car.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Nhiên liệu</p>
                      <p className="font-medium">Xăng</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Số chỗ ngồi</p>
                      <p className="font-medium">5 chỗ</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Tính năng</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      Điều hòa nhiệt độ
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      Hệ thống âm thanh
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      Camera lùi
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      Cảm biến áp suất lốp
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Đặt xe ngay</CardTitle>
                <p className="text-sm text-muted-foreground">Điền thông tin để đặt xe</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Họ và tên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        className="pl-10"
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        className="pl-10"
                        placeholder="0123456789"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        className="pl-10"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="start-date">Ngày nhận xe</Label>
                    <div className="relative flex gap-2">
                      <Input
                        id="start-date"
                        value={startValue}
                        placeholder="Hôm nay, ngày mai, hoặc 20/10/2025"
                        className="bg-background pr-10"
                        onChange={(e) => {
                          setStartValue(e.target.value);
                          const parsed = parseDate(e.target.value);
                          if (parsed && parsed >= new Date(new Date().setHours(0, 0, 0, 0))) {
                            setStartDate(parsed);
                            setStartMonth(parsed);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setStartOpen(true);
                          }
                        }}
                      />
                      <Popover open={startOpen} onOpenChange={setStartOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className="absolute top-1/2 right-2 h-6 w-6 p-0 -translate-y-1/2"
                          >
                            <CalendarIcon className="h-3.5 w-3.5" />
                            <span className="sr-only">Chọn ngày</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            captionLayout="dropdown"
                            month={startMonth}
                            onMonthChange={setStartMonth}
                            onSelect={(date) => {
                              if (date) {
                                setStartDate(date);
                                setStartValue(format(date, 'dd/MM/yyyy'));
                                setStartOpen(false);
                              }
                            }}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {startDate && (
                      <p className="text-xs text-muted-foreground mt-1 px-1">
                        Nhận xe: {format(startDate, 'dd MMMM yyyy', { locale: undefined })}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="end-date">Ngày trả xe</Label>
                    <div className="relative flex gap-2">
                      <Input
                        id="end-date"
                        value={endValue}
                        placeholder="Sau 3 ngày, hoặc 25/10/2025"
                        className="bg-background pr-10"
                        onChange={(e) => {
                          setEndValue(e.target.value);
                          const parsed = parseDate(e.target.value);
                          const minDate = startDate ? new Date(startDate) : new Date();
                          minDate.setHours(0, 0, 0, 0);
                          if (parsed && parsed >= minDate) {
                            setEndDate(parsed);
                            setEndMonth(parsed);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setEndOpen(true);
                          }
                        }}
                      />
                      <Popover open={endOpen} onOpenChange={setEndOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className="absolute top-1/2 right-2 h-6 w-6 p-0 -translate-y-1/2"
                          >
                            <CalendarIcon className="h-3.5 w-3.5" />
                            <span className="sr-only">Chọn ngày</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            captionLayout="dropdown"
                            month={endMonth}
                            onMonthChange={setEndMonth}
                            onSelect={(date) => {
                              if (date) {
                                setEndDate(date);
                                setEndValue(format(date, 'dd/MM/yyyy'));
                                setEndOpen(false);
                              }
                            }}
                            disabled={(date) => {
                              const minDate = startDate ? new Date(startDate) : new Date();
                              minDate.setHours(0, 0, 0, 0);
                              return date < minDate;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {endDate && (
                      <p className="text-xs text-muted-foreground mt-1 px-1">
                        Trả xe: {format(endDate, 'dd MMMM yyyy', { locale: undefined })}
                      </p>
                    )}
                  </div>

                  {car?.priceWithDriver > 0 && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="withDriver"
                        checked={withDriver}
                        onChange={(e) => setWithDriver(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="withDriver">Thuê kèm lái xe (+ {car.priceWithDriver.toLocaleString('vi-VN')} đ/ngày)</Label>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="notes">Ghi chú (tuỳ chọn)</Label>
                    <Input
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Yêu cầu đặc biệt, địa chỉ giao xe..."
                    />
                  </div>

                  {startDate && endDate && (
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Tổng giá dự kiến</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {estimatedTotal.toLocaleString('vi-VN')} VNĐ
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {days} ngày
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" size="lg">
                    Xác nhận đặt xe
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Chúng tôi sẽ liên hệ với bạn để xác nhận đặt xe
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
