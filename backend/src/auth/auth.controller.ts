import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { generateNonce } from 'siwe';
import { VerifyDtoReqDto } from './dtos/verify-dto.req.dto';
import {
  CookieManagerService,
  SESSION_COOKIE_IDENTIFIER,
} from './providers/cookie-manager.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cookieManager: CookieManagerService,
  ) {}

  @Post('verify')
  public async verify(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: VerifyDtoReqDto,
  ) {
    const result = await this.authService.verify(dto);

    if (!result) {
      throw new ForbiddenException();
    }

    this.cookieManager.setToken(response, result.address, result.chainId);
  }

  @Get('nonce')
  @Header('Content-Type', 'text/plain')
  public getNonce() {
    return generateNonce();
  }

  @Get()
  getSession(@Req() req: Request): {
    address: string | undefined;
    chainId: string | undefined;
  } {
    return {
      address: req.cookies[SESSION_COOKIE_IDENTIFIER] as string,
      chainId: req.cookies['chainId'] as string,
    };
  }
}
