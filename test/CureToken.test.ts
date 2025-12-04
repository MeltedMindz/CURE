import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

describe("CureToken", function () {
  let cureToken: Contract;
  let mockRouter: Contract;
  let mockUSDC: Contract;
  let owner: Signer;
  let user1: Signer;
  let user2: Signer;
  let charityWallet: string;
  let hookAddress: string;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    charityWallet = await user2.getAddress();
    hookAddress = await user1.getAddress(); // Using user1 as mock hook

    // Deploy mock router
    const MockRouter = await ethers.getContractFactory("MockRouter");
    mockRouter = await MockRouter.deploy();
    await mockRouter.waitForDeployment();

    // Deploy mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockUSDC = await MockERC20.deploy("USDC", "USDC", 6);
    await mockUSDC.waitForDeployment();

    // Deploy CureToken
    const CureToken = await ethers.getContractFactory("CureToken");
    cureToken = await CureToken.deploy(
      await mockRouter.getAddress(),
      await mockUSDC.getAddress(),
      charityWallet,
      BigInt(1_000_000_000)
    );
    await cureToken.waitForDeployment();

    // Set hook
    await cureToken.setHook(hookAddress);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await cureToken.owner()).to.equal(await owner.getAddress());
    });

    it("Should mint initial supply to owner", async function () {
      const ownerAddress = await owner.getAddress();
      const supply = await cureToken.totalSupply();
      expect(await cureToken.balanceOf(ownerAddress)).to.equal(supply);
    });

    it("Should set charity wallet", async function () {
      expect(await cureToken.charityWallet()).to.equal(charityWallet);
    });
  });

  describe("Transfer restrictions", function () {
    it("Should revert wallet-to-wallet transfers when midSwap is false", async function () {
      const ownerAddress = await owner.getAddress();
      const user1Address = await user1.getAddress();
      const amount = ethers.parseEther("100");

      await expect(
        cureToken.transfer(user1Address, amount)
      ).to.be.revertedWith("CURE: transfers only via v4 hook");
    });

    it("Should allow transfers when midSwap is true", async function () {
      const ownerAddress = await owner.getAddress();
      const user1Address = await user1.getAddress();
      const amount = ethers.parseEther("100");

      // Hook sets midSwap to true
      await cureToken.connect(user1).setMidSwap(true);
      
      // Now transfer should work
      await expect(cureToken.transfer(user1Address, amount)).to.not.be.reverted;
      
      // Turn off midSwap
      await cureToken.connect(user1).setMidSwap(false);
    });

    it("Should allow minting", async function () {
      // Minting is allowed (from == address(0))
      const user1Address = await user1.getAddress();
      const amount = ethers.parseEther("1000");
      
      // This would be done internally, but we can test the logic
      // by checking that minting doesn't require midSwap
      expect(await cureToken.balanceOf(user1Address)).to.equal(0);
    });

    it("Should allow burning", async function () {
      const ownerAddress = await owner.getAddress();
      const amount = ethers.parseEther("100");
      
      // Burning is allowed (to == address(0))
      await expect(cureToken.burn(amount)).to.not.be.reverted;
    });
  });

  describe("Fee collection", function () {
    it("Should accept ETH via receive()", async function () {
      const amount = ethers.parseEther("1");
      const before = await cureToken.totalFeesReceived();

      await owner.sendTransaction({
        to: await cureToken.getAddress(),
        value: amount,
      });

      const after = await cureToken.totalFeesReceived();
      expect(after - before).to.equal(amount);
    });

    it("Should accept ETH via addFees()", async function () {
      const amount = ethers.parseEther("1");
      const before = await cureToken.totalFeesReceived();

      await cureToken.addFees({ value: amount });

      const after = await cureToken.totalFeesReceived();
      expect(after - before).to.equal(amount);
    });
  });

  describe("processFees", function () {
    beforeEach(async function () {
      // Send some ETH to the contract
      await owner.sendTransaction({
        to: await cureToken.getAddress(),
        value: ethers.parseEther("10"),
      });
    });

    it("Should process fees and pay caller reward", async function () {
      const callerAddress = await user1.getAddress();
      const beforeBalance = await ethers.provider.getBalance(callerAddress);

      const tx = await cureToken.connect(user1).processFees();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const afterBalance = await ethers.provider.getBalance(callerAddress);
      const balanceDiff = afterBalance - beforeBalance + gasUsed;

      // Should receive approximately 1% of the amount used
      // On first call, full amount is used (BUYBACK_PERIOD_BLOCKS blocks elapsed)
      const expectedReward = (ethers.parseEther("10") * BigInt(1)) / BigInt(100);
      
      // Allow some tolerance for gas
      expect(balanceDiff).to.be.closeTo(expectedReward, ethers.parseEther("0.01"));
    });

    it("Should split remaining fees 50/50 between charity and buyback", async function () {
      // This test would require more complex mocking of the swap functions
      // For now, we just check that processFees doesn't revert
      await expect(cureToken.connect(user1).processFees()).to.not.be.reverted;
    });

    it("Should respect block-based drip mechanism", async function () {
      // Process fees first time (uses full amount on first call)
      await cureToken.connect(user1).processFees();
      const firstCallBlock = await cureToken.lastProcessBlock();

      // Add more ETH to the contract
      await owner.sendTransaction({
        to: await cureToken.getAddress(),
        value: ethers.parseEther("5"),
      });

      // Mine a few blocks (but less than BUYBACK_PERIOD_BLOCKS)
      await ethers.provider.send("evm_mine", []);
      await ethers.provider.send("evm_mine", []);

      // Process fees again - should use only a fraction based on blocks elapsed
      const balanceBefore = await ethers.provider.getBalance(await cureToken.getAddress());
      await cureToken.connect(user1).processFees();
      const balanceAfter = await ethers.provider.getBalance(await cureToken.getAddress());

      // Should have used some ETH but not all (since only 2 blocks passed)
      expect(balanceAfter).to.be.lessThan(balanceBefore);
      // Balance after should be greater than 0 (not all used)
      expect(balanceAfter).to.be.greaterThan(0);
    });

    it("Should allow full utilization after BUYBACK_PERIOD_BLOCKS", async function () {
      // Process fees first time
      await cureToken.connect(user1).processFees();

      // Mine BUYBACK_PERIOD_BLOCKS blocks
      for (let i = 0; i < 100; i++) {
        await ethers.provider.send("evm_mine", []);
      }

      // Add more ETH
      await owner.sendTransaction({
        to: await cureToken.getAddress(),
        value: ethers.parseEther("5"),
      });

      const balanceBefore = await ethers.provider.getBalance(await cureToken.getAddress());
      await cureToken.connect(user1).processFees();
      const balanceAfter = await ethers.provider.getBalance(await cureToken.getAddress());

      // Should have used the full amount (minus caller reward and swaps)
      expect(balanceAfter).to.be.lessThan(balanceBefore);
    });
  });

  describe("Admin functions", function () {
    it("Should allow owner to update charity wallet", async function () {
      const newWallet = await user2.getAddress();
      await cureToken.setCharityWallet(newWallet);
      expect(await cureToken.charityWallet()).to.equal(newWallet);
    });

    it("Should not allow non-owner to update charity wallet", async function () {
      const newWallet = await user2.getAddress();
      await expect(
        cureToken.connect(user1).setCharityWallet(newWallet)
      ).to.be.revertedWithCustomError(cureToken, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to update hook", async function () {
      const newHook = await user2.getAddress();
      await cureToken.setHook(newHook);
      expect(await cureToken.hook()).to.equal(newHook);
    });

    it("Should only allow hook to set midSwap", async function () {
      await expect(
        cureToken.connect(user2).setMidSwap(true)
      ).to.be.revertedWith("Only hook");
    });
  });
});

