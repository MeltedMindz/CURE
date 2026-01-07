import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Stat } from '@/components/ui/Stat';

interface StatCardProps {
  label: string;
  value: string;
  description?: string;
}

export function StatCard({ label, value, description }: StatCardProps) {
  return (
    <Card variant="elevated" className="hover:shadow-xl hover:shadow-[var(--primary)]/10 transition-all duration-300 group">
      <CardContent className="pt-6">
        <div className="relative">
          {/* Small geometric accent */}
          <div className="absolute -top-2 -right-2 w-4 h-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <svg
              width="16"
              height="16"
              viewBox="0 0 100 100"
              className="text-primary-500"
            >
              <polygon
                points="50,5 85,25 85,75 50,95 15,75 15,25"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </div>
          <Stat label={label} value={value} description={description} />
        </div>
      </CardContent>
    </Card>
  );
}
