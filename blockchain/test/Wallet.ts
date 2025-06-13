import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Wallet } from "../typechain-types";
import { ContractTransactionResponse } from "ethers";

describe("Wallet", () => {
  let owner: HardhatEthersSigner;
  let wallet: Wallet;
  let recipient: HardhatEthersSigner;
  let other: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, other, recipient] = await ethers.getSigners();
    const Wallet = await ethers.getContractFactory("Wallet");
    wallet = await Wallet.deploy(owner.address);
    await wallet.waitForDeployment();

    await owner.sendTransaction({
      to: await wallet.getAddress(),
      value: ethers.parseEther("1"),
    });
    await other.sendTransaction({
      to: await wallet.getAddress(),
      value: ethers.parseEther("0.5"),
    });
  });

  it("Should accept payments and track balance", async function () {
    expect(await wallet.getFunction('getBalance')()).to.equal(ethers.parseEther("1.5"));
  });

  it("Should allow owner to withdraw", async function () {
    await expect(
      wallet.connect(owner).getFunction('withdraw')(await recipient.getAddress(), ethers.parseEther("0.5"))
    ).to.changeEtherBalances(
      [wallet, recipient],
      [ethers.parseEther("-0.5"), ethers.parseEther("0.5")]
    );

    expect(await wallet.getFunction("getBalance")()).to.equal(ethers.parseEther("1"));
  });
});