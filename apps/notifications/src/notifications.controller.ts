import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly notificationsService: NotificationsService) { }

  @UsePipes(new ValidationPipe())
  @EventPattern('notify_email')
  async notifyEmail(@Payload() data: NotifyEmailDto) {
    this.logger.log(`notify_email received for ${data.email}`);
    try {
      await this.notificationsService.notifyEmail(data);
      this.logger.log(`notify_email sent to ${data.email}`);
    } catch (error) {
      this.logger.error(
        `notify_email failed for ${data.email}: ${(error as Error).message}`,
      );
    }
  }
}
