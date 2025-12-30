import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-surface-3 text-text border border-border-dark',
      success: 'bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/30',
      warning: 'bg-[var(--accent)] text-text-muted border border-border-dark',
      error: 'bg-red-500/20 text-red-400 border border-red-500/30',
      info: 'bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/30',
    };

    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
