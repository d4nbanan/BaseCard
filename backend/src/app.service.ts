import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class AppService {
  private readonly provider = new ethers.JsonRpcProvider(
    'http://127.0.0.1:8545',
  );
  private readonly PRIVATE_KEY =
    '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e';
  private readonly signer = new ethers.Wallet(this.PRIVATE_KEY, this.provider);

  constructor() {
    this.getBalance();
  }

  public async getBalance() {
    const accounts = await this.provider.listAccounts();
    console.log(accounts);

    const balance = await this.provider.getBalance(accounts[0]);
    console.log(`Баланс: ${ethers.formatEther(balance)} ETH`);
  }

  // private async deploy() {
  //   const factory = new ethers.ContractFactory(
  //     MainArtifact.abi,
  //     MainArtifact.bytecode,
  //     signer
  //   );
  //   const contract = await factory.deploy(/* ... */);
  //   await contract.waitForDeployment();
  // }
}
