import { useEffect, useState } from 'react';
import { Car as CarIcon, Search, Filter } from 'lucide-react';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { CarCard } from '@/components/CarCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { CarQuickView } from '@/components/CarQuickView';
import type { Car } from '@/types';

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params: any = { limit: '100' };
    if (search) params.search = search;
    api.cars.list(params)
      .then(res => setCars(res.cars))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search]);

  const handleQuickView = (car: Car) => {
    setSelectedCar(car);
    setQuickViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            <CarIcon className="h-3 w-3 mr-1" />
            Tất cả xe
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Danh sách xe</h1>
          <p className="text-muted-foreground">Tìm kiếm và lựa chọn xe phù hợp với bạn</p>
        </div>
        
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm xe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-52 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Tìm thấy <span className="font-bold text-blue-600">{cars.length}</span> xe
              </p>
              <Badge variant="outline">
                <Filter className="h-3 w-3 mr-1" />
                {search ? `Tìm kiếm: "${search}"` : 'Tất cả'}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} onQuickView={handleQuickView} />
              ))}
            </div>
          </>
        )}

        {!loading && cars.length === 0 && (
          <div className="text-center py-12">
            <CarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Không tìm thấy xe nào</p>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <CarQuickView 
        car={selectedCar} 
        open={quickViewOpen} 
        onOpenChange={setQuickViewOpen} 
      />
    </div>
  );
}
