import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ChartPlaceholder - Beautiful placeholder for charts
 * Used in admin dashboard for future chart implementations
 */
export function ChartPlaceholder({
  title,
  description,
  type = "bar",
  className,
  ...props
}) {
  const iconMap = {
    bar: BarChart3,
    line: LineChart,
    pie: PieChart,
    trend: TrendingUp,
    activity: Activity,
  };

  const Icon = iconMap[type] || BarChart3;

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-border rounded-lg bg-muted/20">
          <div className="text-center space-y-2">
            <Icon className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground font-medium">
              Biểu đồ sẽ được thêm ở đây
            </p>
            <p className="text-xs text-muted-foreground">
              Chart implementation coming soon
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * TablePlaceholder - Placeholder for data tables
 */
export function TablePlaceholder({
  title,
  description,
  rows = 5,
  className,
  ...props
}) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        {description && (
          <CardDescription className="text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="h-12 bg-muted/40 rounded animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Dữ liệu sẽ được hiển thị ở đây
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * FeaturePlaceholder - Placeholder for upcoming features
 */
export function FeaturePlaceholder({
  icon: Icon,
  title,
  description,
  comingSoon = true,
  className,
  ...props
}) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardContent className="pt-6">
        <div className="text-center space-y-4 py-8">
          {Icon && (
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
              <Icon className="h-8 w-8" />
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {description}
              </p>
            )}
            {comingSoon && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                <TrendingUp className="h-3 w-3" />
                Sắp ra mắt
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
