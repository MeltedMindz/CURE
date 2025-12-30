/**
 * Brand system configuration for CURE Onchain
 * Defines color palette, typography, and design tokens
 * 
 * Note: Site metadata (name, URL, description) is now in src/config/site.ts
 * This file is kept for backward compatibility and will be deprecated.
 */

import { siteConfig } from '@/src/config/site';

export const brand = {
  site: {
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.defaultDescription,
  },
} as const;
