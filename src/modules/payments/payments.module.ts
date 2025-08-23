import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import {
  BoletoPaymentFakeRepository,
  CardPaymentFakeRepository,
  PixPaymentFakeRepository,
} from './repositories/payment-fake.repositories';
import { PixPaymentService } from './services/pix-payment.service';
import { BoletoPaymentService } from './services/boleto-payment.service';
import { CardPaymentService } from './services/card-payment.service';

@Module({
  controllers: [PaymentsController],
  providers: [
    PixPaymentService,
    BoletoPaymentService,
    CardPaymentService,
    BoletoPaymentFakeRepository,
    CardPaymentFakeRepository,
    PixPaymentFakeRepository,
  ],
  exports: [
    PixPaymentService,
    BoletoPaymentService,
    CardPaymentService,
    PixPaymentService,
  ],
})
export class PaymentsModule {}
