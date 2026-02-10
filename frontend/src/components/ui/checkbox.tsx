'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps {
  id?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
  className?: string
}

function Checkbox({
  id,
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className,
}: CheckboxProps) {
  const inputId = id || `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'flex items-start gap-3 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="flex items-center pt-0.5">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          disabled={disabled}
          className={cn(
            'h-4 w-4 shrink-0 rounded border border-input bg-background',
            'appearance-none cursor-pointer',
            'checked:bg-primary checked:border-primary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed',
            'relative',
            // Checkmark via pseudo-element simulation with border trick
          )}
          style={{
            backgroundImage: checked
              ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath d='M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0z'/%3E%3C/svg%3E")`
              : undefined,
            backgroundSize: '100% 100%',
          }}
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium leading-tight">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground leading-snug">{description}</span>
        )}
      </div>
    </label>
  )
}

export { Checkbox }
