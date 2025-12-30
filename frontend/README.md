# CURE Token Frontend

Production-ready frontend for the CURE token, built with Next.js, TypeScript, Tailwind CSS, and wagmi.

## Features

- **Landing Page**: Beautiful landing page showcasing CURE's mission and impact
- **Dashboard**: Interactive dashboard for viewing contract stats and processing fees
- **Wallet Integration**: Connect wallets using RainbowKit
- **Contract Interactions**: Read contract state and execute transactions
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Wallet Connect Project ID (optional, for WalletConnect support)

### Installation

```bash
npm install
```

### Configuration

Create a `.env.local` file in the frontend directory:

```env
# Contract Addresses
NEXT_PUBLIC_CURE_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_CURE_HOOK_ADDRESS=0x...

# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_CHAIN_NAME=Ethereum
NEXT_PUBLIC_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Wallet Connect (optional)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-project-id

# Uniswap Pool Link (optional)
NEXT_PUBLIC_UNISWAP_POOL_LINK=https://app.uniswap.org/...

# Other Configuration (optional, has defaults)
NEXT_PUBLIC_UNISWAP_V2_ROUTER=0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
NEXT_PUBLIC_USDC_ADDRESS=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
NEXT_PUBLIC_CHARITY_WALLET=0xd0fcC6215D88ff02a75C377aC19af2BB6ff225a2
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── app/              # Dapp pages
│   │   └── page.tsx      # Main app dashboard
│   ├── layout.tsx        # Root layout with providers
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # UI component library
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Stat.tsx
│   │   └── Badge.tsx
│   ├── ConnectButton.tsx
│   ├── ContractStats.tsx
│   └── ProcessFeesButton.tsx
├── lib/
│   ├── config.ts         # Configuration
│   ├── wagmi.ts          # Wagmi setup
│   ├── contracts/        # Contract ABIs
│   │   ├── cureToken.json
│   │   └── cureHook.json
│   └── hooks/
│       └── useCureToken.ts  # Contract interaction hooks
└── public/               # Static assets
```

## Key Components

### useCureToken Hook

Custom hook for interacting with the CURE token contract:

```typescript
const {
  totalSupply,
  totalFeesReceived,
  contractBalance,
  processFees,
  isPending,
  isConfirmed,
} = useCureToken();
```

### Contract Interactions

- **Read Functions**: Token supply, fees, balances, contract configuration
- **Write Functions**: Process fees, burn tokens
- **Transaction State**: Pending, confirming, confirmed states

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_CURE_TOKEN_ADDRESS` | CURE token contract address | Yes | - |
| `NEXT_PUBLIC_CURE_HOOK_ADDRESS` | CURE hook contract address | No | - |
| `NEXT_PUBLIC_CHAIN_ID` | Chain ID (1 for mainnet) | No | 1 |
| `NEXT_PUBLIC_RPC_URL` | RPC endpoint URL | Recommended | - |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | No | - |
| `NEXT_PUBLIC_UNISWAP_POOL_LINK` | Link to Uniswap pool | No | - |

## Design System

The frontend uses a clean, modern design system inspired by finance-oriented applications:

- **Typography**: Inter font family
- **Colors**: Blue and purple gradients, clean grays
- **Components**: Reusable UI components with consistent styling
- **Layout**: Section-based layout with cards and stat displays

## Security Considerations

- All write transactions require explicit user confirmation
- Contract addresses validated before use
- Read-only mode when wallet not connected
- Clear error messaging for failed transactions

## License

MIT
