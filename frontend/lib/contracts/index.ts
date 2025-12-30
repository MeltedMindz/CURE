/**
 * Contract ABIs and addresses
 * 
 * NOTE: This file is deprecated. Use src/contracts/index.ts instead.
 * This file is kept for backward compatibility during migration.
 * 
 * Migration path:
 * - Import contract ABIs from @/src/contracts/abis
 * - Import address utilities from @/src/contracts
 * - Update any code using getCureTokenAddress() to use getPrimaryContractAddress() from src/contracts
 */

import { getPrimaryContractAddress, isChainDeployed } from '@/src/contracts';
import { CURE_TOKEN_ABI as NewCureTokenAbi, CURE_HOOK_ABI as NewCureHookAbi } from '@/src/contracts/abis';

// Re-export ABIs for backward compatibility
export const CURE_TOKEN_ABI = NewCureTokenAbi;
export const CURE_HOOK_ABI = NewCureHookAbi;

/**
 * @deprecated Use getPrimaryContractAddress(chainId) from @/src/contracts instead
 */
export function getCureTokenAddress(): `0x${string}` | null {
  // Default to chain ID 1 (mainnet) for backward compatibility
  // This should be updated to use the actual chain ID from wagmi context
  const chainId = 1;
  return getPrimaryContractAddress(chainId);
}

/**
 * @deprecated Use isChainDeployed(chainId) from @/src/contracts instead
 */
export function isContractConfigured(): boolean {
  const chainId = 1; // Default to mainnet
  return isChainDeployed(chainId);
}

/**
 * @deprecated This function is deprecated. Use getAddresses(chainId) from @/src/contracts instead
 */
export function getCureHookAddress(): `0x${string}` | undefined {
  // This function is deprecated and should not be used
  // Use getAddresses(chainId) from @/src/contracts instead
  return undefined;
}
