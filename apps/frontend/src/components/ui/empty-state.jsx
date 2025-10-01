import { cn } from '@/lib/utils'

/**
 * EmptyState - Reusable empty state component
 * Used when no data is available
 */
export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className,
  ...props 
}) {
  return (
    <div className={cn("text-center py-12", className)} {...props}>
      {Icon && <Icon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />}
      {title && (
        <h3 className="text-lg font-medium text-foreground mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-muted-foreground mb-4">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}

/**
 * TableEmptyState - Empty state for tables
 */
export function TableEmptyState({ 
  colSpan, 
  icon: Icon, 
  title, 
  description,
  ...props 
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-12">
        <EmptyState 
          icon={Icon}
          title={title}
          description={description}
          {...props}
        />
      </td>
    </tr>
  )
}
