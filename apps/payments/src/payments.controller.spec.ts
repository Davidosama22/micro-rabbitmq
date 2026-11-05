import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('PaymentsController', () => {
  let paymentsController: PaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: { getHello: () => 'Hello World!' },
        },
      ],
    }).compile();

    paymentsController = module.get<PaymentsController>(PaymentsController);
  });

  it('should return "Hello World!"', () => {
    expect(paymentsController.getHello()).toBe('Hello World!');
  });
});
