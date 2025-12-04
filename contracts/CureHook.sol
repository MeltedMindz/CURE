// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "@uniswap/v4-periphery/src/utils/BaseHook.sol";
import {Hooks} from "@uniswap/v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "@uniswap/v4-core/src/types/PoolId.sol";
import {BalanceDelta} from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "@uniswap/v4-core/src/types/BeforeSwapDelta.sol";
import {SwapParams} from "@uniswap/v4-core/src/types/PoolOperation.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SafeCast} from "@uniswap/v4-core/src/libraries/SafeCast.sol";
import {ICureTokenMinimal} from "./interfaces/ICureTokenMinimal.sol";

contract CureHook is BaseHook, ReentrancyGuard {
    using PoolIdLibrary for PoolKey;
    using SafeCast for uint256;
    using SafeCast for int128;

    uint128 private constant TOTAL_BIPS        = 10_000;
    uint128 private constant FINAL_FEE_BIPS    = 100;   // 1%
    uint128 private constant STARTING_FEE_BIPS = 9_900; // 99%
    uint128 private constant BIPS_PER_BLOCK    = 100;   // 1% per block

    Currency private constant ETH_CURRENCY = Currency.wrap(address(0));

    IPoolManager public immutable manager;
    ICureTokenMinimal public immutable cureToken;

    // Pool-specific deployment blocks (per Uniswap v4 best practices)
    // A single hook contract can service multiple pools, so state must be pool-specific
    mapping(PoolId => uint256) public deploymentBlocks;
    
    /// @notice Get the deployment block for a specific pool
    /// @param poolId The pool ID to query
    /// @return The block number when the pool was initialized, or 0 if not initialized
    function getDeploymentBlock(PoolId poolId) external view returns (uint256) {
        return deploymentBlocks[poolId];
    }

    event HookFee(
        bytes32 indexed poolId,
        address indexed sender,
        uint128 feeAmountEth,
        uint128 feeBips
    );

    constructor(IPoolManager _poolManager, ICureTokenMinimal _cureToken)
        BaseHook(_poolManager)
    {
        manager = _poolManager;
        cureToken = _cureToken;
    }

    function getHookPermissions()
        public
        pure
        override
        returns (Hooks.Permissions memory)
    {
        return Hooks.Permissions({
            beforeInitialize: true,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,
            afterSwap: true,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: true,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    // ─── Initialization: record the launch block ───
    function _beforeInitialize(
        address,
        PoolKey calldata key,
        uint160
    ) internal override returns (bytes4) {
        require(
            Currency.unwrap(key.currency1) == address(cureToken),
            "CureHook: wrong pool/token"
        );
        require(
            Currency.unwrap(key.currency0) == address(0),
            "CureHook: currency0 not ETH"
        );

        PoolId poolId = key.toId();
        if (deploymentBlocks[poolId] == 0) {
            deploymentBlocks[poolId] = block.number;
        }

        return BaseHook.beforeInitialize.selector;
    }

    // ─── Fee calculation ───
    function _calculateFeeBips(PoolId poolId) internal view returns (uint128) {
        uint256 poolDeploymentBlock = deploymentBlocks[poolId];
        if (poolDeploymentBlock == 0) {
            return FINAL_FEE_BIPS;
        }

        uint256 blocksPassed = block.number - poolDeploymentBlock;
        uint256 maxReducible = STARTING_FEE_BIPS - FINAL_FEE_BIPS; // 9800
        uint256 reduction = blocksPassed * BIPS_PER_BLOCK;

        if (reduction >= maxReducible) {
            return FINAL_FEE_BIPS;
        }

        return uint128(STARTING_FEE_BIPS - reduction);
    }

    // ─── Swap hooks ───
    function _beforeSwap(
        address,
        PoolKey calldata key,
        SwapParams calldata,
        bytes calldata
    ) internal override returns (bytes4, BeforeSwapDelta, uint24) {
        require(
            Currency.unwrap(key.currency1) == address(cureToken),
            "CureHook: wrong pool/token"
        );
        require(
            Currency.unwrap(key.currency0) == address(0),
            "CureHook: currency0 not ETH"
        );

        // Signal to token that this is a legit v4 pool operation
        cureToken.setMidSwap(true);

        return (
            BaseHook.beforeSwap.selector,
            BeforeSwapDeltaLibrary.ZERO_DELTA,
            0
        );
    }

    function _afterSwap(
        address sender,
        PoolKey calldata key,
        SwapParams calldata,
        BalanceDelta delta,
        bytes calldata
    ) internal override returns (bytes4, int128) {
        // We expect ETH as currency0
        require(
            Currency.unwrap(key.currency0) == address(0),
            "CureHook: currency0 not ETH"
        );

        // delta.amount0 is the pool's delta in ETH.
        int128 ethDelta = delta.amount0();
        // Safe absolute value: handle edge case where ethDelta is minimum int128 (-2^127)
        // The absolute value of type(int128).min is 2^127, which cannot fit in int128
        // So we calculate the absolute value directly in uint256
        PoolId poolId = key.toId();
        
        uint256 ethAmount;
        if (ethDelta < 0) {
            if (ethDelta == type(int128).min) {
                // Edge case: minimum int128 value (-2^127)
                // Absolute value is 2^127, which cannot be represented in int128
                // type(int128).max = 2^127 - 1, so we calculate: max + 1 = 2^127
                // This is mathematically correct: abs(-2^127) = 2^127
                ethAmount = uint256(uint128(type(int128).max)) + 1; // Correctly calculates 2^127
            } else {
                // Standard case: negate (safe since not min) and convert to uint256
                ethAmount = uint256(uint128(-ethDelta));
            }
        } else {
            // Positive value: convert directly to uint256
            ethAmount = uint256(uint128(ethDelta));
        }
        
        uint128 feeBips = _calculateFeeBips(poolId);
        uint256 feeAmount = (ethAmount * feeBips) / TOTAL_BIPS;

        // Return delta: negative because we're taking ETH from the pool
        // When afterSwapReturnDelta is true, we must return the delta for currency0 (ETH)
        int128 returnDelta = 0;
        
        if (feeAmount > 0) {
            // Take ETH from pool into this hook
            manager.take(ETH_CURRENCY, address(this), feeAmount);

            emit HookFee(
                PoolId.unwrap(poolId),
                sender,
                uint128(feeAmount),
                feeBips
            );

            // Forward ETH to CureToken as fees
            (bool ok, ) = address(cureToken).call{value: feeAmount}(
                abi.encodeWithSelector(ICureTokenMinimal.addFees.selector)
            );
            require(ok, "CureHook: addFees failed");
            
            // Return negative delta: we took feeAmount from currency0 (ETH)
            // This must be negative to account for the ETH we removed from the pool
            returnDelta = -int128(int256(feeAmount));
        }

        // Turn off midSwap now that swap is over
        cureToken.setMidSwap(false);

        return (BaseHook.afterSwap.selector, returnDelta);
    }

    receive() external payable {}
}

