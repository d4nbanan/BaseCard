import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookieManagerService } from './providers/cookie-manager.service';
import { JwtAuthService } from './providers/jwt-auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [AuthService, CookieManagerService, JwtAuthService],
})
export class AuthModule {}
