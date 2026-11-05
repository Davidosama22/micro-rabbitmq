import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepo } from './reservation.repo';
import { PAYMENTS_SERVICE } from '@app/common/constants/service';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, from, switchMap, tap, throwError } from 'rxjs';
import { UserDto } from '@app/common/dto/user.dto';

@Injectable()
export class ReservationService {
  constructor(private readonly ReservationRepo: ReservationRepo,@Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy) { }
create(createReservationDto: CreateReservationDto, { email, _id }: UserDto) {


  return this.paymentsService
    .send<{ id: string }>('create_charge', {
      ...createReservationDto.charge,
      email,
    })
    .pipe(
      tap((res) => {
        console.log('5️⃣ CHARGE RESPONSE:', res);
      }),
      catchError((err) => {
        console.error('🔥 CHARGE FAILED:', err?.message ?? err);
        return throwError(
          () => new BadRequestException(err?.message ?? 'Payment failed'),
        );
      }),
      switchMap((res) => {
        console.log('6️⃣ CREATING RESERVATION');

        return from(
          this.ReservationRepo.create({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId: _id,
          } as Parameters<ReservationRepo['create']>[0]),
        );
      }),
    );
}

 async findAll() {
    return this.ReservationRepo.find({});
  }

 async findOne(_id: string) {
    return this.ReservationRepo.findOne({ _id });
  }

 async update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.ReservationRepo.findOneAndUpdate({ _id: id }, updateReservationDto);
  }

 async remove(id: string) {
    return this.ReservationRepo.findOneAndDelete({ _id: id });
  }
}
