import { ethers } from "hardhat";
import { expect } from "chai";

describe("CardBase", () => {
  let usdc: any;
  let cardBase: any;
  let owner: any, user: any;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    // 1. Деплой mock ERC20 (USDC)
    const ERC20Mock = await ethers.getContractFactory("ERC20Mock");
    usdc = await ERC20Mock.deploy("USD Coin", "USDC", 6);
    await usdc.waitForDeployment();

    // 2. Деплой CardBase
    const CardBase = await ethers.getContractFactory("CardBase");
    cardBase = await CardBase.deploy(owner.address, await usdc.getAddress());
    await cardBase.waitForDeployment();

    // 3. Минтим юзеру 10 USDC
    await usdc.mint(user.address, ethers.parseUnits("10", 6));
  });

  it("Should issue a card and take USDC fee", async () => {
    // 4. Approve CardBase на списание USDC
    await usdc.connect(user).approve(cardBase.getAddress(), ethers.parseUnits("1", 6));

    // 5. Вызов issueCard
    await expect(cardBase.connect(user).issueCard("test-card-id"))
      .to.emit(cardBase, "CardIssued")
      .withArgs(user.address, "test-card-id");

    // 6. Проверить что USDC списан
    const contractBalance = await usdc.balanceOf(cardBase.getAddress());
    expect(contractBalance).to.equal(ethers.parseUnits("1", 6));

    // 7. Проверить что карта записана
    const cardRaw = await cardBase.getCard(user.address);

    const card = {
      status: cardRaw[1] === 0n ? 'Active' : 'Frozen',
      id: cardRaw[0],
      balance: Number(cardRaw[2]) / 1e6
    }

    console.log(card);
    expect(card.id).to.equal("test-card-id");
    expect(card.status).to.equal("Active");
    expect(card.balance).to.equal(0);
  });

  it("Should not allow issueCard twice for the same user", async () => {
    await usdc.connect(user).approve(cardBase.getAddress(), ethers.parseUnits("2", 6));
    await cardBase.connect(user).issueCard("first-card");
    await expect(cardBase.connect(user).issueCard("second-card")).to.be.revertedWith("Card already issued for this address");
  });
});