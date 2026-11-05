
import { AUTH_SERVICE } from '@app/common/constants/service';
import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';



export class JwtAuthGuard implements CanActivate {
    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) { }

  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const request = context.switchToHttp().getRequest<{ cookies?: Record<string, string>; user?: unknown }>();
    const jwt = request.cookies?.Authentication;
    if (!jwt) return false
    return this.authClient.send<unknown>('authenticate', {
      Authentication: jwt
    }).pipe(
      tap((res) => { request.user = res; }),
      map(() => true)
    );
  }

}