import React from 'react';
import { cn } from '@/lib/utils';

interface GeometricLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const GeometricLogo: React.FC<GeometricLogoProps> = ({ 
  size = 40, 
  className,
  showText = true 
}) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Hexagon with medical plus symbol - matching OG image */}
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Hexagon outline */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="text-primary-500"
        >
          <polygon
            points="50,5 85,25 85,75 50,95 15,75 15,25"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="drop-shadow-sm"
          />
        </svg>
        
        {/* Medical plus symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width={size * 0.4}
            height={size * 0.4}
            viewBox="0 0 24 24"
            className="text-primary-500"
          >
            {/* Horizontal bar */}
            <rect x="6" y="11" width="12" height="2" fill="currentColor" />
            {/* Vertical bar */}
            <rect x="11" y="6" width="2" height="12" fill="currentColor" />
          </svg>
        </div>
      </div>
      
      {/* Text */}
      {showText && (
        <span 
          className="font-bold tracking-tight text-text"
          style={{ fontSize: size * 0.4 }}
        >
          CURE
        </span>
      )}
    </div>
  );
};

export default GeometricLogo;