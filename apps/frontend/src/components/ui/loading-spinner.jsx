import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * LoadingSpinner - Reusable loading component
 * Used across all pages for consistent loading states
 */
export function LoadingSpinner({
  size = "default",
  icon: Icon = RefreshCw,
  text,
  className,
  ...props
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div
      className={cn("flex flex-col items-center gap-2 text-center", className)}
      {...props}
    >
      <Icon
        className={cn("animate-spin text-muted-foreground", sizeClasses[size])}
      />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

/**
 * LoadingPage - Full page loading component
 */
export function LoadingPage({ text = "Đang tải...", icon, ...props }) {
  return (
    <div className="flex items-center justify-center h-96" {...props}>
      <LoadingSpinner size="lg" text={text} icon={icon} />
    </div>
  );
}

/**
 * LoadingCard - Card with loading state
 */
export function LoadingCard({
  text = "Đang tải...",
  height = "h-[200px]",
  ...props
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-dashed",
        height,
      )}
      {...props}
    >
      <LoadingSpinner text={text} />
    </div>
  );
}
