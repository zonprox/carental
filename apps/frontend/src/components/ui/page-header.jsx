import { cn } from '@/lib/utils'

/**
 * PageHeader - Reusable page title component
 * Inspired by shadcn/ui Dashboard example
 * Ensures consistent styling across all admin pages
 */
export function PageHeader({ title, description, children, className, ...props }) {
  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  )
}

/**
 * PageContent - Wrapper for page content
 */
export function PageContent({ children, className, ...props }) {
  return (
    <div className={cn("flex-1 space-y-4", className)} {...props}>
      {children}
    </div>
  )
}

/**
 * PageContainer - Full page wrapper with consistent padding
 */
export function PageContainer({ children, className, ...props }) {
  return (
    <div className={cn("flex-1 space-y-6 p-6 md:p-8 lg:p-10", className)} {...props}>
      {children}
    </div>
  )
}

