import {
  mockBoletoPaymentResponse,
  mockCardPaymentReponse,
  mockPixPaymentResponse,
} from '@test/mocks/payments.response.mock';
import { PixPaymentResponseDto } from '../dto/pix-payment.dto';
import { Injectable } from '@nestjs/common';
import { BoletoPaymentResponseDto } from '../dto/boleto-payment.dto';
import { CardPaymentResponseDto } from '../dto/card-payment.dto';

@Injectable()
export class BoletoPaymentFakeRepository {
  save(payment: BoletoPaymentResponseDto): Promise<any> {
    // Simula o salvamento de um pagamento de boleto
    return Promise.resolve(mockBoletoPaymentResponse({ ...payment }));
  }
}

@Injectable()
export class CardPaymentFakeRepository {
  save(payment: CardPaymentResponseDto): Promise<any> {
    // Simula o salvamento de um pagamento de cartão
    return Promise.resolve(mockCardPaymentReponse({ ...payment }));
  }
}

@Injectable()
export class PixPaymentFakeRepository {
  save(payment: PixPaymentResponseDto): Promise<any> {
    // Simula o salvamento de um pagamento Pix
    return Promise.resolve(mockPixPaymentResponse({ ...payment }));
  }
}
