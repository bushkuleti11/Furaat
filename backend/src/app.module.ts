import { Module } from '@nestjs/common';
import { CashierModule } from './cashier/cashier.module';

@Module({
  imports: [CashierModule],
})
export class AppModule {}
