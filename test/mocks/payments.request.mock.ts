import { faker } from '@faker-js/faker';
import { BoletoPaymentRequestDto } from '@modules/payments/dto/boleto-payment.dto';
import { CardPaymentRequestDto } from '@modules/payments/dto/card-payment.dto';
import { PixPaymentRequestDto } from '@modules/payments/dto/pix-payment.dto';

export const mockCardPayment = (
  payload?: Partial<CardPaymentRequestDto>,
): CardPaymentRequestDto => {
  const {
    amount,
    currency,
    cardHolder,
    cardNumber,
    installments,
    expMonth,
    expYear,
    cvv,
  } = payload ?? {};
  const lengthFillExpYear = 2;
  const cardPayment: CardPaymentRequestDto = {
    amount:
      amount ?? faker.number.float({ fractionDigits: 2, min: 5, max: 100 }),
    currency: currency ?? 'BRL',
    cardNumber: cardNumber ?? '4111111111111111',
    installments: installments ?? 3,
    expMonth:
      expMonth ??
      faker.number
        .int({ min: 1, max: 12 })
        .toString()
        .padStart(lengthFillExpYear, '0'),
    expYear: expYear ?? faker.number.int({ min: 30, max: 99 }).toString(),
    cvv: cvv ?? faker.number.int({ min: 111, max: 999 }).toString(),
    cardHolder: cardHolder ?? faker.person.firstName(),
  };
  return cardPayment;
};

export const mockPixPayment = (
  payload?: Partial<PixPaymentRequestDto>,
): PixPaymentRequestDto => {
  const { amount, currency, payerKey } = payload ?? {};
  const pixPayment: PixPaymentRequestDto = {
    amount:
      amount ?? faker.number.float({ fractionDigits: 2, min: 5, max: 100 }),
    currency: currency ?? 'BRL',
    payerKey: payerKey ?? faker.internet.email(),
  };
  return pixPayment;
};

export const mockBoletoPayment = (
  payload?: Partial<BoletoPaymentRequestDto>,
): BoletoPaymentRequestDto => {
  const { amount, currency, payerDocument, payerName } = payload ?? {};
  const boletoPayment = {
    amount:
      amount ?? faker.number.float({ fractionDigits: 2, min: 5, max: 100 }),
    currency: currency ?? 'BRL',
    payerName: payerName ?? faker.person.firstName(),
    payerDocument: payerDocument ?? '12345678901',
  };
  return boletoPayment;
};
