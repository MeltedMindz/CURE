// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {Currency} from "@uniswap/v4-core/src/types/Currency.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "@uniswap/v4-core/src/types/BalanceDelta.sol";
import {ModifyLiquidityParams, SwapParams} from "@uniswap/v4-core/src/types/PoolOperation.sol";

// Minimal concrete implementation for testing
contract MockPoolManager is IPoolManager {
    mapping(Currency => mapping(address => uint256)) public balances;

    function take(Currency, address to, uint256 amount) external {
        balances[Currency.wrap(address(0))][to] += amount;
    }

    function settle() external payable returns (uint256) {
        return 0;
    }

    function settleFor(address) external payable returns (uint256) {
        return 0;
    }

    function lockAcquired(bytes calldata) external pure returns (bytes memory) {
        return "";
    }

    // Stub implementations - not used in tests but required by interface
    function unlock(bytes calldata) external pure returns (bytes memory) {
        return "";
    }

    function initialize(PoolKey memory, uint160) external pure returns (int24) {
        return 0;
    }

    function swap(PoolKey memory, SwapParams memory, bytes calldata) external pure returns (BalanceDelta) {
        return BalanceDelta.wrap(0);
    }

    function modifyLiquidity(PoolKey memory, ModifyLiquidityParams memory, bytes calldata) external pure returns (BalanceDelta, BalanceDelta) {
        return (BalanceDelta.wrap(0), BalanceDelta.wrap(0));
    }

    function donate(PoolKey memory, uint256, uint256, bytes calldata) external pure returns (BalanceDelta) {
        return BalanceDelta.wrap(0);
    }

    function sync(Currency) external pure {}

    function clear(Currency, uint256) external pure {}

    function mint(address, uint256, uint256) external pure {}

    function burn(address, uint256, uint256) external {}

    function balanceOf(address, uint256) external pure returns (uint256) {
        return 0;
    }

    function allowance(address, address, uint256) external pure returns (uint256) {
        return 0;
    }

    function approve(address, uint256, uint256) external pure returns (bool) {
        return true;
    }

    function transfer(address, uint256, uint256) external pure returns (bool) {
        return true;
    }

    function transferFrom(address, address, uint256, uint256) external pure returns (bool) {
        return true;
    }

    function isOperator(address, address) external pure returns (bool) {
        return false;
    }

    function setOperator(address, bool) external pure returns (bool) {
        return true;
    }

    function protocolFeesAccrued(Currency) external pure returns (uint256) {
        return 0;
    }

    function setProtocolFee(PoolKey memory, uint24) external pure {}

    function setProtocolFeeController(address) external pure {}

    function protocolFeeController() external pure returns (address) {
        return address(0);
    }

    function collectProtocolFees(address, Currency, uint256) external pure returns (uint256) {
        return 0;
    }

    function updateDynamicLPFee(PoolKey memory, uint24) external pure {}

    function extsload(bytes32) external pure returns (bytes32) {
        return bytes32(0);
    }

    function extsload(bytes32, uint256) external pure returns (bytes32[] memory) {
        return new bytes32[](0);
    }

    function extsload(bytes32[] calldata) external pure returns (bytes32[] memory) {
        return new bytes32[](0);
    }

    function exttload(bytes32) external pure returns (bytes32) {
        return bytes32(0);
    }

    function exttload(bytes32[] calldata) external pure returns (bytes32[] memory) {
        return new bytes32[](0);
    }
}

