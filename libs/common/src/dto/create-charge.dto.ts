import { IsDefined, IsNotEmptyObject, IsNumber, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Field, Float, InputType } from "@nestjs/graphql";
import { CardDto } from "./card..dto";

@InputType('CreateChargeInput')
export class CreateChargeDto {
     @IsDefined()
     @IsNotEmptyObject()
     @ValidateNested()
     @Type(() => CardDto)
     @Field(() => CardDto)
     card!: CardDto;


     @IsNumber()
     @Field(() => Float)
     amount!: number
}
