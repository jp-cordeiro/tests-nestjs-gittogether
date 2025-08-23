import { CardPaymentFailedException } from '@modules/payments/exceptions/card-payment-failed.exception';
import { CardPaymentService } from '../card-payment.service';
import { PaymentsModule } from '@modules/payments/payments.module';
import { Test, TestingModule } from '@nestjs/testing';
import { CardPaymentFakeRepository } from '@modules/payments/repositories/payment-fake.repositories';
import { mockCardPayment } from '@test/mocks/payments.request.mock';
import { mockCardPaymentReponse } from '@test/mocks/payments.response.mock';
import { PaymentMethodEnum } from '@modules/payments/core/enums/payment-method.enum';

describe('CardPaymentService', () => {
  let service: CardPaymentService;
  let cardRepository: CardPaymentFakeRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PaymentsModule],
    }).compile();

    service = module.get<CardPaymentService>(CardPaymentService);
    cardRepository = module.get<CardPaymentFakeRepository>(
      CardPaymentFakeRepository,
    );
  });

  describe('pay', () => {
    it('deve aprovar pagamento com cartão válido', async () => {
      const payload = mockCardPayment();
      const mockCardStored = mockCardPaymentReponse();
      jest.spyOn(cardRepository, 'save').mockResolvedValueOnce(mockCardStored);
      const result = await service.pay(payload);

      expect(result.id).toBe(mockCardStored.id);
      expect(result.method).toBe(PaymentMethodEnum.CARD);
      expect(result.status).toBe(mockCardStored.status);
      expect(result.amount).toBe(mockCardStored.amount);
      expect(result.currency).toBe('BRL');
      expect(result.details.authorizationCode).toBe(
        mockCardStored.details.authorizationCode,
      );
    });

    it('deve lançar exceção para cartão recusado', async () => {
      await expect(
        service.pay(mockCardPayment({ cardNumber: '0000123412341234' })),
      ).rejects.toThrow(CardPaymentFailedException);
    });

    it('deve lançar exceção para parcelas acima de 12', async () => {
      await expect(
        service.pay(mockCardPayment({ installments: 13 })),
      ).rejects.toThrow(CardPaymentFailedException);
    });
  });

  describe('refund', () => {
    it('deve solicitar reembolso de pagamento de cartão válido', async () => {
      const paymentId = 'card_123456';
      const result = await service.refund(paymentId);

      expect(result.id).toBe(paymentId);
      expect(result.method).toBe('card');
      expect(result.status).toBe('pending');
      expect(result.details).toEqual({ action: 'refund_requested' });
    });

    it('deve lançar exceção para reembolso de pagamento que não é de cartão', async () => {
      await expect(service.refund('pix_123')).rejects.toThrow(
        CardPaymentFailedException,
      );
    });
  });
});
