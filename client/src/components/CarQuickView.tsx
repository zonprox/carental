import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Fuel,
  Users,
  CalendarClock,
  Settings2,
  AirVent,
  Wifi,
  Briefcase,
  ShieldCheck,
  Info,
  Snowflake,
  ShoppingCart,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import type { Car as CarType } from '@/types';

interface CarQuickViewProps {
  car: CarType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CarQuickView({ car, open, onOpenChange }: CarQuickViewProps) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock images for carousel (in real app, car would have multiple images)
  const images = car?.imageUrl ? [car.imageUrl] : [];
  
  // Mock data for demo
  const rating = 4.8;
  const tripCount = 127;
  const location = 'Hà Nội';

  // Reset image index when modal closes
  useEffect(() => {
    if (!open) {
      setCurrentImageIndex(0);
    }
  }, [open]);

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handlePrevImage, handleNextImage]);

  const handleBookNow = () => {
    if (!car) return;
    onOpenChange(false);
    navigate(`/cars/${car.id}`);
  };

  if (!car) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh] md:max-h-[75vh] lg:max-h-[70vh] p-0 gap-0 overflow-hidden">
        <div className="grid md:grid-cols-2 h-[85vh] md:h-[75vh] lg:h-[70vh]">
          {/* Left: Image Carousel */}
          <div className="relative h-[300px] md:h-full bg-gradient-to-br from-muted/30 to-muted/50 overflow-hidden">
            {images.length > 0 ? (
              <>
                <img
                  src={images[currentImageIndex]}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 rounded-full transition-all ${
                            idx === currentImageIndex
                              ? 'w-8 bg-white'
                              : 'w-1.5 bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Right: Content */}
          <div className="flex flex-col h-[calc(85vh-300px)] md:h-[75vh] lg:h-[70vh]">
            {/* Header */}
            <DialogHeader className="px-6 pt-6 pb-4 space-y-3 border-b">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Car className="h-5 w-5 text-primary" />
                {car.name}
              </DialogTitle>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{rating}</span>
                </div>
                <span>•</span>
                <span>{tripCount} chuyến</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{location}</span>
                </div>
              </div>
            </DialogHeader>

            {/* Tabs */}
            <ScrollArea className="flex-1">
              <Tabs defaultValue="overview" className="px-6 py-4">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                  <TabsTrigger value="details">Chi tiết</TabsTrigger>
                  <TabsTrigger value="rules">Quy định</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {car.description ||
                      `${car.name} là một chiếc xe ${car.type} hiện đại với thiết kế thời thượng và tiện nghi. Phù hợp cho các chuyến đi gia đình, du lịch hoặc công tác.`}
                  </p>

                  <TooltipProvider>
                    <div className="grid grid-cols-2 gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-primary/5 hover:bg-primary/10 transition-colors cursor-default">
                            <Gauge className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              {car.transmission === 'Automatic' ? 'Tự động' : car.transmission || 'Tự động'}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hộp số</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-primary/5 hover:bg-primary/10 transition-colors cursor-default">
                            <Fuel className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{car.fuelType || 'Xăng'}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Nhiên liệu</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-primary/5 hover:bg-primary/10 transition-colors cursor-default">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{car.seats || 5} chỗ</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Số chỗ ngồi</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-primary/5 hover:bg-primary/10 transition-colors cursor-default">
                            <CalendarClock className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{car.year || '2024'}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Năm sản xuất</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-primary/5 hover:bg-primary/10 transition-colors cursor-default">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{location}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Địa điểm</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-primary/5 hover:bg-primary/10 transition-colors cursor-default">
                            <Car className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">{car.brand}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hãng xe / Model</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4">
                  {/* Specifications */}
                  <Card>
                    <CardContent className="pt-6 space-y-3">
                      <h3 className="font-semibold text-sm mb-3">Thông số kỹ thuật</h3>
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3 text-sm">
                          <Settings2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground min-w-[100px]">Hộp số</span>
                          <span className="font-medium">
                            {car.transmission === 'Automatic' ? 'Tự động' : car.transmission || 'Tự động'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <CalendarClock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground min-w-[100px]">Năm SX</span>
                          <span className="font-medium">{car.year || '2024'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground min-w-[100px]">Số chỗ</span>
                          <span className="font-medium">{car.seats || 5} chỗ</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground min-w-[100px]">Tình trạng</span>
                          <span className="font-medium">{car.mileage || 'Tốt'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Fuel className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground min-w-[100px]">Nhiên liệu</span>
                          <span className="font-medium">{car.fuelType || 'Xăng'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Separator />

                  {/* Featured Amenities */}
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-sm mb-3">Tiện nghi nổi bật</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <AirVent className="h-4 w-4 text-primary" />
                          <span>Điều hòa</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Wifi className="h-4 w-4 text-primary" />
                          <span>Bluetooth</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Briefcase className="h-4 w-4 text-primary" />
                          <span>Cốp rộng</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          <span>Bảo hiểm</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Info className="h-4 w-4 text-primary" />
                          <span>Camera lùi</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Snowflake className="h-4 w-4 text-primary" />
                          <span>Túi khí</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Rules Tab */}
                <TabsContent value="rules">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-2.5 text-sm">
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Không hút thuốc trong xe</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Không chở thú cưng (trừ khi thỏa thuận trước)</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Trả xe đúng hạn, sạch sẽ như ban đầu</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Bồi thường 100% nếu làm mất hoặc hư hại nội thất</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Chấp hành luật giao thông, không sử dụng rượu bia</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>Liên hệ chủ xe ngay khi có sự cố</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </ScrollArea>

            {/* Sticky Bottom Bar */}
            <div className="sticky bottom-0 px-6 py-4 border-t bg-background/95 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {(car.dailyPrice / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-muted-foreground">VNĐ/ngày</div>
                </div>
                <Button
                  onClick={handleBookNow}
                  className="gap-2"
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Đặt xe ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
