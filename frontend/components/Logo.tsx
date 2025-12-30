import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: number;
  variant?: 'mark' | 'lockup';
  className?: string;
}

interface SymbolProps {
  size: number;
}

function Symbol({ size }: SymbolProps) {
  const primaryColor = 'rgb(142, 118, 255)';
  const dividerColor = '#0B1220';
  const strokeWidth = 5;
  const viewBoxSize = 100;
  const center = viewBoxSize / 2;
  const radius = 46;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      {/* Outer circle stroke */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke={primaryColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Left half fill */}
      <path
        d={`M${center} ${center - radius + strokeWidth / 2} A${radius - strokeWidth / 2} ${radius - strokeWidth / 2} 0 0 0 ${center} ${center + radius - strokeWidth / 2} Z`}
        fill={primaryColor}
      />
      {/* Divider line */}
      <line
        x1={center}
        y1={center - radius + strokeWidth / 2}
        x2={center}
        y2={center + radius - strokeWidth / 2}
        stroke={dividerColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export function Logo({ size = 28, variant = 'lockup', className }: LogoProps) {
  const primaryColor = 'rgb(142, 118, 255)';

  if (variant === 'mark') {
    return (
      <span className={cn('inline-flex items-center', className)} aria-label="CURE Onchain">
        <Symbol size={size} />
      </span>
    );
  }

  // Lockup variant with text
  const textSize = size;
  const gap = Math.max(10, Math.min(14, Math.round(size * 0.5))); // 10-14px gap

  return (
    <span
      className={cn('inline-flex items-center', className)}
      aria-label="CURE Onchain"
    >
      <Symbol size={size} />
      <span className="flex flex-col leading-none" style={{ marginLeft: `${gap}px` }}>
        <span
          className="font-bold"
          style={{
            fontSize: `${textSize}px`,
            color: primaryColor,
            lineHeight: 1,
          }}
        >
          CURE
        </span>
        <span
          className="text-text-muted"
          style={{
            fontSize: `${Math.round(textSize * 0.5)}px`,
            lineHeight: 1,
          }}
        >
          Onchain
        </span>
      </span>
    </span>
  );
}
