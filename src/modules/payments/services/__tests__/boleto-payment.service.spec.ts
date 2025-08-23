import { BoletoPaymentFailedException } from '@modules/payments/exceptions/boleto-payment-failed.exception';
import { BoletoPaymentService } from '../boleto-payment.service';
import { mockBoletoPayment } from '@test/mocks/payments.request.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsModule } from '@modules/payments/payments.module';
import { BoletoPaymentFakeRepository } from '@modules/payments/repositories/payment-fake.repositories';
import { mockBoletoPaymentResponse } from '@test/mocks/payments.response.mock';
import { PaymentMethodEnum } from '@modules/payments/core/enums/payment-method.enum';

describe('BoletoPaymentService', () => {
  let boletoService: BoletoPaymentService;
  let boletoRepository: BoletoPaymentFakeRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PaymentsModule],
    }).compile();

    boletoService = module.get<BoletoPaymentService>(BoletoPaymentService);
    boletoRepository = module.get<BoletoPaymentFakeRepository>(
      BoletoPaymentFakeRepository,
    );
  });

  it('deve gerar um boleto válido quando os dados são corretos', async () => {
    const payload = mockBoletoPayment();
    const mockBoletoStored = mockBoletoPaymentResponse();
    jest
      .spyOn(boletoRepository, 'save')
      .mockResolvedValueOnce(mockBoletoStored);

    const result = await boletoService.pay(payload);

    expect(result.id).toBe(mockBoletoStored.id);
    expect(result.method).toBe(PaymentMethodEnum.BOLETO);
    expect(result.status).toBe(mockBoletoStored.status);
    expect(result.amount).toBe(mockBoletoStored.amount);
    expect(result.currency).toBe(mockBoletoStored.currency);
    expect(result.details).toHaveProperty('linhaDigitavel');
    expect(result.details).toHaveProperty('barcode');
    expect(result.details).toHaveProperty('dueDate');
    expect(result.details.linhaDigitavel).toBe(
      mockBoletoStored.details.linhaDigitavel,
    );
  });

  it('deve falhar se o documento do pagador for inválido', async () => {
    const payload = mockBoletoPayment();
    payload.payerDocument = 'invalid';
    const promise = boletoService.pay(payload);

    await expect(promise).rejects.toThrow(BoletoPaymentFailedException);
    await expect(promise).rejects.toThrow('Documento do pagador inválido');
  });

  it('deve falhar se o valor for menor que 5', async () => {
    const payload = mockBoletoPayment();
    payload.amount = 4.99;
    const promise = boletoService.pay(payload);

    await expect(promise).rejects.toThrow(BoletoPaymentFailedException);
    await expect(promise).rejects.toThrow('Valor mínimo para boleto é 5');
  });

  it('deve aceitar CNPJ válido (14 dígitos)', async () => {
    const payload = mockBoletoPayment();

    const result = await boletoService.pay(payload);

    expect(result.method).toBe('boleto');
    expect(result.details.barcode).toHaveLength(42);
  });
});
