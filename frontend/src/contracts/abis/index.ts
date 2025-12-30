/**
 * Contract ABIs
 * 
 * Import contract ABIs from this module.
 * To update ABIs after contract changes:
 * 1. Replace the JSON files in this directory with updated ABIs from compilation
 * 2. Ensure JSON files are properly formatted and valid
 * 3. The TypeScript compiler will catch any import errors
 */

import CureTokenAbi from './CureToken.json';
import CureHookAbi from './CureHook.json';

// Export ABIs with proper typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CURE_TOKEN_ABI = (CureTokenAbi as any).abi;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CURE_HOOK_ABI = (CureHookAbi as any).abi;

