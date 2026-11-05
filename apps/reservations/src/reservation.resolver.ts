import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { JwtAuthGuard } from '@app/common';
import { CurrentUser } from '@app/common/decorators/current-decorator';
import type { UserDto } from '@app/common/dto/user.dto';
import { ReservationService } from './reservation.service';
import { Reservation } from './entities/reservation.model';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Resolver(() => Reservation)
@UseGuards(JwtAuthGuard)
export class ReservationResolver {
  constructor(private readonly reservationService: ReservationService) {}

  @Mutation(() => Reservation)
  createReservation(
    @Args('input') input: CreateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.reservationService.create(input, user);
  }

  @Query(() => [Reservation], { name: 'reservations' })
  findAll() {
    return this.reservationService.findAll();
  }

  @Query(() => Reservation, { name: 'reservation' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.reservationService.findOne(id);
  }

  @Mutation(() => Reservation)
  updateReservation(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, input);
  }

  @Mutation(() => Reservation)
  removeReservation(@Args('id', { type: () => ID }) id: string) {
    return this.reservationService.remove(id);
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; _id: string }) {
    return this.reservationService.findOne(reference._id);
  }
}
