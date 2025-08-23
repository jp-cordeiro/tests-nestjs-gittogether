import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';
import { PaymentResult } from '../core/interfaces/payment-result.interface';
import { PaymentBaseDto } from '../core/interfaces/payment-base-dto.interface';

export class BoletoPaymentRequestDto implements PaymentBaseDto {
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @IsString()
  @IsNotEmpty()
  payerName!: string;

  @IsString()
  @IsNotEmpty()
  payerDocument!: string;
}

export interface BoletoPaymentResponseDto extends PaymentResult {
  details: {
    linhaDigitavel: string;
    barcode: string;
    dueDate: string;
  };
}
