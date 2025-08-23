import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  CardPaymentRefundResponseDto,
  CardPaymentRequestDto,
  CardPaymentResponseDto,
} from './dto/card-payment.dto';
import {
  PixPaymentRequestDto,
  PixPaymentResponseDto,
} from './dto/pix-payment.dto';
import {
  BoletoPaymentRequestDto,
  BoletoPaymentResponseDto,
} from './dto/boleto-payment.dto';
import { BoletoPaymentService } from './services/boleto-payment.service';
import { CardPaymentService } from './services/card-payment.service';
import { PixPaymentService } from './services/pix-payment.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly boletoPaymentService: BoletoPaymentService,
    private readonly cardPaymentService: CardPaymentService,
    private readonly pixPaymentService: PixPaymentService,
  ) {}

  @Post('card')
  @HttpCode(HttpStatus.OK)
  async payCard(
    @Body() dto: CardPaymentRequestDto,
  ): Promise<CardPaymentResponseDto> {
    return this.cardPaymentService.pay(dto);
  }

  @Post('boleto')
  @HttpCode(HttpStatus.OK)
  async payBoleto(
    @Body() dto: BoletoPaymentRequestDto,
  ): Promise<BoletoPaymentResponseDto> {
    return this.boletoPaymentService.pay(dto);
  }

  @Post('pix')
  @HttpCode(HttpStatus.OK)
  async payPix(
    @Body() dto: PixPaymentRequestDto,
  ): Promise<PixPaymentResponseDto> {
    return this.pixPaymentService.pay(dto);
  }

  // Exemplo de refund cartão
  @Post('card/:id/refund')
  @HttpCode(HttpStatus.ACCEPTED)
  async refundCard(
    @Param('id') id: string,
  ): Promise<CardPaymentRefundResponseDto> {
    return this.cardPaymentService.refund(id);
  }
}
