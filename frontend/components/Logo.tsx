'use client';

import React from 'react';

interface LogoProps {
  variant?: 'mark' | 'lockup';
  size?: number;
  className?: string;
}

// Symbol component for the logo mark (without divider for UI)
function Symbol({
  size = 30,
  className = '',
}: {
  size: number;
  className?: string;
}) {
  const primaryColor = 'rgb(142, 118, 255)';
  const viewBox = '0 0 100 100';

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer circle stroke */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke={primaryColor}
        strokeWidth="4"
        fill="none"
      />
      {/* Left half fill - creates the split visually without a divider line */}
      <path
        d="M50 8 A42 42 0 0 0 50 92 Z"
        fill={primaryColor}
      />
      {/* Right half is transparent (background shows through) */}
    </svg>
  );
}

export function Logo({ variant = 'lockup', size = 32, className = '' }: LogoProps) {
  const primaryColor = 'rgb(142, 118, 255)';
  const cureColor = primaryColor;
  const onchainColor = 'rgba(255, 255, 255, 0.78)';

  // Mark-only variant
  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Symbol size={size} />
      </div>
    );
  }

  // Lockup variant (Option A: Two-line with soft split mark)
  // Typography sizing relationships
  const cureSize = size; // CURE font size matches size prop (28-32px for desktop nav)
  const onchainSize = Math.round(cureSize * 0.58); // Onchain is 58% of CURE size
  const iconSize = Math.round(size * 1.05); // Icon slightly larger than CURE text

  // Spacing
  const verticalGap = 2; // Tight gap between CURE and Onchain lines
  const horizontalGap = 14; // Gap between icon and text block

  return (
    <div
      className={`inline-flex items-center ${className}`}
      style={{ gap: `${horizontalGap}px` }}
      aria-label="CURE Onchain"
    >
      {/* Icon */}
      <div className="flex-shrink-0" style={{ transform: 'translateY(0px)' }}>
        <Symbol size={iconSize} />
      </div>

      {/* Text block - two lines */}
      <div className="flex flex-col" style={{ lineHeight: 1 }}>
        {/* CURE */}
        <span
          style={{
            fontSize: `${cureSize}px`,
            fontWeight: 750, // Use 750 if available, falls back to 700
            lineHeight: 1.05,
            color: cureColor,
            letterSpacing: '-0.01em',
          }}
          className="font-bold"
        >
          CURE
        </span>

        {/* Onchain */}
        <span
          style={{
            fontSize: `${onchainSize}px`,
            fontWeight: 500,
            lineHeight: 1.1,
            color: onchainColor,
            marginTop: `${verticalGap}px`,
            letterSpacing: '0',
          }}
          className="font-medium"
        >
          Onchain
        </span>
      </div>
    </div>
  );
}
