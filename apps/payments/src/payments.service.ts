import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { NOTIFICATIONS_SERVICE } from '@app/common/constants/service';
import { ClientProxy } from '@nestjs/microservices';
import { paymentCreateChargeDto } from './dto/create-payment-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService,@Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy) {
    this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'));
  }

  getHello(): string {
    return 'Hello World!';
  }
async createCharge({ amount, email }: paymentCreateChargeDto) {
  console.log('💰 PAYMENT DATA:', { amount, email });

  try {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      confirm: true,
      currency: 'usd',
      payment_method: 'pm_card_visa',
      payment_method_types: ['card'],
    });

    console.log('✅ STRIPE RESPONSE:', paymentIntent.id);

    this.notificationsService.emit('notify_email', { email, text: `${amount}` });

    return paymentIntent;
  } catch (error) {
    console.error('🔥 STRIPE ERROR:', error);
    throw error;
  }
}
}
