import { UseGuards, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { JwtAuthGuard } from '@app/common';
import { CurrentUser } from '@app/common/decorators/current-decorator';
import type { UserDto } from '@app/common/dto/user.dto';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('input', new ValidationPipe()) input: CreateUserDto) {
    return this.usersService.createUser(input);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: UserDto) {
    return user;
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; _id: string }) {
    return this.usersService.findById(reference._id);
  }
}
