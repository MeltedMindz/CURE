/**
 * Site configuration - single source of truth for site metadata and URLs
 */

export const siteConfig = {
  name: 'CURE Onchain',
  url: 'https://cureonchain.org',
  defaultTitle: 'CURE Onchain | Where Trading Meets Impact',
  defaultDescription:
    'CURE Onchain is a DeFi protocol that routes onchain trading fees to pediatric cancer research through transparent smart contracts.',
  keywords: ['CURE', 'DeFi', 'charity', 'St. Jude', 'trading fees', 'onchain', 'ethereum'] as string[],
};

export type SiteConfig = typeof siteConfig;

