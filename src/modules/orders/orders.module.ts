import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ordersRepository } from './orders.repository';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, ordersRepository, MailService],
  exports: [OrdersService, ordersRepository]
})
export class OrdersModule {}
