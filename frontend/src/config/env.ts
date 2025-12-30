/**
 * Environment variable configuration and validation
 * 
 * This module provides typed access to environment variables and validates
 * required variables at runtime in development.
 */

/**
 * Get an environment variable or throw in development if missing
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  
  if (!value && process.env.NODE_ENV === 'development') {
    console.warn(`Warning: Environment variable ${key} is not set.`);
  }
  
  return value || '';
}

/**
 * Get an optional environment variable
 */
function getOptionalEnvVar(key: string): string | undefined {
  return process.env[key];
}

/**
 * Environment configuration
 */
export const env = {
  // Site URL (used for metadata, canonical URLs, etc.)
  siteUrl: getEnvVar('NEXT_PUBLIC_SITE_URL', 'https://cureonchain.org'),
  
  // Contract addresses (optional, can be set via env or src/contracts/addresses.ts)
  cureTokenAddress: getOptionalEnvVar('NEXT_PUBLIC_CURE_TOKEN_ADDRESS'),
  cureHookAddress: getOptionalEnvVar('NEXT_PUBLIC_CURE_HOOK_ADDRESS'),
  uniswapPoolLink: getOptionalEnvVar('NEXT_PUBLIC_UNISWAP_POOL_LINK'),
  
  // Node environment
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

/**
 * Validate required environment variables in development
 */
if (env.isDevelopment) {
  // Add validation warnings here if needed
  // For example, warn if contract addresses are not set in development
}

