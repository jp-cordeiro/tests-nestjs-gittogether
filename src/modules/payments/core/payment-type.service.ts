import { PaymentBaseDto } from './interfaces/payment-base-dto.interface';
import { PaymentResult } from './interfaces/payment-result.interface';

export abstract class PaymentTypeService {
  abstract pay(payload: PaymentBaseDto): Promise<PaymentResult>;

  async refund?(paymentId: string): Promise<PaymentResult>;
}
