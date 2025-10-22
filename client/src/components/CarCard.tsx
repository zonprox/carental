import { Car as CarIcon, Users, Fuel, Settings, Eye, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Car } from '@/types';

interface CarCardProps {
  car: Car;
  onQuickView?: (car: Car) => void;
  className?: string;
}

export function CarCard({ car, onQuickView, className }: CarCardProps) {
  return (
    <Card 
      className={cn(
        'overflow-hidden hover:shadow-xl transition-all duration-200 h-full cursor-pointer group border hover:border-blue-300 dark:hover:border-blue-700 bg-card',
        className
      )}
      onClick={() => onQuickView?.(car)}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 bg-muted overflow-hidden">
        {car.imageUrl ? (
          <img 
            src={car.imageUrl} 
            alt={car.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CarIcon className="h-20 w-20 text-muted-foreground" />
          </div>
        )}
        
        {/* Featured Badge */}
        {car.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-blue-600 text-white border-0 text-xs">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Nổi bật
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-3">
        {/* Car Title */}
        <div>
          <h3 className="font-semibold text-lg truncate mb-1">
            {car.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{car.brand}</span>
            <span>•</span>
            <span>{car.type}</span>
            {car.year && (
              <>
                <span>•</span>
                <span>{car.year}</span>
              </>
            )}
          </div>
        </div>

        {/* Car Specs */}
        <div className="flex items-center justify-between py-3 border-t border-b">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{car.seats || 5}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Settings className="h-4 w-4" />
            <span>{car.transmission === 'Automatic' ? 'Tự động' : car.transmission || 'Tự động'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Fuel className="h-4 w-4" />
            <span>{car.fuelType || 'Xăng'}</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {(car.dailyPrice / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-muted-foreground">VNĐ/ngày</div>
          </div>
          <Button 
            variant="outline"
            size="sm"
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            <Eye className="h-4 w-4 mr-1" />
            Xem
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
