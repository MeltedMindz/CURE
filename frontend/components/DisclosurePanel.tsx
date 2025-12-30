import React from 'react';
import { Collapsible } from '@/components/ui/Collapsible';

interface DisclosurePanelProps {
  title: string;
  content: readonly string[];
}

export function DisclosurePanel({ title, content }: DisclosurePanelProps) {
  return (
    <Collapsible title={title}>
      <div className="space-y-3 text-gray-700">
        {content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </Collapsible>
  );
}

