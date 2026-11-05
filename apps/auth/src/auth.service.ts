import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService, private readonly UsersService: UsersService) { }


  register(createUserDto: any) {

    return this.UsersService.createUser(createUserDto);
  }

  login(user: UserDocument, res: Response) {

    const tokenPayload:TokenPayload = {
      
      userId: user._id.toHexString()
    };


    const token = this.jwtService.sign({ tokenPayload })

    res.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // ساعة
    });

  }


}
