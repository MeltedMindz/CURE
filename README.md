# CURE Token - PvPvE Uniswap v4 Experiment

$CURE is a PvPvE experiment. On-chain, players fight each other for entries, exits, and a 1% caller reward. Under the hood, every trade skims ETH that is forced to both buy back and burn the token and donate an equal amount of value to St. Jude. For every dollar that benefits holders, a dollar goes to fight cancer.

## Overview

CURE is a token built on Uniswap v4 with a unique PvPvE (Player vs Player vs Environment) mechanism that combines competitive trading with charitable giving.

### Core Properties

#### Uniswap v4 Based Tax
- Single official CURE/ETH v4 pool with a custom hook (`CureHook`)
- Hook skims ETH as a fee on every swap (no ERC20 transfer tax)
- Fee starts at **99%** on both buys and sells
- Decays by **1% per block** until it hits **1%**, where it stays forever

#### ETH-Only Fees
- Fees are taken in ETH, not in CURE tokens
- No sell pressure from the contract
- `CureHook` sends ETH to the token contract via `addFees()` or `receive()`

#### PvPvE Split: Equal Value to Holders and Charity
- `CureToken` accumulates ETH from the hook
- Anyone can call `processFees()`:
  - **1%** caller reward (in ETH) paid to `msg.sender`
  - Remaining **99%** of ETH is split:
    - **50%** → swap ETH → USDC → sent to St. Jude charity wallet
    - **50%** → swap ETH → CURE → burn (send to `address(0)`)
- **For every unit of value used to buy back and burn CURE (benefiting holders), the same unit of value is donated to charity.**

#### No Wallet-to-Wallet Transfers
- `CureToken` overrides `_update` and blocks all non-mint, non-burn transfers unless `midSwap` flag is set
- Only the Uniswap v4 hook can toggle this `midSwap` flag via `setMidSwap(true/false)`
- This means:
  - ❌ No wallet-to-wallet transfers
  - ❌ No arbitrary routers / side DEXes
  - ❌ No one can create a side pool (can't move tokens without the hook)

#### Time-Distributed Buybacks
- `processFees()` does not always use 100% of the ETH in the contract
- Amount of ETH that can be used per call is a function of:
  - Blocks elapsed since last `processFees()` call
  - Constant `BUYBACK_PERIOD_BLOCKS` (100 blocks)
- Over roughly `BUYBACK_PERIOD_BLOCKS` blocks, repeated calls gradually flush the full ETH buffer
- Makes buybacks time-distributed and harder to game in a single transaction
- Still permissionless and bot-callable

#### Pure Degen Design
- No multisig controlling transfers
- No vesting contracts
- No staking contracts
- The only "special" on-chain actor is the Uniswap v4 hook address
- Ownership may optionally be renounced once configuration is finalized

## Architecture

### Contracts

#### `CureToken.sol`
- ERC20 token with name "Cure Token" and symbol "CURE"
- Implements transfer restrictions via `_update()` override
- Manages fee processing with block-based drip mechanism
- Handles ETH → USDC swaps for charity
- Handles ETH → CURE swaps for buyback and burn

#### `CureHook.sol`
- Uniswap v4 hook that implements swap fees
- Calculates fee based on blocks since deployment (99% → 1% decay)
- Takes ETH fees from pool and forwards to `CureToken`
- Manages `midSwap` flag to allow transfers during swaps

### PvP Layer
- **Traders, bots, and snipers** fight for:
  - Optimal entry points
  - Exit timing
  - The **1% caller reward** from `processFees()`

### PvE Layer
- Every trade skims ETH that is forced on-chain to:
  - Buy back and burn CURE (benefiting holders)
  - Donate equal value to St. Jude Children's Research Hospital

## Project Structure

```
CURE/
├── contracts/
│   ├── CureToken.sol              # Main token contract
│   ├── CureHook.sol               # Uniswap v4 hook
│   ├── interfaces/
│   │   └── ICureTokenMinimal.sol  # Interface for hook-token interaction
│   └── mocks/
│       ├── MockRouter.sol         # Mock router for testing
│       ├── MockERC20.sol          # Mock ERC20 for testing
│       └── MockPoolManager.sol    # Mock pool manager for testing
├── scripts/
│   └── deploy.ts                  # Deployment script
├── test/
│   ├── CureToken.test.ts          # Token contract tests
│   └── CureHook.test.ts           # Hook contract tests
├── hardhat.config.ts              # Hardhat configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
└── README.md                       # This file
```

## Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Hardhat

### Installation

```bash
npm install
```

### Compile

```bash
npm run compile
```

### Test

```bash
npm run test
```

### Deploy

1. Create a `.env` file with:
```env
PRIVATE_KEY=your_private_key
UNISWAP_V2_ROUTER=0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
USDC_ADDRESS=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
CHARITY_WALLET=0x... # St. Jude wallet address
POOL_MANAGER_ADDRESS=0x... # Uniswap v4 PoolManager address
INITIAL_SUPPLY=1000000000
```

2. Run deployment:
```bash
npm run deploy
```

## Deployment Steps

1. Deploy `CureToken` with router, USDC, charity wallet, and initial supply
2. Deploy `CureHook` with PoolManager and CureToken addresses
3. Set hook on token: `cureToken.setHook(cureHookAddress)`
4. Create Uniswap v4 pool with `CureHook`
5. Initialize the pool (sets `deploymentBlock` in hook)
6. Add initial liquidity (e.g., 0.01 ETH + corresponding CURE tokens)
7. Verify contracts on Etherscan
8. (Optional) Renounce ownership after configuration is finalized

## Key Features

### Fee Decay Mechanism
- Starts at 99% fee at deployment
- Decays by 1% per block
- Reaches 1% after 98 blocks
- Stays at 1% forever

### Block-Based Drip
- `processFees()` uses a fraction of ETH based on blocks elapsed
- Prevents single-block gaming
- Allows gradual utilization over `BUYBACK_PERIOD_BLOCKS` (100 blocks)

### Transfer Restrictions
- Only Uniswap v4 pool operations can move tokens
- No wallet-to-wallet transfers
- No side pools possible
- Forces all trading through official pool

## Security Considerations

- Contracts use OpenZeppelin's `ReentrancyGuard`
- Transfer restrictions prevent unauthorized token movement
- Hook-only `midSwap` control prevents bypass
- Block-based drip prevents manipulation

## License

MIT

## Disclaimer

This is an experimental project. Use at your own risk. Always conduct thorough audits before deploying to mainnet.
