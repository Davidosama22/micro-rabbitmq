import { Type } from "class-transformer";
import { IsDate, IsDefined,  IsNotEmptyObject,  ValidateNested } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";
import { CreateChargeDto } from "@app/common/dto/create-charge.dto";

@InputType('CreateReservationInput')
export class CreateReservationDto {

    @IsDate()
    @Type(() => Date)
    @Field()
    startDate!: Date;
    @IsDate()
    @Type(() => Date)
    @Field()
    endDate!: Date;





    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => CreateChargeDto)
    @Field(() => CreateChargeDto)
    charge!: CreateChargeDto
}
