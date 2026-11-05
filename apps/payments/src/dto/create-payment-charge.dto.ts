import { CreateChargeDto } from "@app/common/dto/create-charge.dto";
import { IsEmail } from "class-validator";

export class paymentCreateChargeDto extends CreateChargeDto {
    @IsEmail()
    email!: string;
}