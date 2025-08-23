import { Module } from '@nestjs/common';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [PaymentsModule],
})
export class AppModule {}
