import { Body, Controller, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '../../../libs/common/src/decorators/current-decorator';
import { UserDocument } from './users/models/user.schema';
import type { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly JwtService: JwtService, private readonly UsersService: UsersService) { }



  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() req, @CurrentUser() user: UserDocument, @Res({ passthrough: true }) res: Response) {
    this.authService.login(user, res);
    res.send(user);
  }



@MessagePattern('authenticate')
async authenticate(
  @Payload() data: { Authentication: string },
) {
  console.log('AUTH SERVICE RECEIVED:', data);

  const token = data.Authentication;

  const payload = await this.JwtService.verifyAsync<{
    tokenPayload: {
      userId: string;
    };
  }>(token);

  console.log('VERIFIED PAYLOAD:', payload);

  const user = await this.UsersService.findById(
    payload.tokenPayload.userId,
  );

  console.log('FOUND USER:', user);

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  return user;
}
}
