import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE, CreateChargeDataDto } from '@app/common';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {
    const secretKey = configService.get<string>('STRIPE_SECRET_KEY') ?? '';
    this.stripe = new Stripe(secretKey, { apiVersion: '2025-04-30.basil' });
  }

  async createCharge({
    charge: { amount: amountInCents },
    email,
  }: CreateChargeDataDto) {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: { token: 'tok_visa' },
    });

    this.notificationService.emit('notify_email', { email });

    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: paymentMethod.id,
      amount: amountInCents * 100,
      confirm: true,
      payment_method_types: ['card'],
      currency: 'usd',
    });

    return paymentIntent;
  }
}
