/**
 * Contract ABIs and addresses
 */

import cureTokenAbi from './cureToken.json';
import cureHookAbi from './cureHook.json';
import { getContractAddress } from '../config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CURE_TOKEN_ABI = (cureTokenAbi as any).abi;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CURE_HOOK_ABI = (cureHookAbi as any).abi;

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export function getCureTokenAddress(): `0x${string}` | null {
  const addr = getContractAddress('cureToken');
  if (!addr || addr === ZERO_ADDRESS) {
    return null;
  }
  if (!addr.startsWith('0x')) throw new Error('Invalid address format');
  return addr as `0x${string}`;
}

export function isContractConfigured(): boolean {
  const addr = getContractAddress('cureToken');
  return !!(addr && addr !== ZERO_ADDRESS);
}

export function getCureHookAddress(): `0x${string}` | undefined {
  const addr = getContractAddress('cureHook');
  if (!addr) return undefined;
  if (!addr.startsWith('0x')) return undefined;
  return addr as `0x${string}`;
}
