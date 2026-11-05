import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Inject } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '@app/common';
import { CurrentUser } from '@app/common/decorators/current-decorator';
import type { UserDto } from '@app/common/dto/user.dto';
import { PAYMENTS_SERVICE } from '@app/common/constants/service';
import { ClientProxy } from '@nestjs/microservices';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy
  ) { }

@Post()
@UseGuards(JwtAuthGuard)
create(
  @Body() createReservationDto: CreateReservationDto,
  @CurrentUser() user: UserDto,
) {
    console.log('CURRENT USER:', user);
      console.log('BODY:', createReservationDto);
  return this.reservationService.create(
    createReservationDto,
    user,
  );
}
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') _id: string) {
    return this.reservationService.findOne(_id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.reservationService.remove(id);
  }
}
