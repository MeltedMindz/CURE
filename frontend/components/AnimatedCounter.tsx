'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  targetValue: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  targetValue,
  duration = 2000,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Extract numeric value from targetValue (handles percentages, etc.)
    const numericMatch = targetValue.match(/[\d.]+/);
    if (!numericMatch) {
      setDisplayValue(targetValue);
      return;
    }

    const numericValue = parseFloat(numericMatch[0]);
    const prefix = targetValue.substring(0, targetValue.indexOf(numericMatch[0]));
    const suffix = targetValue.substring(targetValue.indexOf(numericMatch[0]) + numericMatch[0].length);

    let startTime: number;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (numericValue - startValue) * easeOutCubic;
      
      // Format the number to match original formatting
      let formattedValue: string;
      if (targetValue.includes('.')) {
        const decimalPlaces = numericMatch[0].split('.')[1]?.length || 0;
        formattedValue = currentValue.toFixed(decimalPlaces);
      } else {
        formattedValue = Math.floor(currentValue).toString();
      }
      
      setDisplayValue(prefix + formattedValue + suffix);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, targetValue, duration]);

  return (
    <span ref={elementRef} className={className}>
      {displayValue}
    </span>
  );
};

export default AnimatedCounter;