import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ordersRepository } from './orders.repository';
import {
  PaginationByUserDto,
  PaginationCursorNumberDto,
} from '../../schemas/pagination.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository: ordersRepository,
    private readonly mailService: MailService
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    return await this.ordersRepository.create(createOrderDto);
  }

  async updateToPayment(updateOrderDto: any) {
    const dbResponse =
      await this.ordersRepository.updateToPayment(updateOrderDto);
    if (!dbResponse) throw new Error('Error updating order');
    return dbResponse;
  }

  async findAllByUser(paginationByUserDto: PaginationByUserDto) {
    return await this.ordersRepository.getOrdersByUser(paginationByUserDto);
  }

  async findOne(id: number) {
    return await this.ordersRepository.getOrderById(id);
  }

  async findAllAdmin(paginationDto: PaginationCursorNumberDto) {
    return await this.ordersRepository.findAllAdmin(paginationDto);
  }
  async markOrderAsDelivered(orderId: number) {
   return await this.ordersRepository.markOrderAsDelivered(orderId)

  }
}
