import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { AUTH_SERVICE } from "../constants/service";
import { ClientProxy } from "@nestjs/microservices";
import { Observable, catchError, map, of, tap } from "rxjs";
import { UserDto } from "../dto/user.dto";

interface AuthenticatedRequest {
    cookies?: {
        Authentication?: string;
    };
    user?: unknown;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) { }
    canActivate(context: ExecutionContext): boolean | Observable<boolean> {
        const request = this.getRequest(context);

        console.log('COOKIES:', request.cookies);

        const jwt = request.cookies?.Authentication;

        console.log('JWT:', jwt);

        if (!jwt) {
            console.log('NO JWT FOUND');
            return false;
        }

        console.log('SENDING JWT TO AUTH SERVICE...');

        return this.authClient.send<UserDto>('authenticate', {
            Authentication: jwt,
        }).pipe(
            tap((res) => {
                console.log('AUTH RESPONSE:', res);
                request.user = res;
            }),
            map(() => true),
            catchError((error) => {
                console.error('AUTH ERROR:', error);
                return of(false);
            }),
        );
    }

    private getRequest(context: ExecutionContext): AuthenticatedRequest {
        if (context.getType<GqlContextType>() === 'graphql') {
            return GqlExecutionContext.create(context).getContext<{ req: AuthenticatedRequest }>().req;
        }
        return context.switchToHttp().getRequest<AuthenticatedRequest>();
    }
}
