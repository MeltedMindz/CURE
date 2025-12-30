/**
 * Supported blockchain networks configuration
 */

export interface ChainConfig {
  chainId: number;
  name: string;
  explorerBaseUrl: string;
  nativeCurrency: {
    symbol: string;
    decimals: number;
  };
  rpcUrl?: string;
}

/**
 * Supported chains for CURE Onchain
 */
export const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    chainId: 1,
    name: 'Ethereum Mainnet',
    explorerBaseUrl: 'https://etherscan.io',
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
  },
  {
    chainId: 11155111,
    name: 'Sepolia',
    explorerBaseUrl: 'https://sepolia.etherscan.io',
    nativeCurrency: {
      symbol: 'ETH',
      decimals: 18,
    },
  },
];

/**
 * Get chain configuration by chain ID
 */
export function getChainConfig(chainId: number): ChainConfig | undefined {
  return SUPPORTED_CHAINS.find((chain) => chain.chainId === chainId);
}

/**
 * Check if a chain ID is supported
 */
export function isSupportedChain(chainId: number): boolean {
  return SUPPORTED_CHAINS.some((chain) => chain.chainId === chainId);
}

