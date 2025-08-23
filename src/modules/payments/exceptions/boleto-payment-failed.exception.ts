import { HttpStatus } from '@nestjs/common';
import { PaymentException } from './payment-base.exception';

export class BoletoPaymentFailedException extends PaymentException {
  constructor(
    message = 'Falha na geração/validação do boleto',
    details?: Record<string, any>,
  ) {
    super(message, details, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
