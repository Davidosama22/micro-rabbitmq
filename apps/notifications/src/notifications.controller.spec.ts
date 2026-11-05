import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

describe('NotificationsController', () => {
  let notificationsController: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationsService,
          useValue: { notifyEmail: jest.fn() },
        },
      ],
    }).compile();

    notificationsController = module.get<NotificationsController>(
      NotificationsController,
    );
  });

  it('should be defined', () => {
    expect(notificationsController).toBeDefined();
  });
});
