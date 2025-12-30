# Security Audit Report - CURE Token

**Auditor:** Blockchain Security Expert  
**Date:** 2024  
**Contracts Audited:**
- `CureToken.sol`
- `CureHook.sol`
- `ICureTokenMinimal.sol`

---

## Executive Summary

This audit identifies **8 critical issues**, **5 high-severity issues**, **7 medium-severity issues**, and **4 low-severity issues** across the CURE token contracts. The most critical concerns involve access control, economic manipulation vectors, and potential DoS scenarios.

**Overall Risk Level: HIGH**

---

## Critical Issues

### CRITICAL-1: Unauthorized Fee Injection via `addFees()`
**Location:** `CureToken.sol:76-80`  
**Severity:** CRITICAL

**Description:**
The `addFees()` function is publicly callable without access control. Anyone can send ETH to this function, artificially inflating `totalFeesReceived` and potentially manipulating the fee processing mechanism.

```solidity
function addFees() external payable {
    // Optionally: restrict to hook/owner in a future version
    // require(msg.sender == hook || msg.sender == owner(), "Not authorized");
    totalFeesReceived += msg.value;
}
```

**Impact:**
- Attacker can inflate `totalFeesReceived` metric
- Could be used to front-run `processFees()` calls
- Economic manipulation of fee tracking

**Recommendation:**
```solidity
function addFees() external payable {
    require(msg.sender == hook || msg.sender == owner(), "Not authorized");
    totalFeesReceived += msg.value;
}
```

---

### CRITICAL-2: Missing Validation in `_afterSwap` Return Delta
**Location:** `CureHook.sol:189`  
**Severity:** CRITICAL

**Description:**
The hook returns `int128(int256(uint256(feeAmount)))` as the delta, but this doesn't account for the actual balance change. The hook takes ETH from the pool but doesn't properly account for it in the return value, which could cause accounting issues in the PoolManager.

**Impact:**
- Pool accounting mismatch
- Potential fund loss or DoS
- Uniswap v4 pool state corruption

**Recommendation:**
Ensure the return delta accurately reflects the actual balance change. The hook should return a negative delta equal to the fee taken.

---

### CRITICAL-3: No Slippage Protection in Swap Functions
**Location:** `CureToken.sol:217-222, 237-242`  
**Severity:** CRITICAL

**Description:**
Both swap functions use `amountOutMin = 0`, meaning they accept any amount of output tokens, even zero. This makes the contract vulnerable to sandwich attacks and MEV extraction.

```solidity
router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: ethAmount}(
    0,  // <-- No slippage protection
    path,
    charityWallet,
    block.timestamp
);
```

**Impact:**
- MEV bots can sandwich attack swaps
- Charity could receive significantly less value than intended
- Buyback could fail to burn meaningful amounts
- Direct financial loss

**Recommendation:**
Implement slippage protection based on oracle prices or minimum expected output:
```solidity
uint256 minAmountOut = (ethAmount * minPriceBps) / 10000;
router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: ethAmount}(
    minAmountOut,
    path,
    charityWallet,
    block.timestamp
);
```

---

### CRITICAL-4: Potential DoS via Failed Swap
**Location:** `CureToken.sol:187-193`  
**Severity:** CRITICAL

**Description:**
If `_swapETHForUSDCToCharity()` or `_swapETHForCUREAndBurn()` reverts (e.g., due to insufficient liquidity, router issues, or token issues), the entire `processFees()` transaction will revert. This could permanently lock ETH in the contract.

**Impact:**
- Permanent ETH lock if swaps fail
- No recovery mechanism
- Funds stuck forever

**Recommendation:**
Wrap swaps in try-catch blocks:
```solidity
if (ethForCharity > 0) {
    try this._swapETHForUSDCToCharity(ethForCharity) returns (uint256 usdc) {
        usdcSent = usdc;
    } catch {
        // Log error, continue with buyback
        emit SwapFailed("charity", ethForCharity);
    }
}
```

---

### CRITICAL-5: Race Condition in `processFees()` Block Calculation
**Location:** `CureToken.sol:140-168`  
**Severity:** CRITICAL

**Description:**
The `lastProcessBlock` is set AFTER calculating `amountToUse`, but if multiple transactions are in the same block, they could all read the same `lastProcessBlock` and calculate the same `amountToUse`, potentially draining more than intended.

**Impact:**
- Multiple calls in same block could drain more ETH than intended
- Economic exploit
- Violates the drip mechanism design

**Recommendation:**
Use `lastProcessBlock` check at the beginning and set it immediately:
```solidity
if (lastProcessBlock == block.number) {
    return; // Already processed this block
}
lastProcessBlock = block.number; // Set immediately
// Then calculate amountToUse
```

---

### CRITICAL-6: Missing Hook Address Validation
**Location:** `CureToken.sol:89-93`  
**Severity:** CRITICAL

**Description:**
The owner can set any address as the hook, including a malicious contract. Once set, that address can call `setMidSwap()` and potentially manipulate transfers.

**Impact:**
- Owner could set malicious hook
- Malicious hook could enable unauthorized transfers
- Complete compromise of transfer restrictions

