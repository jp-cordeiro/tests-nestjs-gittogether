import { BoletoPaymentFailedException } from '../exceptions/boleto-payment-failed.exception';
import { PaymentTypeService } from '../core/payment-type.service';
import { PaymentMethodEnum } from '../core/enums/payment-method.enum';
import { PaymentStatusEnum } from '../core/enums/payment-status.enum';
import {
  BoletoPaymentRequestDto,
  BoletoPaymentResponseDto,
} from '../dto/boleto-payment.dto';
import { BoletoPaymentFakeRepository } from '../repositories/payment-fake.repositories';
import { Injectable } from '@nestjs/common';

function generateBoletoDigits(amount: number): string {
  const base = `34191.79001 01043.510047 91020.150008 ${Math.floor(amount).toString().padStart(10, '0')}`;
  return base;
}

@Injectable()
export class BoletoPaymentService extends PaymentTypeService {
  constructor(private readonly boletoRepository: BoletoPaymentFakeRepository) {
    super();
  }

  async pay(
    payload: BoletoPaymentRequestDto,
  ): Promise<BoletoPaymentResponseDto> {
    const { amount, currency, payerDocument } = payload;

    if (!/^\d{11}|\d{14}$/.test(String(payerDocument))) {
      throw new BoletoPaymentFailedException('Documento do pagador inválido', {
        payerDocument,
      });
    }

    const linhaDigitavel = generateBoletoDigits(amount);
    const barcode = linhaDigitavel.replace(/\D/g, '');

    if (amount < 5) {
      throw new BoletoPaymentFailedException('Valor mínimo para boleto é 5', {
        amount,
      });
    }

    const boletoFakeStored = await this.boletoRepository.save({
      id: 'boleto_id',
      method: PaymentMethodEnum.BOLETO,
      status: PaymentStatusEnum.PENDING,
      amount,
      currency,
      details: {
        linhaDigitavel,
        barcode,
        dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      },
    });

    return boletoFakeStored;
  }
}
