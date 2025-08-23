import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { PaymentResult } from '../core/interfaces/payment-result.interface';
import { PaymentBaseDto } from '../core/interfaces/payment-base-dto.interface';

export class CardPaymentRequestDto implements PaymentBaseDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @IsString()
  @Length(13, 19)
  cardNumber!: string;

  @IsString()
  @Length(2, 2)
  expMonth!: string;

  @IsString()
  @Length(2, 2)
  expYear!: string;

  @IsString()
  @Length(3, 4)
  cvv!: string;

  @IsString()
  @IsNotEmpty()
  cardHolder!: string;

  @IsInt()
  @Min(1)
  installments!: number;
}

export interface CardPaymentResponseDto extends PaymentResult {
  details: {
    authorizationCode: string;
  };
}

export interface CardPaymentRefundResponseDto extends PaymentResult {
  details: {
    action: string;
  };
}
