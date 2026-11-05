import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { paymentCreateChargeDto } from './dto/create-payment-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Get()
  getHello(): string {
    return this.paymentsService.getHello();
  }
  @MessagePattern('create_charge')
  @UsePipes(new ValidationPipe())
  async createCharge(@Payload() data: paymentCreateChargeDto) {
     console.log('🔥 CREATE_CHARGE RECEIVED for:', data.email, 'amount:', data.amount);
    return this.paymentsService.createCharge(data);
  }
}
