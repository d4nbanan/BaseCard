import { CookieOptions, Response } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const SESSION_COOKIE_IDENTIFIER = 'address';

@Injectable()
export class CookieManagerService {
  private readonly SESSION_LIFETIME: number;
  private readonly DOMAIN: string;
  private readonly cookieOptions: CookieOptions;

  constructor(private configService: ConfigService) {
    this.SESSION_LIFETIME = this.configService.get<number>('SESSION_LIFETIME')!;
    this.DOMAIN = this.configService.get<string>('DOMAIN')!;
    this.cookieOptions = {
      maxAge: this.SESSION_LIFETIME,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: this.DOMAIN,
    };
  }

  setToken(response: Response, address: string): void {
    response.cookie(SESSION_COOKIE_IDENTIFIER, address, this.cookieOptions);
  }

  removeCookieToken(response: Response) {
    response.clearCookie(SESSION_COOKIE_IDENTIFIER, this.cookieOptions);
  }
}
