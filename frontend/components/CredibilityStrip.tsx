import React from 'react';

interface CredibilityStripProps {
  bullets: readonly string[];
}

export function CredibilityStrip({ bullets }: CredibilityStripProps) {
  return (
    <div className="bg-surface-2 border-y border-border-dark py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {bullets.map((bullet, index) => (
              <div key={index} className="flex items-center justify-center gap-2 text-sm text-text-muted">
                <svg className="w-4 h-4 text-[var(--primary)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
