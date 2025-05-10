import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, of, tap } from 'rxjs';
import { Request } from 'express';
import { AUTH_SERVICE } from '../constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const jwt: string | undefined = request.cookies?.Authentication;
    if (!jwt) return false;

    return this.authClient.send('authenticate', { Authentication: jwt }).pipe(
      tap((user) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        request.user = user;
      }),
      map(() => true),
      catchError(() => of(true)),
    );
  }
}
