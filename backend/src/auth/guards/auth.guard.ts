import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  address?: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly ACCESS_TOKEN_SECRET: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.ACCESS_TOKEN_SECRET = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    )!;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<{ address: string }>(
        token,
        { secret: this.ACCESS_TOKEN_SECRET },
      );

      request.address = payload.address;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
