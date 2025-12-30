'use client';

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils/clipboard';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
}

export function CopyButton({ text, className, variant = 'outline', size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      size={size}
      className={cn('font-mono text-xs', className)}
      aria-label={`Copy ${text} to clipboard`}
    >
      {copied ? 'Copied' : 'Copy'}
    </Button>
  );
}

