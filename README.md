# CURE Token - Where Trading Meets Impact

**Every trade. Every swap. Every moment of market activity becomes a force for good.**

CURE is a revolutionary token that proves cryptocurrency can be both profitable and purposeful. Built on Uniswap v4, CURE transforms the competitive energy of DeFi trading into direct, measurable impact: **for every dollar that benefits token holders, a dollar goes to St. Jude Children's Research Hospital to fight childhood cancer.**

This isn't charity at the expense of returns. This is a new economic model where profit and purpose are perfectly aligned.

## The Vision

Cryptocurrency has the power to move billions, but too often, that value stays locked in speculative markets. CURE changes that. Every trade generates fees that are automatically split: half creates value for holders through buybacks and burns, half funds life-saving research at one of the world's leading pediatric cancer centers.

**The result?** A self-sustaining mechanism where the competitive drive of traders—the same force that creates volatility and opportunity—becomes the engine that funds real-world change.

## How It Works

### The Trading Mechanism

CURE operates on a single, official Uniswap v4 pool with a custom hook that captures ETH fees on every swap. The design is elegant in its simplicity:

1. **Fee Collection**: Every swap in the CURE/ETH pool generates an ETH fee
   - Fee starts at 99% and decays by 1% per block until reaching 1% (where it stays)
   - Fees are taken in ETH, not CURE tokens—no sell pressure on the token itself

2. **Automatic Processing**: Anyone can call `processFees()` to process accumulated ETH
   - 1% goes to the caller as a reward (incentivizing regular processing)
   - 99% is split equally:
     - **50%** → Swapped to USDC → Sent directly to St. Jude Children's Research Hospital
     - **50%** → Swapped to CURE → Permanently burned, reducing supply and benefiting holders

3. **The Balance**: This creates a perfect equilibrium where holder value and charitable impact grow in lockstep. As trading volume increases, both the token's value and the donations to St. Jude increase proportionally.

### Why This Matters

Traditional charity tokens often sacrifice holder value for donations, or vice versa. CURE eliminates that trade-off. The mechanism ensures that:

- **Holders benefit** from reduced supply through continuous burns
- **St. Jude receives** equal value in stable USDC donations
- **Traders compete** in a liquid market with transparent, on-chain mechanics
- **Impact is verifiable**—every donation is recorded on-chain

### The Competitive Edge

The trading environment remains fiercely competitive. Traders, bots, and sophisticated market participants compete for:
- Optimal entry and exit points
- The 1% caller reward from processing fees
- Market-making opportunities in the single official pool

This competition drives volume, and volume drives impact. The more active the market, the more value flows to both holders and St. Jude.

## Technical Architecture

### Core Contracts

#### `CureToken.sol`
The main ERC20 token contract that:
- Manages fee accumulation and processing
- Executes buyback-and-burn operations
- Handles charity donations via USDC swaps
- Implements transfer restrictions to ensure all trading flows through the official pool

#### `CureHook.sol`
The Uniswap v4 hook that:
- Captures ETH fees on every swap
- Implements the fee decay mechanism (99% → 1%)
- Forwards collected fees to the token contract
- Manages swap state to enable transfers during pool operations

### Key Features

#### Transfer Restrictions
- No wallet-to-wallet transfers allowed
- All trading must occur through the official Uniswap v4 pool
- Prevents side pools and ensures all volume contributes to the impact mechanism
- Only the official hook can enable transfers during swaps

#### Time-Distributed Buybacks
- Fees are processed gradually over blocks (not all at once)
- Prevents gaming and manipulation
- Creates sustainable, continuous impact
- Anyone can call `processFees()`—it's permissionless and bot-friendly

#### Transparent and Verifiable
- Every donation is on-chain and auditable
- Charity wallet: `0xd0fcC6215D88ff02a75C377aC19af2BB6ff225a2` (St. Jude Children's Research Hospital)
- Burn address: `0x000000000000000000000000000000000000dEaD`
- No hidden mechanisms, no multisig control, no opaque operations

## The Impact Model

### How Volume Creates Change

The beauty of CURE's design is its scalability:

- **Low volume**: Still generates donations, just at a smaller scale
- **High volume**: Creates significant impact for both holders and charity
- **Sustained volume**: Builds long-term value while funding ongoing research

Every ETH that flows through the pool becomes part of this dual-purpose mechanism. There's no minimum threshold, no waiting period, no gatekeeping. Impact happens continuously, automatically, and transparently.

### Real-World Connection

St. Jude Children's Research Hospital is one of the world's leading institutions in pediatric cancer research. By directing 50% of all trading fees to St. Jude, CURE creates a direct, measurable connection between DeFi activity and life-saving medical research.

This isn't abstract philanthropy. Every trade contributes to:
- Cancer research and treatment development
- Patient care for children fighting cancer
- Families who never receive a bill from St. Jude

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
CHARITY_WALLET=0xd0fcC6215D88ff02a75C377aC19af2BB6ff225a2 # St. Jude Children's Research Hospital
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
5. Initialize the pool (sets deployment block in hook for fee decay)
6. Add initial liquidity (e.g., 0.01 ETH + corresponding CURE tokens)
7. Verify contracts on Etherscan
8. (Optional) Renounce ownership after configuration is finalized

## Technical Details

### Fee Decay Mechanism
- Starts at 99% fee at pool initialization
- Decays by 1% per block (approximately 12 seconds per block on Ethereum)
- Reaches 1% after 98 blocks (~20 minutes)
- Stays at 1% permanently after decay period

### Block-Based Drip
- `processFees()` uses a fraction of accumulated ETH based on blocks elapsed
- Prevents single-block manipulation
- Allows gradual utilization over 100 blocks
- Creates sustainable, continuous processing

### Security Features
- OpenZeppelin's `ReentrancyGuard` for protection
- Transfer restrictions prevent unauthorized token movement
- Hook-only swap control ensures all trading goes through official pool
- Block-based drip prevents manipulation
- No multisig or centralized control points

## The Opportunity

CURE represents a new paradigm for cryptocurrency: **profit with purpose, trading with impact, speculation with substance.**

In a space often criticized for being disconnected from real-world value, CURE proves that DeFi mechanisms can be designed to create measurable, positive change. Every trade, every swap, every moment of market activity becomes part of something larger than price action.

This is crypto's opportunity to show what it can be: not just a new financial system, but a new way to align economic incentives with human good.

## License

MIT

## Disclaimer

This is an experimental project. Use at your own risk. Always conduct thorough audits before deploying to mainnet. Trading cryptocurrencies involves substantial risk of loss. The charitable donations are automatic and verifiable on-chain, but participation in trading should be based on your own research and risk tolerance.

---

**CURE Token**: Where every trade fights cancer. Where every swap funds research. Where profit meets purpose.
