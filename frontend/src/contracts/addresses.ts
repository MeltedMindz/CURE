/**
 * Contract addresses by chain ID
 * 
 * Update this file with deployed contract addresses after deployment.
 * Use placeholder addresses (0x0000...0000) for chains that are not yet deployed.
 */

export interface ContractAddresses {
  cureToken: `0x${string}`;
  cureHook?: `0x${string}`;
  uniswapPool?: `0x${string}`;
  charityRecipient?: `0x${string}`;
}

/**
 * Contract addresses by chain ID
 * 
 * To update addresses after deployment:
 * 1. Replace placeholder addresses with actual deployed addresses
 * 2. Remove the placeholder comment for deployed chains
 * 3. Verify addresses are correct by checking deployment transactions
 */
export const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = {
  // Ethereum Mainnet
  1: {
    cureToken: '0x0000000000000000000000000000000000000000', // PLACEHOLDER: Update after deployment
    cureHook: undefined, // PLACEHOLDER: Update after deployment
    uniswapPool: undefined, // PLACEHOLDER: Update after deployment
    charityRecipient: undefined, // PLACEHOLDER: Update with St. Jude recipient address
  },
  // Sepolia Testnet
  11155111: {
    cureToken: '0x0000000000000000000000000000000000000000', // PLACEHOLDER: Update after deployment
    cureHook: undefined, // PLACEHOLDER: Update after deployment
    uniswapPool: undefined, // PLACEHOLDER: Update after deployment
    charityRecipient: undefined, // PLACEHOLDER: Update with St. Jude recipient address
  },
};

/**
 * Get contract addresses for a chain
 */
export function getAddresses(chainId: number): ContractAddresses | undefined {
  return CONTRACT_ADDRESSES[chainId];
}

/**
 * Check if contracts are deployed for a chain
 */
export function isChainDeployed(chainId: number): boolean {
  const addresses = CONTRACT_ADDRESSES[chainId];
  if (!addresses) return false;
  
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  return addresses.cureToken.toLowerCase() !== ZERO_ADDRESS.toLowerCase();
}

