import { HttpException, HttpStatus } from '@nestjs/common';

export class PaymentException extends HttpException {
  constructor(
    message: string,
    details?: Record<string, any>,
    status = HttpStatus.BAD_REQUEST,
  ) {
    super({ message, details }, status);
  }
}
