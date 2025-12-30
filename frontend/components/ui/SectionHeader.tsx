import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ title, className, align = 'center' }: SectionHeaderProps) {
  return (
    <h2 className={cn(
      'text-3xl font-bold text-text mb-12',
      align === 'center' ? 'text-center' : 'text-left',
      className
    )}>
      {title}
    </h2>
  );
}
