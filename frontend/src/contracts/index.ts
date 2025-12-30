/**
 * Contract configuration exports
 * 
 * This module provides a unified interface for accessing contract addresses,
 * ABIs, and chain configuration throughout the application.
 */

export * from './chains';
export * from './addresses';

import { getChainConfig } from './chains';
import { getAddresses } from './addresses';

/**
 * Generate an explorer link for an address
 */
export function getExplorerLink(
  chainId: number,
  address: string,
  type: 'address' | 'tx' = 'address'
): string | undefined {
  const chain = getChainConfig(chainId);
  if (!chain) return undefined;
  
  return `${chain.explorerBaseUrl}/${type}/${address}`;
}

/**
 * Get the primary contract address (cureToken) for a chain
 */
export function getPrimaryContractAddress(chainId: number): `0x${string}` | null {
  const addresses = getAddresses(chainId);
  if (!addresses) return null;
  
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
  if (addresses.cureToken.toLowerCase() === ZERO_ADDRESS.toLowerCase()) {
    return null;
  }
  
  return addresses.cureToken;
}

