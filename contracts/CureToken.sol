// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUniswapV2Router02 {
    function WETH() external view returns (address);
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
}

contract CureToken is ERC20, Ownable, ReentrancyGuard {
    // ───────── Core config (storage optimized) ─────────
    IUniswapV2Router02 public immutable router;
    address public immutable WETH;
    address public immutable USDC;
    // St. Jude Children's Research Hospital donation address: 0xd0fcC6215D88ff02a75C377aC19af2BB6ff225a2
    address public charityWallet;
    address public hook;           // Uniswap v4 hook contract
    
    // Pack booleans and smaller values for gas optimization
    struct SwapState {
        bool midSwap;        // true only during v4 swap/LP ops via hook
        bool internalSwap;   // true only during internal buyback swaps
        uint96 padding;      // padding to complete 32-byte slot
    }
    SwapState private swapState;
    
    uint256 public totalFeesReceived; // for analytics
    uint256 public lastProcessBlock;  // for block-based drip

    // Gas optimized constants - use smaller types where possible
    uint128 public constant CALLER_FEE_NUM = 1;
    uint128 public constant CALLER_FEE_DEN = 100;
    uint128 public constant BUYBACK_PERIOD_BLOCKS = 100;
    
    // Standard burn address for better visibility on block explorers
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    
    // Error definitions for gas efficiency (Solidity 0.8.4+)
    error ZeroAddress();
    error OnlyHook();
    error TransferRestricted();
    error CallerRewardFailed();
    error InvalidFeeAmount();

    event FeesProcessed(
        uint256 totalEthBefore,
        uint256 amountUsed,
        uint256 callerReward,
        uint256 ethForCharity,
        uint256 ethForBuyback,
        uint256 usdcSent,
        uint256 tokensBurned
    );

    event CharityWalletUpdated(address indexed oldWallet, address indexed newWallet);
    event HookUpdated(address indexed oldHook, address indexed newHook);
    event MidSwapToggled(bool enabled);

    constructor(
        address _router,
        address _usdc,
        address _charityWallet,
        uint256 _initialSupply // e.g. 1_000_000_000
    ) ERC20("Cure Token", "CURE") Ownable(msg.sender) {
        if (_router == address(0)) revert ZeroAddress();
        if (_usdc == address(0)) revert ZeroAddress();
        if (_charityWallet == address(0)) revert ZeroAddress();

        router = IUniswapV2Router02(_router);
        USDC = _usdc;
        WETH = router.WETH();
        charityWallet = _charityWallet;

        uint256 supply = _initialSupply * 10 ** decimals();
        _mint(msg.sender, supply);
    }

    // ───────── ETH intake from hook / others ─────────
    receive() external payable {
        totalFeesReceived += msg.value;
    }

    function addFees() external payable {
        // Optionally: restrict to hook/owner in a future version
        // require(msg.sender == hook || msg.sender == owner(), "Not authorized");
        totalFeesReceived += msg.value;
    }

    // ───────── Admin ─────────
    function setCharityWallet(address _newWallet) external onlyOwner {
        if (_newWallet == address(0)) revert ZeroAddress();
        emit CharityWalletUpdated(charityWallet, _newWallet);
        charityWallet = _newWallet;
    }

    function setHook(address _hook) external onlyOwner {
        if (_hook == address(0)) revert ZeroAddress();
        emit HookUpdated(hook, _hook);
        hook = _hook;
    }

    // Called by the hook only
    function setMidSwap(bool _midSwap) external {
        if (msg.sender != hook) revert OnlyHook();
        swapState.midSwap = _midSwap;
        emit MidSwapToggled(_midSwap);
    }

    // Public burn function for testing and user-initiated burns
    // Transfers to BURN_ADDRESS for better visibility on block explorers
    function burn(uint256 amount) external {
        _transfer(msg.sender, BURN_ADDRESS, amount);
    }

    // ───────── Transfer restrictions ─────────
    // No wallet-to-wallet: transfers only during:
    // - Mint/burn operations
    // - Uniswap v4 pool operations (midSwap == true)
    // - Internal buyback swaps (internalSwap == true)
    // - Contract transferring to burn address (whitelisted)
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override {
        bool isMint = from == address(0);
        bool isBurn = to == address(0) || to == BURN_ADDRESS;
        // Allow contract to transfer directly to burn address (for buyback burns)
        bool isContractBurn = from == address(this) && to == BURN_ADDRESS;

        if (!isMint && !isBurn && !isContractBurn) {
            // Allow transfers only if:
            // - we're in a Uniswap v4 pool operation (midSwap), or
            // - we're in an internal buyback swap (internalSwap)
            SwapState memory state = swapState; // Cache storage read
            if (!state.midSwap && !state.internalSwap) {
                revert TransferRestricted();
            }
        }

        super._update(from, to, value);
    }

    // ───────── Fee processing (anyone can call) ─────────
    /// @notice Gradually processes ETH buffer over a number of blocks:
    ///         - Determine how much ETH can be used this call based on blocks elapsed.
    ///         - 1% of that amount -> caller reward (raw ETH)
    ///         - Remaining 99% -> 50% charity (ETH->USDC->charity), 50% buyback (ETH->CURE->burn)
    function processFees() external nonReentrant {
        uint256 ethBalance = address(this).balance;
        if (ethBalance == 0) return;

        uint256 blocksElapsed;
        if (lastProcessBlock == 0) {
            // Allow full utilization on first ever call:
            blocksElapsed = BUYBACK_PERIOD_BLOCKS;
        } else {
            blocksElapsed = block.number - lastProcessBlock;
            if (blocksElapsed > BUYBACK_PERIOD_BLOCKS) {
                blocksElapsed = BUYBACK_PERIOD_BLOCKS;
            }
        }

        if (blocksElapsed == 0) {
            // Called again in the same block; nothing new to use.
            return;
        }

        // allowedBps goes from (1/BUYBACK_PERIOD_BLOCKS)*10000 up to 10000
        uint256 allowedBps = (blocksElapsed * 10_000) / BUYBACK_PERIOD_BLOCKS;
        if (allowedBps > 10_000) {
            allowedBps = 10_000;
        }

        uint256 amountToUse = (ethBalance * allowedBps) / 10_000;

        if (amountToUse == 0) {
            return;
        }

        lastProcessBlock = block.number;

        uint256 callerReward;
        unchecked {
            callerReward = (amountToUse * CALLER_FEE_NUM) / CALLER_FEE_DEN;
        }
        uint256 remaining = amountToUse - callerReward;

        uint256 ethForCharity = 0;
        uint256 ethForBuyback = 0;
        uint256 usdcSent = 0;
        uint256 tokensBurned = 0;

        if (callerReward > 0) {
            (bool ok, ) = payable(msg.sender).call{value: callerReward}("");
            if (!ok) revert CallerRewardFailed();
        }

        if (remaining > 0) {
            unchecked {
                ethForCharity = remaining >> 1; // Gas optimized division by 2
                ethForBuyback = remaining - ethForCharity;
            }

            if (ethForCharity > 0) {
                usdcSent = _swapETHForUSDCToCharity(ethForCharity);
            }

            if (ethForBuyback > 0) {
                tokensBurned = _swapETHForCUREAndBurn(ethForBuyback);
            }
        }

        emit FeesProcessed(
            ethBalance,
            amountToUse,
            callerReward,
            ethForCharity,
            ethForBuyback,
            usdcSent,
            tokensBurned
        );
    }

    // ───────── Internal swap helpers ─────────
    function _swapETHForUSDCToCharity(uint256 ethAmount) internal returns (uint256 usdcOut) {
        if (ethAmount == 0) return 0;

        address[] memory path = new address[](2);
        path[0] = WETH; // router treats ETH as WETH
        path[1] = USDC;

        uint256 before = IERC20(USDC).balanceOf(charityWallet);

        router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: ethAmount}(
            0,
            path,
            charityWallet,
            block.timestamp
        );

        uint256 afterBal = IERC20(USDC).balanceOf(charityWallet);
        usdcOut = afterBal - before;
    }

    function _swapETHForCUREAndBurn(uint256 ethAmount) internal returns (uint256 tokensBurned) {
        if (ethAmount == 0) return 0;

        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = address(this);

        uint256 before = balanceOf(address(this));

        // Enable internalSwap flag to allow router to transfer CURE tokens to this contract
        swapState.internalSwap = true;
        router.swapExactETHForTokensSupportingFeeOnTransferTokens{value: ethAmount}(
            0,
            path,
            address(this),
            block.timestamp
        );
        swapState.internalSwap = false;

        uint256 afterBal = balanceOf(address(this));
        tokensBurned = afterBal - before;

        if (tokensBurned > 0) {
            // Transfer to burn address for better visibility on block explorers
            _transfer(address(this), BURN_ADDRESS, tokensBurned);
        }
    }
}

