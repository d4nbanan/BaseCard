import { Injectable } from '@nestjs/common';
import { VerifyDtoReqDto } from './dtos/verify-dto.req.dto';
import {
  getAddressFromMessage,
  getChainIdFromMessage,
} from '@reown/appkit-siwe';
import { createPublicClient, http } from 'viem';
import { ConfigService } from '@nestjs/config';
import { JwtAuthService } from './providers/jwt-auth.service';

@Injectable()
export class AuthService {
  private readonly PROJECT_ID: string;

  constructor(
    private configService: ConfigService,
    private jwtAuthService: JwtAuthService,
  ) {
    this.PROJECT_ID = this.configService.get<string>('PROJECT_ID')!;
  }

  public async verify(dto: VerifyDtoReqDto) {
    const { message, signature } = dto;
    const address = getAddressFromMessage(message);
    const chainId = getChainIdFromMessage(message);

    const publicClient = createPublicClient({
      transport: http(
        `https://rpc.walletconnect.org/v1/?chainId=${chainId}&projectId=${this.PROJECT_ID}`,
      ),
    });

    const verificationResult = await publicClient.verifyMessage({
      message,
      address: address as `0x${string}`,
      signature,
    });

    if (verificationResult) {
      return await this.jwtAuthService.generateToken({ address });
    }

    return null;
  }
}
