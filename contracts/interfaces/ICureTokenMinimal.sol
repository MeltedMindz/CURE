// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICureTokenMinimal {
    function addFees() external payable;
    function setMidSwap(bool isMidSwap) external;
}

