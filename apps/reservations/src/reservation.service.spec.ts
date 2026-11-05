import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { ReservationRepo } from './reservation.repo';
import { PAYMENTS_SERVICE } from '@app/common/constants/service';

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        { provide: ReservationRepo, useValue: {} },
        { provide: PAYMENTS_SERVICE, useValue: {} },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
