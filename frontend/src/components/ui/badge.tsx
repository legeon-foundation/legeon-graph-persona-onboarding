'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const variantStyles = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  outline: 'text-foreground',
  success: 'border-transparent bg-success/20 text-success',
  warning: 'border-transparent bg-warning/20 text-warning',
  destructive: 'border-transparent bg-destructive/20 text-red-400',
  muted: 'border-transparent bg-muted text-muted-foreground',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantStyles
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
