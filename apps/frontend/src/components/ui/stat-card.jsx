import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * StatCard - Reusable statistics card component
 * Used in Dashboard and other admin pages
 */
export function StatCard({ 
  title, 
  value, 
  label, 
  delta, 
  deltaType = 'neutral', 
  icon: Icon, 
  className,
  ...props 
}) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {label && (
          <p className="text-xs text-muted-foreground">
            {label}
          </p>
        )}
        {delta && delta !== '0%' && (
          <div className={cn(
            "flex items-center pt-1 text-xs",
            deltaType === 'increase' && 'text-emerald-500 dark:text-emerald-400',
            deltaType === 'decrease' && 'text-rose-500 dark:text-rose-400',
            deltaType === 'neutral' && 'text-muted-foreground'
          )}>
            <ArrowUpRight className="mr-1 h-3 w-3" />
            {delta}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
