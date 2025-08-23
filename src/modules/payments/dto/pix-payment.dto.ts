import { IsNumber, IsString, IsNotEmpty, Min } from 'class-validator';
import { PaymentResult } from '../core/interfaces/payment-result.interface';
import { PaymentBaseDto } from '../core/interfaces/payment-base-dto.interface';

export class PixPaymentRequestDto implements PaymentBaseDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @IsString()
  @IsNotEmpty()
  payerKey!: string; // email|cpf|cnpj|phone|random
}

export interface PixPaymentResponseDto extends PaymentResult {
  details: {
    qrCode: string;
    expiresAt: string;
  };
}
