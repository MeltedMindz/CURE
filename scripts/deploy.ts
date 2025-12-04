import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Configuration - update these values
  const ROUTER_ADDRESS = process.env.UNISWAP_V2_ROUTER || "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Uniswap V2 Router on mainnet
  const USDC_ADDRESS = process.env.USDC_ADDRESS || "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC on mainnet
  const CHARITY_WALLET = process.env.CHARITY_WALLET || "0x0000000000000000000000000000000000000000"; // TODO: Set St. Jude wallet
  const INITIAL_SUPPLY = process.env.INITIAL_SUPPLY ? BigInt(process.env.INITIAL_SUPPLY) : BigInt(1_000_000_000); // 1B tokens
  const POOL_MANAGER_ADDRESS = process.env.POOL_MANAGER_ADDRESS || "0x0000000000000000000000000000000000000000"; // TODO: Set Uniswap v4 PoolManager address

  // Deploy CureToken
  console.log("\nDeploying CureToken...");
  const CureToken = await ethers.getContractFactory("CureToken");
  const cureToken = await CureToken.deploy(
    ROUTER_ADDRESS,
    USDC_ADDRESS,
    CHARITY_WALLET,
    INITIAL_SUPPLY
  );
  await cureToken.waitForDeployment();
  const cureTokenAddress = await cureToken.getAddress();
  console.log("CureToken deployed to:", cureTokenAddress);

  // Deploy CureHook
  console.log("\nDeploying CureHook...");
  const CureHook = await ethers.getContractFactory("CureHook");
  const cureHook = await CureHook.deploy(POOL_MANAGER_ADDRESS, cureTokenAddress);
  await cureHook.waitForDeployment();
  const cureHookAddress = await cureHook.getAddress();
  console.log("CureHook deployed to:", cureHookAddress);

  // Set hook on token
  console.log("\nSetting hook on CureToken...");
  const setHookTx = await cureToken.setHook(cureHookAddress);
  await setHookTx.wait();
  console.log("Hook set successfully");

  console.log("\n=== Deployment Summary ===");
  console.log("CureToken:", cureTokenAddress);
  console.log("CureHook:", cureHookAddress);
  console.log("Charity Wallet:", CHARITY_WALLET);
  console.log("Initial Supply:", INITIAL_SUPPLY.toString());

  console.log("\n=== Next Steps ===");
  console.log("1. Create Uniswap v4 pool with CureHook");
  console.log("2. Initialize the pool (this will set deploymentBlock in the hook)");
  console.log("3. Add initial liquidity (e.g., 0.01 ETH + corresponding CURE tokens)");
  console.log("4. Verify contracts on Etherscan");
  console.log("5. (Optional) Renounce ownership after configuration is finalized");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

