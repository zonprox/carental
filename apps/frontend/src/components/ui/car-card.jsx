import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Users, MapPin, Gauge } from "lucide-react";
import { t } from "@/locales";
import { cn } from "@/lib/utils";

/**
 * CarCard - Reusable car display card
 * Used in HomePage and UserDashboard
 */
export function CarCard({
  car,
  onRent,
  showRentButton = true,
  className,
  ...props
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-lg transition-shadow",
        className,
      )}
      {...props}
    >
      <div className="aspect-video bg-muted relative">
        {car.image_url ? (
          <img
            src={car.image_url}
            alt={car.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl text-foreground">{car.name}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {car.brand} - {car.year}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-foreground font-medium">{car.seats}</span>
              <span>{t("home.carDetails.seats")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Gauge className="h-4 w-4" />
              <span className="text-foreground font-medium">
                {car.fuel_type}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-foreground font-medium">
                {car.location || "Hà Nội"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary">
              {car.price_per_day?.toLocaleString("vi-VN")}đ
            </span>
            <span className="text-sm text-muted-foreground">
              {t("home.carDetails.perDay")}
            </span>
          </div>
          {showRentButton && (
            <Button onClick={() => onRent?.(car)}>{t("home.rentNow")}</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
