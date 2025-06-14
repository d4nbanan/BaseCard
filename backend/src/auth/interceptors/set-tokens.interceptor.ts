import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class SetTokensInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const responseObj: Response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap((data: { tokens: { access_token: string } }) => {
        responseObj.setHeader('x-access-token', data.tokens.access_token);

        return data;
      }),
      map(({ tokens, ...data }) => {
        return { ...data };
      }),
    );
  }
}
