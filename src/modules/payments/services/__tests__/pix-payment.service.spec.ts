import { PixPaymentFailedException } from '@modules/payments/exceptions/pix-payment-failed.exception';
import { PixPaymentFakeRepository } from '@modules/payments/repositories/payment-fake.repositories';
import { PixPaymentService } from '../pix-payment.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsModule } from '@modules/payments/payments.module';
import { mockPixPayment } from '@test/mocks/payments.request.mock';
import { mockPixPaymentResponse } from '@test/mocks/payments.response.mock';
import { PaymentMethodEnum } from '@modules/payments/core/enums/payment-method.enum';

describe('PixPaymentService', () => {
  let service: PixPaymentService;
  let pixRepository: PixPaymentFakeRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PaymentsModule],
    }).compile();

    service = module.get<PixPaymentService>(PixPaymentService);
    pixRepository = module.get<PixPaymentFakeRepository>(
      PixPaymentFakeRepository,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve lançar exceção se payerKey não for informado', async () => {
    await expect(
      service.pay({ amount: 500, currency: 'BRL' } as any),
    ).rejects.toThrow(PixPaymentFailedException);

    await expect(
      service.pay({ amount: 500, currency: 'BRL' } as any),
    ).rejects.toThrow('Chave Pix não informada');
  });

  it('deve lançar exceção se amount ultrapassar o limite Pix', async () => {
    const payload = mockPixPayment({
      amount: 200000,
    });
    await expect(service.pay(payload)).rejects.toThrow(
      PixPaymentFailedException,
    );

    await expect(service.pay(payload)).rejects.toThrow(
      'Valor acima do limite Pix',
    );
  });

  it('deve retornar um resultado válido quando os dados são corretos', async () => {
    const payload = mockPixPayment();
    const mockPixStored = mockPixPaymentResponse();
    jest.spyOn(pixRepository, 'save').mockResolvedValueOnce(mockPixStored);
    const result = await service.pay(payload);

    expect(result.id).toBe(mockPixStored.id);
    expect(result.method).toBe(PaymentMethodEnum.PIX);
    expect(result.status).toBe(mockPixStored.status);
    expect(result.amount).toBe(mockPixStored.amount);
    expect(result.currency).toBe('BRL');
    expect(result.details.qrCode).toBe(mockPixStored.details.qrCode);
  });

  it('deve incluir uma data de expiração 30 minutos após a criação', async () => {
    const now = Date.now();
    jest.spyOn(global.Date, 'now').mockImplementation(() => now);

    const result = await service.pay({
      amount: 100,
      currency: 'BRL',
      payerKey: 'payerKeyTest',
    });

    const expectedExpiration = new Date(now + 30 * 60 * 1000).toISOString();
    expect(result.details.expiresAt).toBe(expectedExpiration);

    (Date.now as jest.Mock).mockRestore();
  });
});
