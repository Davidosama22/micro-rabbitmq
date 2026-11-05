import { UnauthorizedException } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from './users/users.service';
import { User } from './users/models/user.model';
import { UserDocument } from './users/models/user.schema';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => User)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: { res: Response },
  ) {
    let user: UserDocument;
    try {
      user = await this.usersService.verifyUser(email, password);
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
    this.authService.login(user, context.res);
    return user;
  }
}