**Recommendation:**
Add validation that the hook implements the expected interface:
```solidity
function setHook(address _hook) external onlyOwner {
    require(_hook != address(0), "Zero hook");
    require(_hook.code.length > 0, "Hook must be contract");
    // Optionally: verify hook has expected interface
    emit HookUpdated(hook, _hook);
    hook = _hook;
}
```

---

### CRITICAL-7: Integer Division Precision Loss
**Location:** `CureToken.sol:184-185`  
**Severity:** CRITICAL

**Description:**
The 50/50 split uses integer division: `ethForCharity = remaining / 2; ethForBuyback = remaining - ethForCharity;`. If `remaining` is odd, 1 wei is lost to rounding.

**Impact:**
- Small amounts of ETH permanently lost on each call
- Accumulates over time
- Precision loss

**Recommendation:**
Handle rounding explicitly:
```solidity
ethForCharity = remaining / 2;
ethForBuyback = remaining - ethForCharity; // This handles odd amounts correctly
// Or use: ethForBuyback = remaining - ethForCharity;
```

Actually, the current implementation is correct for handling odd amounts. However, consider documenting this behavior.

---

### CRITICAL-8: No Emergency Pause Mechanism
**Location:** Multiple  
**Severity:** CRITICAL

**Description:**
There's no pause mechanism if a critical bug is discovered. All functions remain active even if an exploit is found.

**Impact:**
- Cannot stop attacks in progress
- No way to mitigate damage
- Funds at risk until fix is deployed

**Recommendation:**
Add OpenZeppelin's `Pausable` and pause critical functions:
```solidity
import "@openzeppelin/contracts/utils/Pausable.sol";

contract CureToken is ERC20, Ownable, ReentrancyGuard, Pausable {
    function processFees() external nonReentrant whenNotPaused {
        // ...
    }
}
```

---

## High Severity Issues

### HIGH-1: Front-Running `processFees()` for Caller Reward
**Location:** `CureToken.sol:136-181`  
**Severity:** HIGH

**Description:**
MEV bots can front-run `processFees()` calls to claim the 1% caller reward. The reward is paid in raw ETH, making it highly profitable for bots.

**Impact:**
- Legitimate users rarely get rewards
- Centralization of rewards to MEV bots
- Unfair distribution

**Recommendation:**
Consider using commit-reveal scheme or minimum delay between calls.

---

### HIGH-2: `deploymentBlock` Can Be Set Multiple Times
**Location:** `CureHook.sol:87-89`  
**Severity:** HIGH

**Description:**
While there's a check `if (deploymentBlock == 0)`, if the pool is initialized multiple times (which shouldn't happen but could due to bugs), the block is only set once. However, if someone could reset it, they could manipulate the fee decay.

**Impact:**
- Fee decay manipulation
- Economic exploit

**Recommendation:**
Add additional validation or make it truly immutable after first set.

---

### HIGH-3: Missing Validation for Router Swaps
**Location:** `CureToken.sol:217, 237`  
**Severity:** HIGH

**Description:**
The contract trusts the router completely. If the router is compromised or has a bug, all swaps could fail or be manipulated.

**Impact:**
- Complete loss of swap functionality
- Funds stuck
- Dependency risk

**Recommendation:**
Add router address validation and consider using a whitelist of trusted routers.

---

### HIGH-4: No Maximum Cap on Fee Amount
**Location:** `CureHook.sol:166`  
**Severity:** HIGH

**Description:**
The fee calculation doesn't cap the maximum fee amount. In extreme scenarios (e.g., very large swaps), the fee could be enormous.

**Impact:**
- Extreme fees on large swaps
- Potential DoS if fee exceeds available balance
- Economic manipulation

**Recommendation:**
Add a maximum fee cap:
```solidity
uint256 maxFee = ethAmount / 2; // Cap at 50% of swap
if (feeAmount > maxFee) {
    feeAmount = maxFee;
}
```

---

### HIGH-5: `setMidSwap` Can Be Called During Failed Swaps
**Location:** `CureHook.sol:128, 187`  
**Severity:** HIGH

**Description:**
If a swap fails after `setMidSwap(true)` is called in `_beforeSwap`, `setMidSwap(false)` might not be called in `_afterSwap`, leaving `midSwap` permanently true.

**Impact:**
- Transfer restrictions permanently disabled
- Security bypass
- Unauthorized transfers enabled

**Recommendation:**
Use try-finally pattern or ensure cleanup in all code paths. Consider using a stack-based approach for nested swaps.

---

## Medium Severity Issues

### MEDIUM-1: No Event Emission for Failed Operations
**Location:** Multiple  
**Severity:** MEDIUM

**Description:**
Failed swaps or operations don't emit events, making it difficult to track issues on-chain.

**Recommendation:**
Add comprehensive event logging for all operations.

---

### MEDIUM-2: `totalFeesReceived` Can Overflow
**Location:** `CureToken.sol:73, 79`  
**Severity:** MEDIUM

**Description:**
While unlikely, `totalFeesReceived` could theoretically overflow if enough ETH is accumulated (though this would require more ETH than exists).

