# CURE Token Deployment Guide

## Pre-Deployment Checklist

### Environment Setup
- [ ] Node.js v18+ installed
- [ ] Hardhat configured
- [ ] Private keys secured
- [ ] Network RPC endpoints configured
- [ ] Gas estimation tools ready

### Required Information
- [ ] Uniswap V2 Router address: `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D` (Ethereum)
- [ ] USDC contract address: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` (Ethereum)
- [ ] St. Jude charity wallet: `0xd0fcC6215D88ff02a75C377aC19af2BB6ff225a2`
- [ ] Uniswap v4 PoolManager address (when available)
- [ ] Hook deployment salt (from HookMiner)

## Step-by-Step Deployment

### 1. Environment Configuration

Create `.env` file:
```env
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
UNISWAP_V2_ROUTER=0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
USDC_ADDRESS=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
CHARITY_WALLET=0xd0fcC6215D88ff02a75C377aC19af2BB6ff225a2
POOL_MANAGER_ADDRESS=0x... # Uniswap v4 PoolManager
INITIAL_SUPPLY=1000000000
```

### 2. Hook Address Mining

⚠️ **Critical**: Uniswap v4 hooks must be deployed at specific addresses based on their permissions.

```bash
# Use HookMiner to find the correct deployment address
# This tool generates the salt needed for CREATE2 deployment
npx @uniswap/v4-hook-miner --permissions beforeInitialize,beforeSwap,afterSwap,afterSwapReturnDelta
```

Expected permissions:
- `beforeInitialize`: ✅
- `beforeSwap`: ✅ 
- `afterSwap`: ✅
- `afterSwapReturnDelta`: ✅

### 3. Contract Compilation

```bash
npm run compile
```

Verify successful compilation:
```
✓ Successfully generated 66 typings!
✓ Compiled 2 Solidity files successfully
```

### 4. Pre-Deployment Testing

```bash
# Run all tests
npm run test

# Check for gas estimation
npx hardhat test --reporter gas
```

Expected results:
- ✅ 17 passing tests
- ✅ No failing tests
- ✅ Gas usage within expected ranges

### 5. Deployment Script Execution

#### Testnet Deployment (Recommended First)

```bash
# Deploy to Goerli/Sepolia testnet first
npx hardhat run scripts/deploy.ts --network goerli
```

#### Mainnet Deployment

```bash
# Deploy to Ethereum mainnet
npx hardhat run scripts/deploy.ts --network mainnet
```

### 6. Post-Deployment Configuration

#### Set Hook Address
```bash
# Call setHook() with deployed hook address
npx hardhat run scripts/configure.ts --network mainnet
```

#### Create Uniswap v4 Pool

Using Uniswap v4 PoolManager:
```solidity
// Pool creation parameters
PoolKey memory key = PoolKey({
    currency0: Currency.wrap(address(0)), // ETH
    currency1: Currency.wrap(address(cureToken)),
    fee: 0, // Dynamic fees handled by hook
    tickSpacing: 60,
    hooks: IHooks(cureHookAddress)
});

// Initialize pool
poolManager.initialize(key, SQRT_RATIO_1_1);
```

#### Add Initial Liquidity

```bash
# Add initial liquidity (e.g., 0.01 ETH + corresponding CURE)
# This should be done through Uniswap v4 position manager
```

### 7. Contract Verification

#### Etherscan Verification

```bash
# Verify CureToken
npx hardhat verify --network mainnet CURE_TOKEN_ADDRESS \
  "UNISWAP_V2_ROUTER" "USDC_ADDRESS" "CHARITY_WALLET" "INITIAL_SUPPLY"

# Verify CureHook  
npx hardhat verify --network mainnet CURE_HOOK_ADDRESS \
  "POOL_MANAGER_ADDRESS" "CURE_TOKEN_ADDRESS"
```

## Security Considerations

### Multi-Signature Recommendations

Consider using a multi-signature wallet for:
- Contract ownership
- Charity wallet updates
- Emergency functions

### Access Control Review

After deployment, verify:
- [ ] Owner is set correctly
- [ ] Hook address is configured
- [ ] Charity wallet is correct
- [ ] No unauthorized access points

### Monitoring Setup

Implement monitoring for:
- Fee processing events
- Large transactions
- Charity donations
- Contract balance changes

## Testing in Production

### Initial Testing

1. **Small Test Swap**: Execute a minimal swap to verify fee collection
2. **Fee Processing**: Call `processFees()` to test the mechanism
3. **Transfer Restrictions**: Verify wallet-to-wallet transfers are blocked
4. **Charity Donation**: Confirm USDC reaches charity wallet

### Volume Testing

Gradually increase trading volume while monitoring:
- Gas efficiency
- Fee collection accuracy
- Block-based drip functionality
- Hook performance

## Emergency Procedures

### Pause Mechanisms

While CURE doesn't have built-in pause functionality, monitor for:
- Unusual trading patterns
- Smart contract interactions
- Fee processing irregularities

### Contact Information

Maintain contact with:
- St. Jude Children's Research Hospital
- Uniswap v4 team (for technical issues)
- Security audit firms
- Community moderators

## Post-Deployment Checklist

### Immediate (0-24 hours)
- [ ] Verify contract addresses on Etherscan
- [ ] Confirm initial liquidity provision
- [ ] Test fee processing mechanism
- [ ] Monitor first transactions

### Short-term (1-7 days)
- [ ] Analytics dashboard deployment
- [ ] Community announcement
- [ ] Documentation updates
- [ ] Initial trading volume assessment

### Medium-term (1-4 weeks)
- [ ] Performance optimization review
- [ ] Community feedback integration
- [ ] Charity impact reporting
- [ ] Security monitoring results

### Long-term (1+ months)
- [ ] Consider governance implementation
- [ ] Evaluate additional features
- [ ] Plan for future upgrades
- [ ] Document lessons learned

## Support and Resources

### Technical Documentation
- [Uniswap v4 Documentation](https://docs.uniswap.org/contracts/v4/overview)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs)

### Security Resources
- [Smart Contract Security Field Guide](https://scsfg.io/)
- [Consensys Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

### Community
- Discord server (if applicable)
- GitHub discussions
- Twitter announcements

---

**Remember**: Always deploy to testnet first and conduct thorough testing before mainnet deployment. The charitable nature of this project means extra care should be taken to ensure donated funds reach their intended destination.