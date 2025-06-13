import { ethers } from "hardhat";
import { WalletFactory } from "../typechain-types";

describe("Wallet factory", () => {
  let factory: WalletFactory;

  beforeEach(async () => {
    const WalletFactory = await ethers.getContractFactory("WalletFactory");
    factory = await WalletFactory.deploy();
    await factory.waitForDeployment();
  });

  it("Should deploy a wallet for a user", async () => {
    const [owner] = await ethers.getSigners();
    const tx = await factory.createWallet();
    const receipt = await tx.wait();
  });
});