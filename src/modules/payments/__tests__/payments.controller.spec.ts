import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from '../payments.controller';
import { CardPaymentRequestDto } from '../dto/card-payment.dto';
import {
  mockBoletoPayment,
  mockCardPayment,
  mockPixPayment,
} from '@test/mocks/payments.request.mock';
import { faker } from '@faker-js/faker';
import { BoletoPaymentRequestDto } from '../dto/boleto-payment.dto';
import { PixPaymentRequestDto } from '../dto/pix-payment.dto';
import { BoletoPaymentService } from '../services/boleto-payment.service';
import { CardPaymentService } from '../services/card-payment.service';
import { PixPaymentService } from '../services/pix-payment.service';
import { PaymentsModule } from '../payments.module';
import { PaymentMethodEnum } from '../core/enums/payment-method.enum';

describe('PaymentsController (integration)', () => {
  let controller: PaymentsController;
  let boletoService: BoletoPaymentService;
  let cardPaymentService: CardPaymentService;
  let pixPaymentService: PixPaymentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PaymentsModule],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    boletoService = module.get<BoletoPaymentService>(BoletoPaymentService);
    cardPaymentService = module.get<CardPaymentService>(CardPaymentService);
    pixPaymentService = module.get<PixPaymentService>(PixPaymentService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CARD', () => {
    let mockRequest: CardPaymentRequestDto;

    beforeEach(() => {
      mockRequest = mockCardPayment();
    });

    it('deve processar pagamento de cartão', async () => {
      const spy = jest.spyOn(cardPaymentService, 'pay');

      const result = await controller.payCard(mockRequest);

      expect(result.method).toBe(PaymentMethodEnum.CARD);
      expect(result.id).toBe('card_id');
      expect(spy).toHaveBeenCalledWith(mockRequest);
    });

    it('deve processar refund de cartão', async () => {
      const idToRefund = `card_${faker.string.uuid()}`;

      const result = await controller.refundCard(idToRefund);
      expect(result.method).toBe(PaymentMethodEnum.CARD);
      expect(result.id).toBe(idToRefund);
      expect(result.details.action).toBe('refund_requested');
    });
  });

  describe('BOLETO', () => {
    let mockRequest: BoletoPaymentRequestDto;

    beforeEach(() => {
      mockRequest = mockBoletoPayment();
    });
    it('deve processar boleto', async () => {
      const spy = jest.spyOn(boletoService, 'pay');

      const result = await controller.payBoleto(mockRequest);

      expect(result.id).toBe('boleto_id');
      expect(spy).toHaveBeenCalledWith(mockRequest);
    });
  });

  describe('PIX', () => {
    let mockRequest: PixPaymentRequestDto;

    beforeEach(() => {
      mockRequest = mockPixPayment();
    });
    it('deve processar pix', async () => {
      const spy = jest.spyOn(pixPaymentService, 'pay');
      const result = await controller.payPix(mockRequest);

      expect(result.method).toBe('pix');
      expect(result.id).toBe('pix_id');
      expect(spy).toHaveBeenCalledWith(mockRequest);
    });
  });
});
