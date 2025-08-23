import { faker } from '@faker-js/faker';
import { PaymentMethodEnum } from '@modules/payments/core/enums/payment-method.enum';
import { PaymentStatusEnum } from '@modules/payments/core/enums/payment-status.enum';
import { BoletoPaymentResponseDto } from '@modules/payments/dto/boleto-payment.dto';
import {
  CardPaymentRefundResponseDto,
  CardPaymentResponseDto,
} from '@modules/payments/dto/card-payment.dto';
import { PixPaymentResponseDto } from '@modules/payments/dto/pix-payment.dto';

export const mockCardPaymentReponse = (
  payload?: Partial<CardPaymentResponseDto>,
): CardPaymentResponseDto => {
  const { amount, currency, id, status, details } = payload ?? {};
  const cardPayment: CardPaymentResponseDto = {
    id: id ?? faker.string.uuid(),
    amount:
      amount ?? faker.number.float({ fractionDigits: 2, min: 5, max: 100 }),
    currency: currency ?? 'BRL',
    method: PaymentMethodEnum.CARD,
    status: PaymentStatusEnum.APPROVED ?? status,
    details: {
      authorizationCode:
        details?.authorizationCode ?? faker.string.alpha({ length: 6 }),
    },
  };
  return cardPayment;
};

export const mockCardPaymentRefundReponse = (
  payload?: Partial<CardPaymentRefundResponseDto>,
): CardPaymentRefundResponseDto => {
  const { amount, currency, id, status, details } = payload ?? {};
  const cardPayment: CardPaymentRefundResponseDto = {
    id: id ?? faker.string.uuid(),
    amount:
      amount ?? faker.number.float({ fractionDigits: 2, min: 5, max: 100 }),
    currency: currency ?? 'BRL',
    method: PaymentMethodEnum.CARD,
    status: PaymentStatusEnum.APPROVED ?? status,
    details: {
      action: details?.action ?? 'refund_requested',
    },
  };
  return cardPayment;
};

export const mockPixPaymentResponse = (
  payload?: Partial<PixPaymentResponseDto>,
): PixPaymentResponseDto => {
  const { amount, currency, id, status, details } = payload ?? {};
  const pixPayment: PixPaymentResponseDto = {
    id: id ?? faker.string.uuid(),
    amount:
      amount ?? faker.number.float({ fractionDigits: 2, min: 5, max: 100 }),
    currency: currency ?? 'BRL',
    method: PaymentMethodEnum.PIX,
    status: PaymentStatusEnum.APPROVED ?? status,
    details: {
      qrCode: details?.qrCode ?? faker.lorem.sentence(1),
      expiresAt:
        details?.expiresAt ??
        new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  };
  return pixPayment;
};

export const mockBoletoPaymentResponse = (
  payload?: Partial<BoletoPaymentResponseDto>,
): BoletoPaymentResponseDto => {
  const { amount, currency, id, status, details } = payload ?? {};
  const boletoPayment: BoletoPaymentResponseDto = {
    id: id ?? faker.string.uuid(),
    amount:
      amount ?? faker.number.float({ fractionDigits: 2, min: 5, max: 100 }),
    currency: currency ?? 'BRL',
    method: PaymentMethodEnum.BOLETO,
    status: PaymentStatusEnum.PENDING ?? status,
    details: {
      linhaDigitavel: details?.linhaDigitavel ?? faker.lorem.sentence(1),
      barcode: details?.barcode ?? faker.lorem.sentence(1),
      dueDate:
        details?.dueDate ??
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };
  return boletoPayment;
};
