import { Injectable } from '@nestjs/common';
import { ethers, JsonRpcProvider, Wallet } from 'ethers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly provider: JsonRpcProvider;
  private readonly PRIVATE_KEY: string;
  private readonly signer: Wallet;

  constructor(private configService: ConfigService) {
    this.provider = new ethers.JsonRpcProvider(
      this.configService.get<string>('RPC_URL'),
    );
    this.PRIVATE_KEY = this.configService.get<string>('PRIVATE_KEY')!;
    this.signer = new ethers.Wallet(this.PRIVATE_KEY, this.provider);

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
