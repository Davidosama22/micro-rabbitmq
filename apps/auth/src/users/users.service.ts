import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepo } from './user.repo';
import { compare, hash } from 'bcryptjs';
import { getUserDto } from './dto/get-user.dto';


@Injectable()
export class UsersService {
    constructor(private readonly userRepo: UserRepo) { }

    async createUser(createUserDto: CreateUserDto) {
        await this.validateCreateUserDto(createUserDto);
        return this.userRepo.create({
            ...createUserDto,
            password: await hash(createUserDto.password, 10),
        });
    }
  async validateCreateUserDto(createUserDto: CreateUserDto) {
    const user = await this.userRepo.findOneOptional({
        email: createUserDto.email,
    });

    if (user) {
        throw new ConflictException('User already exists');
    }
}
    async verifyUser(email: string, password: string) {

        const user = await this.userRepo.findOne({ email });
        if (!user) {
            throw new UnauthorizedException("user not found");
        }
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("wrong password");;
        }
        return user;
    }

    async getUser(getUserDto: getUserDto) {
        {
            return this.userRepo.findOne(getUserDto);
        }
    }

       async findById(id: string) {
        return this.userRepo.findOne({ _id: id });
    }

}