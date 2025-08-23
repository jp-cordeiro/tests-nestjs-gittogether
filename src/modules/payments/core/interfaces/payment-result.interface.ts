import { PaymentMethodEnum } from '../enums/payment-method.enum';
import { PaymentStatusEnum } from '../enums/payment-status.enum';

export interface PaymentResult {
  id: string;
  method: PaymentMethodEnum;
  status: PaymentStatusEnum;
  amount: number;
  currency: string;
  details: any;
}
