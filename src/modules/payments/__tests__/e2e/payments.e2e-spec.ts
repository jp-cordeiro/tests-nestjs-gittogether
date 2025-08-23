import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@app/app.module';
import { HttpExceptionFilter } from '@app/shared/filters/http-exception.filter';
import {
  mockBoletoPayment,
  mockCardPayment,
  mockPixPayment,
} from '@test/mocks/payments.request.mock';

describe('Payments E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/payments/card (POST)', () => {
    it('deve aprovar pagamento', async () => {
      const response = await request(app.getHttpServer())
        .post('/payments/card')
        .send(mockCardPayment())
        .expect(HttpStatus.OK);

      expect(response.body.method).toBe('card');
      expect(response.body.status).toBeDefined();
    });

    it('deve retornar 400 se amount não for numero', async () => {
      return await request(app.getHttpServer())
        .post('/payments/card')
        .send(mockCardPayment({ amount: 'invalid' as any }))
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('deve retornar 400 se currency estiver vazio', async () => {
      return await request(app.getHttpServer())
        .post('/payments/card')
        .send(mockCardPayment({ currency: '' as any }))
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('deve retornar 400 se cardNumber nao for string', async () => {
      return await request(app.getHttpServer())
        .post('/payments/card')
        .send(mockCardPayment({ cardNumber: 1234567890123456 as any }))
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('deve retornar 400 se cardNumber tiver menos que 13 digitos', async () => {
      return await request(app.getHttpServer())
        .post('/payments/card')
        .send(mockCardPayment({ cardNumber: '123456789012' }))
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('deve retornar 400 se cardNumber tiver mais que 19 digitos', async () => {
      return await request(app.getHttpServer())
        .post('/payments/card')
        .send(mockCardPayment({ cardNumber: '12345678901234567890' }))
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  it('/payments/boleto (POST) deve gerar boleto', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments/boleto')
      .send(mockBoletoPayment())
      .expect(HttpStatus.OK);

    expect(response.body.method).toBe('boleto');
    expect(response.body.details.linhaDigitavel).toBeDefined();
  });

  it('/payments/pix (POST) deve gerar qrCode', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments/pix')
      .send(mockPixPayment())
      .expect(HttpStatus.OK);

    expect(response.body.method).toBe('pix');
    expect(response.body.details.qrCode).toBeDefined();
  });

  it('/payments/card (POST) deve falhar para cartão inválido', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments/card')
      .send(mockCardPayment({ cardNumber: '0000111111111111' }))
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.message).toContain('Cartão recusado');
  });
});
