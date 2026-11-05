import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { ExtractJwt } from "passport-jwt";
import { Request } from "express";
import { TokenPayload } from './../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly userService: UsersService
    ) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([
                    (request: Request) => {
                        const cookies = (request as unknown as {
                            cookies?: Record<string, unknown>;
                        }).cookies;
                        const authentication = cookies?.Authentication;

                        return typeof authentication === "string" ? authentication : null;
                    },
                ]),
                secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
            });
    }
    validate(payload: TokenPayload) {
        const { userId } = payload.tokenPayload!;
          console.log("JWT PAYLOAD:", payload);
        return this.userService.getUser({
            _id: userId,
        });
    }
}

