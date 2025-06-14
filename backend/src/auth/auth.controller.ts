import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { generateNonce } from 'siwe';
import { VerifyDtoReqDto } from './dtos/verify-dto.req.dto';
import { CookieManagerService } from './providers/cookie-manager.service';
import { Response } from 'express';

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

    this.cookieManager.setToken(response, result);
  }

  @Get('nonce')
  @Header('Content-Type', 'text/plain')
  public getNonce() {
    return generateNonce();
  }
}
