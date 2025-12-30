'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function Collapsible({ title, children, className, defaultOpen = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<number | string>(defaultOpen ? 'auto' : 0);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonId = `collapsible-button-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const contentId = `collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`;

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setHeight(contentRef.current.scrollHeight);
      } else {
        setHeight(0);
      }
    }
  }, [isOpen, children]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className={cn('border border-gray-200 rounded-xl overflow-hidden bg-white', className)}>
      <button
        id={buttonId}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors"
      >
        <span className="text-lg font-semibold text-gray-900">{title}</span>
        <svg
          className={cn('w-5 h-5 text-gray-500 transition-transform duration-200', {
            'rotate-180': isOpen,
          })}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        id={contentId}
        ref={contentRef}
        role="region"
        aria-labelledby={buttonId}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

