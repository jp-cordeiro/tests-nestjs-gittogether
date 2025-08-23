import { HttpStatus } from '@nestjs/common';
import { PaymentException } from './payment-base.exception';

export class PixPaymentFailedException extends PaymentException {
  constructor(
    message = 'Falha no pagamento via Pix',
    details?: Record<string, any>,
  ) {
    super(message, details, HttpStatus.BAD_GATEWAY);
  }
}
