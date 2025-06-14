import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from '../types/jwt-payload.interface';

@Injectable()
export class JwtAuthService {
  private readonly ACCESS_TOKEN_SECRET: string;
  private readonly ACCESS_TOKEN_VALIDITY_PERIOD: number;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.ACCESS_TOKEN_SECRET = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    )!;
    this.ACCESS_TOKEN_VALIDITY_PERIOD = this.configService.get<number>(
      'ACCESS_TOKEN_VALIDITY_PERIOD',
    )!;
  }

  public generateToken(jwtPayload: IJwtPayload) {
    return this.jwtService.signAsync(jwtPayload, {
      secret: this.ACCESS_TOKEN_SECRET,
      expiresIn: this.ACCESS_TOKEN_VALIDITY_PERIOD,
    });
  }
}
