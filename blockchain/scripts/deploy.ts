import { ethers } from "hardhat";

async function main() {
  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  const hello = await HelloWorld.deploy("Привет, мир!");

  await hello.waitForDeployment();

  const address = await hello.getAddress();
  console.log(`Контракт HelloWorld развернут по адресу: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});