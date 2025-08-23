import { CardPaymentFailedException } from '../exceptions/card-payment-failed.exception';
import { PaymentTypeService } from '../core/payment-type.service';
import {
  CardPaymentRefundResponseDto,
  CardPaymentRequestDto,
  CardPaymentResponseDto,
} from '../dto/card-payment.dto';
import { PaymentMethodEnum } from '../core/enums/payment-method.enum';
import { PaymentStatusEnum } from '../core/enums/payment-status.enum';
import { Injectable } from '@nestjs/common';
import { CardPaymentFakeRepository } from '../repositories/payment-fake.repositories';

@Injectable()
export class CardPaymentService extends PaymentTypeService {
  constructor(private readonly cardRepository: CardPaymentFakeRepository) {
    super();
  }

  async pay(payload: CardPaymentRequestDto): Promise<CardPaymentResponseDto> {
    const { amount, currency, cardNumber, installments } = payload;

    // Regras fictícias para simular falhas e aprovações:
    if (String(cardNumber).startsWith('0000')) {
      throw new CardPaymentFailedException('Cartão recusado pelo emissor', {
        reason: 'invalid_card',
      });
    }
    if (installments > 12) {
      throw new CardPaymentFailedException(
        'Número de parcelas excede o permitido',
        { maxInstallments: 12 },
      );
    }

    const cardFakeStored = await this.cardRepository.save({
      id: 'card_id',
      method: PaymentMethodEnum.CARD,
      status: PaymentStatusEnum.APPROVED,
      amount,
      currency,
      details: {
        authorizationCode: Math.floor(
          Math.random() * 900000 + 100000,
        ).toString(),
      },
    });

    return cardFakeStored;
  }

  async refund(paymentId: string): Promise<CardPaymentRefundResponseDto> {
    if (!paymentId.startsWith('card_')) {
      throw new CardPaymentFailedException('Pagamento não é de cartão', {
        paymentId,
      });
    }
    return {
      id: paymentId,
      method: PaymentMethodEnum.CARD,
      status: PaymentStatusEnum.PENDING,
      amount: 0,
      currency: 'BRL',
      details: { action: 'refund_requested' },
    };
  }
}
