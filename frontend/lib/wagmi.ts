/**
 * Wagmi configuration for wallet connection and contract interactions
 */

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { config } from './config';

// Determine which chain to use based on config
const chains = config.chain.id === 1 
  ? [mainnet] as const
  : config.chain.id === 11155111 
  ? [sepolia] as const
  : [hardhat] as const;

export const wagmiConfig = getDefaultConfig({
  appName: config.app.name,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  chains,
  ssr: true,
});
