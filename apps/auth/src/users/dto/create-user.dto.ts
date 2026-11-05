import { IsEmail, IsStrongPassword } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType('CreateUserInput')
export class CreateUserDto{
    @IsEmail()
    @Field()
    email!: string;
    @IsStrongPassword()
    @Field()
    password!: string;
}
