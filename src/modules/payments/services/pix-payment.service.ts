import { PixPaymentFailedException } from '../exceptions/pix-payment-failed.exception';
import { PaymentTypeService } from '../core/payment-type.service';
import { PaymentMethodEnum } from '../core/enums/payment-method.enum';
import { PaymentStatusEnum } from '../core/enums/payment-status.enum';
import {
  PixPaymentRequestDto,
  PixPaymentResponseDto,
} from '../dto/pix-payment.dto';
import { Injectable } from '@nestjs/common';
import { PixPaymentFakeRepository } from '../repositories/payment-fake.repositories';

function buildQrCodePayload(
  payerKey: string,
  amount: number,
  currency: string,
): string {
  return `000201...52040000...payer:${payerKey}...amount:${amount}...currency:${currency}`;
}

@Injectable()
export class PixPaymentService extends PaymentTypeService {
  constructor(private readonly pixRepository: PixPaymentFakeRepository) {
    super();
  }

  async pay(payload: PixPaymentRequestDto): Promise<PixPaymentResponseDto> {
    const { amount, currency, payerKey } = payload;

    if (!payerKey) {
      throw new PixPaymentFailedException('Chave Pix não informada');
    }
    if (amount > 100000) {
      throw new PixPaymentFailedException('Valor acima do limite Pix', {
        limit: 100000,
      });
    }

    const qrCode = buildQrCodePayload(payerKey, amount, currency);

    const pixFakeStored = await this.pixRepository.save({
      id: 'pix_id',
      method: PaymentMethodEnum.PIX,
      status: PaymentStatusEnum.PENDING,
      amount,
      currency,
      details: {
        qrCode,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      },
    });

    return pixFakeStored;
  }
}
