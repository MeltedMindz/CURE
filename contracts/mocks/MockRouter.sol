// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockRouter {
    address public immutable WETH;

    constructor() {
        WETH = address(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2); // Mock WETH address
    }

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable {
        // Mock implementation: just transfer tokens to recipient
        // In real tests, you'd want to implement actual swap logic or use a more sophisticated mock
        if (path.length >= 2) {
            IERC20 token = IERC20(path[path.length - 1]);
            // For testing, we'll need to mint tokens or have them pre-funded
            // This is a minimal mock - adjust based on your test needs
        }
    }
}

