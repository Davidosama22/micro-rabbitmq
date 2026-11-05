import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './models/user.schema';
import { CurrentUser } from '../../../../libs/common/src/decorators/current-decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersService: UsersService) { }
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto);
        return this.UsersService.createUser(createUserDto);
    }


    @Get()
    @UseGuards(JwtAuthGuard)
    getUser(@CurrentUser() user: UserDocument) {
        return user;
    }
}
