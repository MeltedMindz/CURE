import React from 'react';
import { cn } from '@/lib/utils';

interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  ({ className, label, value, description, trend = 'neutral', ...props }, ref) => {
    const formatValue = (val: string | number): string => {
      if (typeof val === 'number') {
        return val.toLocaleString();
      }
      return val;
    };

    // Extract percentage value for accent color
    const isPercentage = typeof value === 'string' && value.includes('%');
    const valueDisplay = formatValue(value);

    return (
      <div ref={ref} className={cn('', className)} {...props}>
        <div className="text-sm font-medium text-text-muted mb-2">{label}</div>
        <div className={cn('text-3xl font-bold mb-2', {
          'text-[var(--primary)]': isPercentage,
          'text-text': !isPercentage,
        })}>
          {valueDisplay}
        </div>
        {description && (
          <div className={cn('text-xs mt-1', {
            'text-[var(--primary)]': trend === 'up',
            'text-red-400': trend === 'down',
            'text-text-muted': trend === 'neutral',
          })}>
            {description}
          </div>
        )}
      </div>
    );
  }
);

Stat.displayName = 'Stat';
