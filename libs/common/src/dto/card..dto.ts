import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { Field, InputType, Int } from "@nestjs/graphql";


@InputType('CardInput')
export class CardDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.replace(/\s+/g, '') : value))
    @IsCreditCard()
    @IsNotEmpty()
    @Field()
    number!: string;

    @IsNumber()
    @IsNotEmpty()
    @Field(() => Int)
    exp_month!: number;

    @IsNumber()
    @IsNotEmpty()
    @Field(() => Int)
    exp_year!: number;

    @IsString()
    @IsNotEmpty()
    @Field()
    cvc!: string;
  }
