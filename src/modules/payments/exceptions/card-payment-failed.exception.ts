import { HttpStatus } from '@nestjs/common';
import { PaymentException } from './payment-base.exception';

export class CardPaymentFailedException extends PaymentException {
  constructor(
    message = 'Falha no pagamento com cartão',
    details?: Record<string, any>,
  ) {
    super(message, details, HttpStatus.BAD_REQUEST);
  }
}
