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
    <Card variant="elevated" className="hover:shadow-xl hover:shadow-black/30 transition-shadow">
      <CardContent className="pt-6">
        <Stat label={label} value={value} description={description} />
      </CardContent>
    </Card>
  );
}
