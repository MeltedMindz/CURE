import React from 'react';
import { CopyButton } from '@/components/CopyButton';

interface DonationRowProps {
  label: string;
  value: string;
  showCopy?: boolean;
}

export function DonationRow({ label, value, showCopy = true }: DonationRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-surface-3 rounded-lg border border-border-dark">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-text-muted mb-1">{label}</div>
        <div className={value === 'not yet published' ? 'text-sm text-text-muted' : 'font-mono text-sm text-text break-all'}>
          {value}
        </div>
      </div>
      {showCopy && value !== 'not yet published' && (
        <div className="flex-shrink-0">
          <CopyButton text={value} />
        </div>
      )}
    </div>
  );
}
