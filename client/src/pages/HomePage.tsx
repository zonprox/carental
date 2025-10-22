import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowRight, Check, Star } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { CarCard } from '@/components/CarCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { CarQuickView } from '@/components/CarQuickView';
import type { Car as CarType } from '@/types';

export default function HomePage() {
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  useEffect(() => {
    api.cars.list({ limit: 6 }).then(res => {
      setCars(res.cars.filter((c: any) => c.featured));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleQuickView = (car: CarType) => {
    setSelectedCar(car);
    setQuickViewOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Tìm chiếc xe hoàn hảo
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Lựa chọn từ bộ sưu tập xe cao cấp với giá cả hợp lý và dịch vụ tốt nhất
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/cars">
                Xem tất cả xe
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link to="/auth/register">Đăng ký ngay</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Giá cả minh bạch</h3>
              <p className="text-muted-foreground">Không phí ẩn, giá rõ ràng</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Xe chất lượng cao</h3>
              <p className="text-muted-foreground">Được kiểm tra và bảo dưỡng định kỳ</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Hỗ trợ 24/7</h3>
              <p className="text-muted-foreground">Luôn sẵn sàng hỗ trợ bạn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Star className="h-3 w-3 mr-1" />
            Xe nổi bật
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Những mẫu xe được yêu thích nhất</h2>
          <p className="text-muted-foreground">Lựa chọn từ các mẫu xe chất lượng cao với giá cả hợp lý</p>
        </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-52 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} onQuickView={handleQuickView} />
              ))}
            </div>
          )}

          {!loading && cars.length === 0 && (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chưa có xe nổi bật</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link to="/cars">Xem tất cả xe <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Car className="h-6 w-6" />
            <span className="font-bold text-xl">Thuê Xe</span>
          </div>
          <p className="text-gray-400">© 2025 Thuê Xe. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>

      {/* Quick View Modal */}
      <CarQuickView 
        car={selectedCar} 
        open={quickViewOpen} 
        onOpenChange={setQuickViewOpen} 
      />
    </div>
  );
}
