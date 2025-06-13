import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { generateNonce } from 'siwe';
import { VerifyDtoReqDto } from './dtos/verify-dto.req.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('verify')
  public async verify(@Body() dto: VerifyDtoReqDto) {
    return this.authService.verify(dto);
  }

  @Get('nonce')
  @Header('Content-Type', 'text/plain')
  public getNonce() {
    return generateNonce();
  }
}
