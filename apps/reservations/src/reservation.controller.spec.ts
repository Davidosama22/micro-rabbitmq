import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { AUTH_SERVICE, PAYMENTS_SERVICE } from '@app/common/constants/service';

describe('ReservationController', () => {
  let controller: ReservationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        { provide: ReservationService, useValue: {} },
        { provide: PAYMENTS_SERVICE, useValue: {} },
        { provide: AUTH_SERVICE, useValue: {} },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
