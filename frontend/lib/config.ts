/**
 * CURE Frontend Configuration
 * Central configuration for contract addresses, chain settings, and app constants
 */

export const config = {
  // Contract addresses (set via environment variables or localStorage)
  contracts: {
    cureToken: process.env.NEXT_PUBLIC_CURE_TOKEN_ADDRESS || '',
    cureHook: process.env.NEXT_PUBLIC_CURE_HOOK_ADDRESS || '',
    uniswapV2Router: process.env.NEXT_PUBLIC_UNISWAP_V2_ROUTER || '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    usdc: process.env.NEXT_PUBLIC_USDC_ADDRESS || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    charityWallet: process.env.NEXT_PUBLIC_CHARITY_WALLET || '0xd0fcC6215D88ff02a75C377aC19af2BB6ff225a2',
  },

  // Chain configuration
  chain: {
    id: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1'), // Default to mainnet
    name: process.env.NEXT_PUBLIC_CHAIN_NAME || 'Ethereum',
  },

  // RPC URLs
  rpc: {
    http: process.env.NEXT_PUBLIC_RPC_URL || '',
  },

  // App metadata
  app: {
    name: 'CURE Token',
    description: 'Where Trading Meets Impact',
    charity: {
      name: 'St. Jude Children\'s Research Hospital',
      address: '0xd0fcC6215D88ff02a75C377aC19af2BB6ff225a2',
    },
  },

  // Uniswap v4 pool link (update with actual pool address when deployed)
  uniswapPoolLink: process.env.NEXT_PUBLIC_UNISWAP_POOL_LINK || '',
} as const;

/**
 * Get contract address from localStorage if not set in env
 */
export function getContractAddress(contractName: keyof typeof config.contracts): string {
  if (typeof window === 'undefined') return config.contracts[contractName];
  
  const stored = localStorage.getItem(`cure_${contractName}`);
  if (stored) return stored;
  
  return config.contracts[contractName];
}

/**
 * Set contract address in localStorage
 */
export function setContractAddress(contractName: keyof typeof config.contracts, address: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`cure_${contractName}`, address);
}