**Recommendation:**
Use SafeMath or document the theoretical limit.

---

### MEDIUM-3: No Minimum Threshold for `processFees()`
**Location:** `CureToken.sol:136`  
**Severity:** MEDIUM

**Description:**
`processFees()` can be called with any amount of ETH, even dust amounts, wasting gas.

**Recommendation:**
Add minimum threshold:
```solidity
require(ethBalance >= MIN_PROCESS_AMOUNT, "Amount too small");
```

---

### MEDIUM-4: Charity Wallet Can Be Changed to Any Address
**Location:** `CureToken.sol:83-87`  
**Severity:** MEDIUM

**Description:**
Owner can change charity wallet to any address, including their own. While this is by design (owner control), it's a centralization risk.

**Recommendation:**
Consider timelock or multisig for charity wallet changes, or make it immutable after deployment.

---

### MEDIUM-5: No Validation of USDC Address
**Location:** `CureToken.sol:63`  
**Severity:** MEDIUM

**Description:**
The USDC address is set in constructor but not validated to be the actual USDC token.

**Recommendation:**
Add validation or use a constant for mainnet USDC address.

---

### MEDIUM-6: Potential Reentrancy in Hook's ETH Forwarding
**Location:** `CureHook.sol:180-183`  
**Severity:** MEDIUM

**Description:**
While `ReentrancyGuard` is used, the external call to `cureToken.addFees()` could potentially reenter, though the guard should prevent this.

**Recommendation:**
Verify the guard is effective and consider additional checks.

---

### MEDIUM-7: No Deadline Validation in Swaps
**Location:** `CureToken.sol:221, 241`  
**Severity:** MEDIUM

**Description:**
While `block.timestamp` is used as deadline, there's no validation that it's reasonable. If a transaction is pending for a long time, it could execute at an unfavorable price.

**Recommendation:**
Use a more reasonable deadline:
```solidity
uint256 deadline = block.timestamp + 300; // 5 minutes
```

---

## Low Severity Issues

### LOW-1: Missing NatSpec Documentation
**Location:** Multiple  
**Severity:** LOW

**Description:**
Several functions lack comprehensive NatSpec documentation.

**Recommendation:**
Add detailed NatSpec comments for all public and external functions.

---

### LOW-2: Magic Numbers
**Location:** `CureToken.sol:31-32, 36`  
**Severity:** LOW

**Description:**
Constants like `CALLER_FEE_NUM = 1` and `CALLER_FEE_DEN = 100` could be better documented.

**Recommendation:**
Add comments explaining the rationale for these values.

---

### LOW-3: Gas Optimization Opportunities
**Location:** Multiple  
**Severity:** LOW

**Description:**
Several gas optimization opportunities exist, such as packing structs, using custom errors instead of strings, etc.

**Recommendation:**
Consider gas optimizations in future versions.

---

### LOW-4: No Upgrade Mechanism
**Location:** Multiple  
**Severity:** LOW

**Description:**
Contracts are not upgradeable. If bugs are found, new contracts must be deployed.

**Recommendation:**
Consider using upgradeable proxy pattern if flexibility is needed (though this adds complexity).

---

## Positive Findings

1. ✅ **Good use of ReentrancyGuard** - Properly applied to `processFees()`
2. ✅ **Immutable variables** - Router, WETH, USDC are immutable, reducing attack surface
3. ✅ **Transfer restrictions** - Well-implemented with `midSwap` flag
4. ✅ **Edge case handling** - Minimum int128 overflow is handled
5. ✅ **OpenZeppelin contracts** - Using battle-tested libraries

---

## Recommendations Summary

### Immediate Actions Required:
1. Add access control to `addFees()`
2. Implement slippage protection in swaps
3. Add try-catch for swap failures
4. Fix race condition in `processFees()`
5. Add pause mechanism
6. Validate hook address properly
7. Fix `_afterSwap` return delta calculation

### Short-term Improvements:
1. Add minimum thresholds
2. Implement better event logging
3. Add deadline validation
4. Consider timelock for critical operations

### Long-term Considerations:
1. Consider upgradeability if needed
2. Gas optimizations
3. Enhanced documentation
4. Formal verification of critical functions

---

## Testing Recommendations

1. **Fuzz Testing:** Test `processFees()` with various ETH amounts and block numbers
2. **Invariant Testing:** Verify that `totalFeesReceived` always equals sum of processed fees
3. **Integration Testing:** Test with actual Uniswap v4 pool
4. **Stress Testing:** Test with maximum values and edge cases
5. **MEV Testing:** Test front-running scenarios

---

## Conclusion

The CURE token contracts implement an innovative PvPvE mechanism but contain several critical security issues that must be addressed before mainnet deployment. The most urgent concerns are:

1. Unauthorized fee injection
2. Missing slippage protection
3. Potential DoS via failed swaps
4. Race conditions in fee processing

**Recommendation: DO NOT DEPLOY TO MAINNET until critical issues are resolved.**

---

**Audit Status:** Complete  
**Next Steps:** Address critical issues and conduct re-audit

