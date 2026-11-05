import { InputType, PartialType } from '@nestjs/graphql';
import { CreateReservationDto } from './create-reservation.dto';

@InputType('UpdateReservationInput')
export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
