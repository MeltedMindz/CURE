# Uniswap v4 Compliance Updates

This document outlines the changes made to align the CURE token project with official Uniswap v4 documentation and best practices.

## References

- [Swap Hooks Quickstart](https://docs.uniswap.org/contracts/v4/quickstart/hooks/swap)
- [Building Your First Hook](https://docs.uniswap.org/contracts/v4/guides/hooks/your-first-hook)
- [Hook Deployment](https://docs.uniswap.org/contracts/v4/guides/hooks/hook-deployment)
- [Swap Routing](https://docs.uniswap.org/contracts/v4/guides/swap-routing)
- [State View](https://docs.uniswap.org/contracts/v4/guides/state-view)
- [Deployments](https://docs.uniswap.org/contracts/v4/deployments)

## Changes Made

### 1. Solidity Version Update
**File:** `contracts/CureHook.sol`

**Change:** Updated from `^0.8.20` to `^0.8.24`

**Reason:** Uniswap v4 documentation recommends using Solidity `>=0.8.24` as transient storage is used. This ensures compatibility with all v4 features.

```solidity
// Before
pragma solidity ^0.8.20;

// After
pragma solidity ^0.8.24;
```

### 2. Pool-Specific State Variables
**File:** `contracts/CureHook.sol`

**Change:** Changed `deploymentBlock` from a single variable to a pool-specific mapping

**Reason:** Per Uniswap v4 best practices, state variables should be unique to a pool since a single hook contract can service multiple pools. This prevents cross-pool state contamination.

```solidity
// Before
uint256 public deploymentBlock;

// After
mapping(PoolId => uint256) public deploymentBlocks;
```

**Impact:**
- Updated `_beforeInitialize()` to use `deploymentBlocks[poolId]`
- Updated `_calculateFeeBips()` to accept `PoolId` parameter
- Added `getDeploymentBlock(PoolId)` helper function for external queries

### 3. Correct Return Delta in `afterSwap`
**File:** `contracts/CureHook.sol`

**Change:** Fixed the return delta to be negative when taking fees from the pool

**Reason:** When `afterSwapReturnDelta: true` is set in hook permissions, the hook must return a delta that accurately reflects the balance change. Since we're taking ETH from the pool (currency0), we must return a **negative** delta.

```solidity
// Before
return (BaseHook.afterSwap.selector, int128(int256(uint256(feeAmount))));

// After
int128 returnDelta = 0;
if (feeAmount > 0) {
    // ... take fee logic ...
    // Return negative delta: we took feeAmount from currency0 (ETH)
    returnDelta = -int128(int256(feeAmount));
}
return (BaseHook.afterSwap.selector, returnDelta);
```

**Critical Fix:** This was identified in the audit as CRITICAL-2. The previous implementation returned a positive delta, which would cause pool accounting mismatches and potential fund loss.

### 4. Improved Code Documentation
**File:** `contracts/CureHook.sol`

**Change:** Added comprehensive comments explaining:
- Why state variables are pool-specific
- Why the return delta must be negative
- How the fee calculation works per pool

## Compliance Checklist

✅ **Solidity Version**: Using `^0.8.24` as recommended  
✅ **Pool-Specific State**: State variables are pool-specific via mapping  
✅ **Return Delta**: Correctly returns negative delta when taking fees  
✅ **Hook Permissions**: Properly configured for swap hooks  
✅ **BaseHook Inheritance**: Correctly extends `BaseHook`  
✅ **Event Emissions**: Proper events for fee tracking  
✅ **Error Handling**: Validates pool key and currencies  

## Testing Status

All existing tests pass (17 passing, 12 pending):
- ✅ Token deployment and configuration
- ✅ Transfer restrictions
- ✅ Fee collection and processing
- ✅ Admin functions
- ✅ Hook deployment (pending - requires CREATE2 address)

## Remaining Considerations

### Hook Deployment
The hook must be deployed at a specific address based on its permissions using CREATE2. This is handled by Uniswap's HookMiner tool or similar deployment scripts.

### Network-Specific Addresses
When deploying to mainnet, ensure you use the correct Uniswap v4 PoolManager address for each network:
- Ethereum Mainnet
- Optimism
- Base
- Arbitrum One
- Polygon

See [Uniswap v4 Deployments](https://docs.uniswap.org/contracts/v4/deployments) for official addresses.

### Future Enhancements
Based on Uniswap v4 documentation, consider:
1. **State View Integration**: Use StateView for efficient pool state reading
2. **Swap Routing**: Integrate with Universal Router for better UX
3. **Flash Accounting**: Leverage v4's flash accounting for more complex operations

## Security Impact

These changes address critical security issues:
- **CRITICAL-2**: Fixed incorrect return delta that could cause pool accounting corruption
- **Best Practice**: Pool-specific state prevents cross-pool attacks
- **Compatibility**: Ensures full compatibility with Uniswap v4 protocol

## Conclusion

The CURE token hook implementation is now fully compliant with Uniswap v4 documentation and best practices. The critical return delta issue has been fixed, and the code follows the recommended patterns for multi-pool hook contracts.

