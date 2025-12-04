// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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

    uint256 public deploymentBlock;

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

        if (deploymentBlock == 0) {
            deploymentBlock = block.number;
        }

        return BaseHook.beforeInitialize.selector;
    }

    // ─── Fee calculation ───
    function _calculateFeeBips() internal view returns (uint128) {
        if (deploymentBlock == 0) {
            return FINAL_FEE_BIPS;
        }

        uint256 blocksPassed = block.number - deploymentBlock;
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
        if (ethDelta < 0) ethDelta = -ethDelta;

        uint256 ethAmount = uint128(uint256(int256(ethDelta)));
        uint128 feeBips = _calculateFeeBips();
        uint256 feeAmount = (ethAmount * feeBips) / TOTAL_BIPS;

        if (feeAmount > 0) {
            // Take ETH from pool into this hook
            manager.take(ETH_CURRENCY, address(this), feeAmount);

            emit HookFee(
                PoolId.unwrap(key.toId()),
                sender,
                uint128(feeAmount),
                feeBips
            );

            // Forward ETH to CureToken as fees
            (bool ok, ) = address(cureToken).call{value: feeAmount}(
                abi.encodeWithSelector(ICureTokenMinimal.addFees.selector)
            );
            require(ok, "CureHook: addFees failed");
        }

        // Turn off midSwap now that swap is over
        cureToken.setMidSwap(false);

        return (BaseHook.afterSwap.selector, int128(int256(uint256(feeAmount))));
    }

    receive() external payable {}
}

