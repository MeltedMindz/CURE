# Contract Update Guide

This guide explains how to update contract addresses, ABIs, and chain configuration after deployment.

## Overview

Contract configuration is centralized in the `src/contracts/` directory:

- **`src/contracts/chains.ts`** - Chain configurations (Ethereum, Sepolia, etc.)
- **`src/contracts/addresses.ts`** - Contract addresses by chain ID
- **`src/contracts/abis/`** - Contract ABI JSON files
- **`src/contracts/index.ts`** - Helper functions and exports

## Updating Contract Addresses

After deploying contracts to a network, update `src/contracts/addresses.ts`:

```typescript
export const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = {
  // Ethereum Mainnet
  1: {
    cureToken: '0x...', // Replace placeholder with actual address
    cureHook: '0x...',  // Replace placeholder with actual address
    uniswapPool: '0x...', // Replace placeholder with actual pool address
    charityRecipient: '0x...', // Replace with St. Jude recipient address
  },
  // ... other chains
};
```

### Steps

1. Deploy contracts to your target network
2. Copy deployed addresses from deployment transaction logs
3. Open `src/contracts/addresses.ts`
4. Replace placeholder addresses (`0x0000...0000`) with actual addresses
5. Remove or update placeholder comments
6. Verify addresses are correct by checking deployment transactions on block explorer

### Verification

After updating addresses:

1. Run `npm run build` to ensure no TypeScript errors
2. Start dev server: `npm run dev`
3. Navigate to `/app` page
4. Connect wallet on the correct network
5. Verify contract information displays correctly
6. Test contract interactions (read functions should work)

## Updating Contract ABIs

When contracts are updated and recompiled, update the ABI files:

### Steps

1. Compile contracts using Hardhat (or your build tool)
2. Locate compiled ABI files (typically in `artifacts/` directory)
3. Copy the ABI JSON from the compiled artifact
4. Open the corresponding file in `src/contracts/abis/`:
   - `CureToken.json` for the token contract
   - `CureHook.json` for the hook contract
5. Replace the `abi` array with the new ABI
6. Keep the file structure intact (the JSON file should export an object with an `abi` property)

### Example

```json
{
  "_format": "hh-sol-artifact-1",
  "contractName": "CureToken",
  "sourceName": "contracts/CureToken.sol",
  "abi": [
    // ... paste new ABI array here
  ]
}
```

### Verification

After updating ABIs:

1. Run `npm run build` to check for import errors
2. Start dev server and test contract interactions
3. Verify read functions return expected data
4. Test write functions (if applicable)

## Adding New Chain Support

To support a new blockchain network:

### Steps

1. **Add chain configuration** in `src/contracts/chains.ts`:

```typescript
export const SUPPORTED_CHAINS: ChainConfig[] = [
  // ... existing chains
  {
    chainId: 137, // Polygon example
    name: 'Polygon',
    explorerBaseUrl: 'https://polygonscan.com',
    nativeCurrency: {
      symbol: 'MATIC',
      decimals: 18,
    },
  },
];
```

2. **Add contract addresses** in `src/contracts/addresses.ts`:

```typescript
export const CONTRACT_ADDRESSES: Record<number, ContractAddresses> = {
  // ... existing chains
  137: {
    cureToken: '0x...', // Deployed Polygon address
    cureHook: '0x...',
    // ... other addresses
  },
};
```

3. **Update wagmi configuration** in `lib/wagmi.ts` to include the new chain from `wagmi/chains`

4. **Deploy contracts** to the new network

5. **Test** contract interactions on the new network

## Environment Variables (Optional)

Contract addresses can also be set via environment variables for flexibility:

- `NEXT_PUBLIC_CURE_TOKEN_ADDRESS` - CURE token contract address
- `NEXT_PUBLIC_CURE_HOOK_ADDRESS` - CURE hook contract address
- `NEXT_PUBLIC_UNISWAP_POOL_LINK` - Uniswap pool link
- `NEXT_PUBLIC_CHAIN_ID` - Default chain ID

However, **prefer using `src/contracts/addresses.ts`** for version-controlled configuration.

## Backward Compatibility

The old contract configuration in `lib/contracts/index.ts` is deprecated but kept for backward compatibility. New code should use:

- `@/src/contracts` for address utilities
- `@/src/contracts/abis` for ABIs

## Testing Locally

After making changes:

```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build

# Run dev server
npm run dev
```

## Production Deployment

1. Update contract addresses in `src/contracts/addresses.ts`
2. Update ABIs if contracts changed
3. Commit changes
4. Push to repository
5. Deploy to production (Vercel, etc.)
6. Verify contract addresses in production environment
7. Test contract interactions on production site

## Troubleshooting

### Address not showing up

- Check that the chain ID matches your wallet network
- Verify the address is not a zero address
- Check browser console for errors
- Verify wagmi is configured for the chain

### ABI errors

- Ensure ABI JSON is valid
- Check that function names match between ABI and code
- Verify ABI is exported correctly from JSON file

### Contract not found

- Verify contract is deployed to the network
- Check address is correct (no typos)
- Verify chain ID matches deployed network
- Check contract is verified on block explorer

